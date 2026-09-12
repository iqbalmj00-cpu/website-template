/* Focused offline copy checks. Optional QA_COPY_OUTPUT_DIR writes only fixture
 * artifacts to the caller's task directory. No app server or network services. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const jsx = require('react/jsx-runtime');
const { renderToStaticMarkup } = require('react-dom/server');
const root = path.resolve(__dirname, '..');
const allowed = new Set(['lib/siteConfig.ts', 'lib/bookingFlow.ts', 'lib/serviceNavigation.ts', 'lib/catalogs/services.ts',
    'lib/catalogs/faqs.ts', 'lib/visibility.ts', 'lib/templateAssets/junkRemoval.ts',
    'components/redesign/DispatchBlocks.tsx', 'components/redesign/HomePageContent.tsx']);
const mapCalls = [];
function loader(env = {}) {
    const cache = new Map();
    function load(relative) {
        assert.ok(allowed.has(relative), `Unapproved source dependency: ${relative}`);
        if (cache.has(relative)) return cache.get(relative).exports;
        const module = { exports: {} }; cache.set(relative, module);
        const file = path.join(root, relative);
        const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { fileName: file, compilerOptions: {
            module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
        } }).outputText;
        const req = name => {
            if (name === 'react/jsx-runtime') return jsx;
            if (name === 'react') return React;
            if (name === 'lucide-react') return require('lucide-react');
            if (name === 'next/link') return { __esModule: true, default: ({ children, prefetch, ...props }) => React.createElement('a', props, children) };
            if (name === '@/components/SafeImage') return { __esModule: true, default: () => React.createElement('div', { 'data-fixture-image': true }) };
            if (name === '@/components/redesign/ServiceAreaMap') return { __esModule: true, default: props => {
                mapCalls.push(props); return React.createElement('div', { className: 'map-box', 'data-fixture-map': true }, 'Synthetic map placeholder');
            } };
            if (name === '@/components/redesign/RichFAQ') return { __esModule: true, default: ({ items }) => React.createElement('section', { className: 'section', id: 'faq' },
                React.createElement('h2', null, 'Questions before booking'), ...items.map((item, i) => React.createElement('div', { key: i }, React.createElement('h3', null, item.q), React.createElement('p', null, item.a)))) };
            if (name === '@/components/redesign/VisualReplacementBlocks') return { VisualPricingScaleSection: () => null };
            if (name === '@/components/redesign/Credentials') return { __esModule: true, default: () => null };
            if (name.startsWith('@/') || name.startsWith('.')) {
                const base = name.startsWith('@/') ? name.slice(2) : path.posix.join(path.posix.dirname(relative), name);
                const target = [base, base + '.ts', base + '.tsx'].find(candidate => allowed.has(candidate));
                assert.ok(target, `Unapproved source import: ${name}`); return load(target);
            }
            throw Error(`Unapproved dependency: ${name}`);
        };
        vm.runInNewContext(code, { module, exports: module.exports, require: req, process: { env }, console,
            URL, Intl, fetch: () => { throw Error('No network permitted'); } }, { filename: file });
        return module.exports;
    }
    return load;
}
function main() {
    let cases = 0;
    const load = loader();
    const cfg = load('lib/siteConfig.ts');
    const blocks = load('components/redesign/DispatchBlocks.tsx');
    const home = load('components/redesign/HomePageContent.tsx');
    const faqs = load('lib/catalogs/faqs.ts');
    const areas = Array.from({ length: 34 }, (_, i) => `Community ${i + 1}`);
    const base = { ...cfg.siteConfig, city: 'Example City', state: 'TX', serviceArea: areas.join(', '), tagline: '',
        companyName: 'Fixture Hauling', heroHeadline: cfg.defaultHeroHeadline('Example City'), services: ['junk-removal'], companyMode: 'both', offersDumpsterRental: true, sameDayEnabled: true };
    const render = (Component, config, extra = {}) => renderToStaticMarkup(React.createElement(Component, { config, ...extra }));
    const plain = s => s.replace(/<[^>]*>/g, '');
    for (const [delta, expected] of [
        [{}, 'Example City, TX and nearby communities'],
        [{ state: '' }, 'Example City and nearby communities'],
        [{ serviceArea: 'One Town' }, 'Example City, TX and nearby communities'],
        [{ city: '', serviceArea: 'One Town' }, 'One Town and nearby communities'],
        [{ city: 'Your City', serviceArea: 'One Town' }, 'One Town and nearby communities'],
        [{ city: ' YOUR CITY ', serviceArea: areas.join(', ') }, 'your area'],
        [{ city: '', serviceArea: '' }, 'your area'],
        [{ city: 'Your City', serviceArea: 'your area' }, 'your area'],
        [{ city: '', serviceArea: '77001' }, 'your area'],
        [{ city: '', serviceArea: 'surrounding areas' }, 'your area'],
    ]) {
        const config = { ...base, ...delta }; const before = JSON.stringify(config);
        assert.equal(cfg.getHomeAreaSummary(config), expected);
        const hero = plain(render(blocks.DispatchHomeHero, config));
        assert.ok(hero.includes(`Book professional junk removal in ${expected}.`));
        const coverage = plain(render(blocks.DispatchAreaSection, config));
        if (coverage) assert.ok(coverage.includes(`Fixture Hauling serves ${expected}.`));
        assert.ok(plain(render(blocks.DispatchFinalCta, config)).includes(`schedule for ${expected}.`));
        assert.ok(home.buildHomeFaqs(config).some(item => item.a.includes(expected)));
        assert.equal(JSON.stringify(config), before); cases++;
    }
    for (const tagline of ['Custom words.', 'Example City, Community 2, Community 3 — our neighbors.',
        `Book professional junk removal in ${base.serviceArea}. Pricing is based on load size, access, and job details. Call us!`, '  Intentional custom text  ']) {
        const config = { ...base, tagline };
        assert.equal(cfg.getHomeHeroTagline(config), tagline);
        assert.equal(cfg.createSiteConfigFromPublicConfig({ displayCity: 'New City', tagline: '' }, config).tagline, tagline);
        assert.equal(cfg.createSiteConfigFromPublicConfig({ tagline }, base).tagline, tagline);
        assert.ok(plain(render(blocks.DispatchHomeHero, config)).includes(tagline)); cases++;
    }
    const legacy = config => `Book professional junk removal in ${config.serviceArea && config.serviceArea !== 'your area' ? config.serviceArea : [config.city, config.state].filter(Boolean).join(', ') || 'your service area'}. Pricing is based on load size, access, and job details.`;
    for (const config of [base, { ...base, serviceArea: 'your area' }, { ...base, city: '', state: '', serviceArea: '' }]) {
        const generated = { ...config, tagline: legacy(config) };
        assert.equal(cfg.getHomeHeroTagline(generated), cfg.getHomeHeroTagline(config));
        for (const input of [{ displayCity: 'New City' }, { displayCity: 'New City', tagline: '' }, { displayCity: 'New City', tagline: 'New custom words' }]) {
            const preview = cfg.createSiteConfigFromPublicConfig(input, generated);
            assert.equal(preview.serviceArea, config.serviceArea);
            assert.equal(preview.tagline, input.tagline || cfg.getHomeHeroTagline({ ...preview, tagline: '' }));
            assert.ok(plain(render(blocks.DispatchHomeHero, preview)).includes(preview.tagline));
        }
        cases++;
    }
    for (const env of [{}, { NEXT_PUBLIC_TAGLINE: '' }, { NEXT_PUBLIC_TAGLINE: legacy(base) }]) {
        const module = loader({ NEXT_PUBLIC_CITY: base.city, NEXT_PUBLIC_STATE: base.state, NEXT_PUBLIC_SERVICE_AREA: base.serviceArea, ...env })('lib/siteConfig.ts');
        const expected = !Object.hasOwn(env, 'NEXT_PUBLIC_TAGLINE') ? 'We haul it all — fast, fair, and friendly.' : cfg.getHomeHeroTagline(base);
        assert.equal(module.getHomeHeroTagline(module.siteConfig), expected); cases++;
    }
    const coverage = render(blocks.DispatchAreaSection, base);
    const links = [...coverage.matchAll(/href="(\/locations[^" ]*)"/g)].map(match => match[1]);
    assert.deepEqual(links, ['/locations/example-city', ...areas.slice(0, 7).map(name => '/locations/' + name.toLowerCase().replaceAll(' ', '-')), '/locations']);
    assert.match(coverage, /View all service areas/); assert.equal(mapCalls.at(-1).config, base);
    assert.equal(cfg.getServiceAreas(base).length, 34); assert.equal(base.serviceArea, areas.join(', ')); cases++;
    const focus = { name: 'Focused Town', lat: 1, lng: 2 };
    assert.ok(plain(render(blocks.DispatchAreaSection, base, { focus })).includes('Fixture Hauling highlights Focused Town on this location page. Exact pickup address coverage is confirmed during booking.'));
    assert.equal(mapCalls.at(-1).focus, focus);
    assert.ok(plain(render(blocks.DispatchFinalCta, base, { body: 'Explicit CTA body' })).includes('Explicit CTA body')); cases++;
    const expectedItems = 'See our Services page for the items and cleanouts we handle. Tell us what you need removed when you book.';
    assert.equal(faqs.FAQ_POOL.find(item => item.id === 'items-what-you-take').answer, expectedItems);
    assert.ok(home.buildHomeFaqs(base).some(item => item.a === expectedItems));
    assert.deepEqual(Array.from(home.buildHomeFaqs({ ...base, companyMode: 'dumpster_rental' }), item => item.a), [
        'Choose a listed container size, describe the debris, and request a delivery date and window. Availability and rental terms need confirmation.',
        'Check the dumpster rental page for the listed base rates, included days, weight allowances, and extra charges.',
    ]); cases++;
    for (const enabled of [false, true]) {
        const eligible = faqs.filterFaqs({ sameDayEnabled: enabled, offersDumpsterRental: enabled, hasCommercial: enabled });
        for (const rule of ['same-day', 'dumpster', 'commercial']) {
            const configured = faqs.FAQ_POOL.filter(item => item.showIf === rule);
            assert.deepEqual(Array.from(eligible.filter(item => item.showIf === rule), item => item.id), enabled ? Array.from(configured, item => item.id) : []);
        }
        assert.equal(faqs.resolveTokens('{{serviceArea}} / {{city}}', { serviceArea: base.serviceArea, city: base.city }), `${base.serviceArea} / ${base.city}`); cases++;
    }
    const html = render(home.default, base);
    assert.ok(!html.includes(base.serviceArea)); assert.match(html, /View all service areas/); cases++;
    if (process.env.QA_COPY_OUTPUT_DIR) {
        const out = path.resolve(process.env.QA_COPY_OUTPUT_DIR); assert.ok(!out.startsWith(root + path.sep)); fs.mkdirSync(out, { recursive: true });
        fs.writeFileSync(path.join(out, 'home-fragment.html'), html);
        fs.writeFileSync(path.join(out, 'dumpster-fragment.html'), render(home.default, { ...base, companyMode: 'dumpster_rental' }));
        fs.writeFileSync(path.join(out, 'copy-check.json'), JSON.stringify({ cases, status: 'PASS', runtime: process.version, areas: 34, existingChips: 8, addedDirectoryLink: true }, null, 2));
    }
    console.log(`PASS ${cases} copy case groups: actual helpers and home render, 34/single/missing/placeholder locations, custom/generated/env/preview taglines, eight chips plus directory link, full map/area data, focus/explicit CTA and FAQ eligibility. Visual/provider child boundaries are inert.`);
}
main();
