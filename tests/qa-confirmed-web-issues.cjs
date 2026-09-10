/* Isolated source regression harness: installed TypeScript + React, no emitted files,
 * real accounts, environment files, or outbound network. Effects/Stripe are mocked. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const root = path.resolve(__dirname, '..');
const widget = fs.existsSync(path.join(root, 'src/components/Widget.tsx'));
const source = widget ? path.join(root, 'src') : root;
class FixtureDate extends Date {
    constructor(...args) { super(...(args.length ? args : ['2026-09-08T16:00:00Z'])); }
    static now() { return Date.parse('2026-09-08T16:00:00Z'); }
}
const deny = () => { throw new Error('Unexpected outbound fetch'); };

function loader(mocks = {}, globals = {}) {
    const cache = new Map();
    const context = vm.createContext({ console, crypto:require("node:crypto").webcrypto, URL, URLSearchParams, Date:FixtureDate, Intl, Promise, setTimeout, clearTimeout, performance: { getEntriesByType: () => [{ type: 'reload' }] }, process: { env: {} }, fetch: deny, ...globals });
    function load(file) {
        file = path.resolve(file);
        if (mocks[file]) return mocks[file];
        if (cache.has(file)) return cache.get(file).exports;
        const module = { exports: {} }; cache.set(file, module);
        const js = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
        const req = name => {
            if (Object.hasOwn(mocks, name)) return mocks[name];
            if (name === 'server-only') return {}; // Next boundary marker; fixture env stays empty.
            if(name === 'lucide-react') return new Proxy({}, { get:(_, key)=>key==='__esModule'?true:()=>null });
            if(name === 'next/link') return {__esModule:true,default:({href,children,prefetch,...props})=>React.createElement('a',{...props,href},children)};
            if(name === 'next/image') return {__esModule:true,default:()=>null};
            if(name === 'next/navigation') return {usePathname:()=>'/about',redirect:()=>{throw Error('Unexpected redirect')},notFound:()=>{throw Error('Unexpected notFound')}};
            if (name.startsWith('.') || name.startsWith('@/')) {
                const candidate = name.startsWith('@/') ? path.join(source, name.slice(2)) : path.resolve(path.dirname(file), name);
                const resolved = [candidate, candidate + '.ts', candidate + '.tsx'].find(f => fs.existsSync(f) && fs.statSync(f).isFile());
                if (!resolved) throw new Error(`Missing source import ${name}`);
                return load(resolved);
            }
            if (['react', 'react/jsx-runtime', 'react-dom/server', 'lucide-react', 'assert'].includes(name)) return require(name);
            throw new Error(`Unmocked import ${name}`);
        };
        vm.runInContext(`(function(require,module,exports){${js}\n})`, context, { filename: file })(req, module, module.exports);
        return module.exports;
    }
    return { load, context };
}
function hooks() {
    const state = []; let index = 0, pending = [], changed = false, renderFn, result;
    const equal = (a, b) => a && b && a.length === b.length && a.every((v, i) => Object.is(v, b[i]));
    const api = { ...React,
        useState(init) { const i=index++; if (!state[i]) state[i]={ value: typeof init === 'function' ? init() : init }; return [state[i].value, value => { const v=typeof value==='function'?value(state[i].value):value; if(!Object.is(v,state[i].value)){state[i].value=v;changed=true;} }]; },
        useRef(value) { const i=index++; return state[i] ||= { current:value }; },
        useMemo(fn,deps) { const i=index++; if(!state[i] || !equal(state[i].deps,deps)) state[i]={deps,value:fn()}; return state[i].value; },
        useCallback(fn,deps) { return api.useMemo(()=>fn,deps); },
        useId() { return api.useMemo(()=>`fixture-${index}`,[]); },
        useEffect(fn,deps) { const i=index++; if(!state[i] || !equal(state[i].deps,deps)){const old=state[i];state[i]={deps};pending.push(()=>{old?.cleanup?.();state[i].cleanup=fn();});} },
    };
    const render = () => { index=0; pending=[]; changed=false; result=renderFn(); for(const effect of pending)effect(); return result; };
    return { api, mount(fn){renderFn=fn;render();}, async flush(){ for(let i=0;i<100;i++){await Promise.resolve();if(changed)render();} return result; }, get tree(){return result;}, unmount(){for(const s of state)s?.cleanup?.();} };
}
function nodes(tree) { const out=[]; function walk(n){if(Array.isArray(n))n.forEach(walk);else if(n && typeof n==='object' && n.props){out.push(n);walk(n.props.children);}}walk(tree);return out; }
function text(tree) { if(tree?.type?.name === "BookingReceipt") return renderToStaticMarkup(tree); if(Array.isArray(tree))return tree.map(text).join(''); if(tree?.props)return text(tree.props.children); return typeof tree==='string'||typeof tree==='number'?String(tree):''; }
function button(tree, label) { const el=nodes(tree).find(n=>n.type==='button' && text(n).includes(label));assert.ok(el,`Button ${label} exists`);return el; }
const memory = initial => { const values=new Map(Object.entries(initial));return {getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)}; };
const later = () => {let resolve;const promise=new Promise(r=>resolve=r);return {promise,resolve};};

async function main() {
    const base = loader().load(path.join(root, 'lib/siteConfig.ts'));
    const config = {...base.siteConfig, companyName:'Fixture Hauling', city:'Sugar Land', state:'TX', streetAddress:'123 Fixture Street', phoneNumber:'2815550100',
        emailAddress:'fixture@example.invalid', contactEnabled:true, services:['junk-removal'], offersDumpsterRental:false, companyMode:'junk_removal',
        serviceArea:'', serviceAreaZips:[], yearFounded:null, testimonials:[], googleReviews:[], reviewStats:null};
    const configModule={...base,siteConfig:config};
    const mocks = {'@/lib/siteConfig':configModule,[path.join(root,'lib/siteConfig.ts')]:configModule};
    // Only decorative/provider-facing dependencies are replaced. Reviewed
    // components, pricing, visibility, navigation and catalog functions run.
    for(const name of ['SafeImage','redesign/ServiceAreaMap','redesign/RichFAQ','redesign/Credentials','redesign/Founder','redesign/ReviewAggregate','redesign/Recycling','redesign/StaticFAQ','redesign/CtaBand'])
        mocks[`@/components/${name}`] = {__esModule:true, default:()=>null};
    mocks['@/components/redesign/VisualReplacementBlocks']={VisualPricingScaleSection:()=>null,VisualEstimateFactors:()=>null};
    mocks['@/lib/seo']={createPageMetadata:()=>({}),faqPageJsonLd:()=>({})};
    const modules=loader(mocks), read=p=>modules.load(path.join(root,p));
    const blocks=read('components/redesign/DispatchBlocks.tsx');
    const footer=renderToStaticMarkup(React.createElement(blocks.DispatchSiteFooter,{config}));
    assert.match(footer,/123 Fixture Street<\/span><span><br\/>Sugar Land, TX/);
    const mosaic=renderToStaticMarkup(React.createElement(blocks.DispatchServiceMosaic,{config}));
    assert.match(mosaic,/Residential &amp; commercial/);assert.doesNotMatch(mosaic,/>both</);
    const hero=read('components/redesign/PageHero.tsx').default;
    const common={crumbs:[],titleStart:'Fixture',titleAccent:'',lede:'Details',config};
    assert.equal((renderToStaticMarkup(React.createElement(hero,{...common,primaryCta:{label:'Pricing',href:'/pricing'}})).match(/href="\/pricing"/g)||[]).length,1);
    assert.doesNotMatch(renderToStaticMarkup(React.createElement(hero,{...common,secondaryCta:null})),/href="\/pricing"/);
    for(const contactEnabled of [true,false]) {
        config.contactEnabled=contactEnabled;
        for(const page of ['terms','privacy']) {
            const component=read(`app/(site)/${page}/page.tsx`).default;
            const html=renderToStaticMarkup(React.createElement('main',null,React.createElement(component)));
            assert.equal((html.match(/<main[ >]/g)||[]).length,1);
            assert.equal(html.includes('href="/contact"'),contactEnabled,'legal contact reference respects actual page availability');
            if(page==='terms') assert.match(html,/href="\/items-we-dont-take"/);
        }
    }
    config.contactEnabled=true;
    const about=renderToStaticMarkup(React.createElement(read('app/(site)/about/page.tsx').default));
    assert.match(about,/Booking steps/);assert.doesNotMatch(about,/Verified details/);
    config.yearFounded=2010;
    const aboutKnown=renderToStaticMarkup(React.createElement(read('app/(site)/about/page.tsx').default));
    assert.match(aboutKnown,/Verified details/);assert.match(aboutKnown,/Established 2010/);config.yearFounded=null;
    const faq=read('lib/catalogs/faqs.ts').FAQ_POOL;
    assert.doesNotMatch(faq.filter(f=>f.category==='pricing').map(f=>f.answer).join(' '),/configured|price book/);
    const pricing=read('lib/locationData.ts').locationPricingSummary;
    const tier=(min,max)=>({id:'fixture',label:'Load',fraction:'Full',min,max});
    assert.equal(pricing([],true),'');assert.equal(pricing([tier(100,200)],false),'');
    for(const bad of [NaN,Infinity,0,-1])assert.equal(pricing([tier(bad,200)],true),'');
    assert.match(pricing([tier(100,200),tier(300,0)],true),/starts at \$100/);
    assert.doesNotMatch(pricing([tier(100,200),tier(300,0)],true),/\$0(?:\D|$)/);
    assert.match(pricing([tier(300,600),tier(100,200)],true),/from \$100 to \$600/);
    assert.match(pricing([tier(100,Infinity)],true),/Larger loads require a quote/);
    assert.match(pricing([tier(100,50)],true),/Larger loads require a quote/);
    assert.match(pricing([tier(100.25,200.50)],true),/\$100.25 to \$200.5/);
    for(const [file,vertical,props] of [
        ['VisualPricingScaleClient',false,{tiers:[0,1,2].map(i=>({tag:String(i),name:`Load${i}`,note:'note',range:'$100',fill:i/2})),factors:[],disclaimer:'Fixture'}],
        ['VisualServiceItemsClient',true,{eyebrow:'Items',title:'Accepted',intro:'Fixture',items:[0,1,2].map(i=>({name:`Item${i}`,detail:'Details',reviewedFor:'Reviewed',scopeNote:'Scope'}))}]
    ]) {
        const h=hooks(),mod=loader({...mocks,react:h.api});const component=mod.load(path.join(root,`components/redesign/${file}.tsx`)).default;
        h.mount(()=>component(props));let focused=-1,prevented=0;
        const tabs=()=>nodes(h.tree).filter(n=>n.props.role==='tab');
        const assertSelection=i=>{const t=tabs(),panel=nodes(h.tree).find(n=>n.props.role==='tabpanel');assert.equal(t.filter(n=>n.props.tabIndex===0).length,1);assert.equal(t[i].props['aria-selected'],true);assert.equal(panel.props['aria-labelledby'],t[i].props.id);assert.equal(t[i].props['aria-controls'],panel.props.id);};
        const key=async(k)=>{const t=tabs();t.forEach((n,i)=>n.props.ref({focus:()=>{focused=i;}}));const index=t.findIndex(n=>n.props['aria-selected']);t[index].props.onKeyDown({key:k,preventDefault:()=>prevented++});await h.flush();};
        assertSelection(vertical?0:2);await key('Home');assertSelection(0);assert.equal(focused,0);
        await key(vertical?'ArrowUp':'ArrowLeft');assertSelection(2);assert.equal(focused,2);
        await key(vertical?'ArrowDown':'ArrowRight');assertSelection(0);assert.equal(focused,0);
        await key('End');assertSelection(2);assert.equal(focused,2);
        const before=prevented;await key('Tab');assert.equal(prevented,before);assertSelection(2);
        tabs()[1].props.onClick();await h.flush();assertSelection(1);
        if(vertical)assert.equal(nodes(h.tree).find(n=>n.props.role==='tablist').props['aria-orientation'],'vertical');
        props[vertical?'items':'tiers']=props[vertical?'items':'tiers'].slice(0,1);await key('Home');assertSelection(0);
        h.unmount();
    }
    // Real header DOM with the menu open. Persist an isolated fixture for browser
    // checks of the actual CSS at 320px and the full mobile menu breakpoint.
    config.companyName='FixtureExtremelyLongUnbrokenCompanyNameForMobileContainment';
    config.serviceArea=Array.from({length:35},(_,i)=>`Fixture Area ${i}`).join(', ');
    const h=hooks(),headerModules=loader({...mocks,react:h.api});const header=headerModules.load(path.join(root,'components/redesign/DispatchSiteHeader.tsx')).default;
    h.mount(()=>header({config}));nodes(h.tree).find(n=>n.type==='button'&&n.props['aria-controls']==='dispatch-mobile-nav').props.onClick();await h.flush();
    const html=renderToStaticMarkup(h.tree);assert.match(html,/Manage Booking/);assert.ok((html.match(/Fixture Area/g)||[]).length>=29);
    if(process.env.QA_WEBSITE_FIXTURE_DIR){fs.mkdirSync(process.env.QA_WEBSITE_FIXTURE_DIR,{recursive:true});fs.writeFileSync(path.join(process.env.QA_WEBSITE_FIXTURE_DIR,'website-header.html'),`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>${fs.readFileSync(path.join(root,'app/globals.css'),'utf8')}</style></head><body>${html}<main style="height:1500px">Fixture content</main></body></html>`);}
    console.log('PASS website QA: actual footer/audience/hero/legal/about rendering, available contact links, open-ended location pricing and keyboard focus/selection/panel controls; actual long-brand/30-location menu fixture. Closed dependencies; no network or business actions.');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
