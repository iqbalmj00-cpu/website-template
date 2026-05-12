#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const TITLE_MIN_LENGTH = 30;
const TITLE_MAX_LENGTH = 65;
const DESCRIPTION_MIN_LENGTH = 70;
const DESCRIPTION_MAX_LENGTH = 170;

const REQUIRED_PATHS = [
    "/",
    "/book",
    "/services",
    "/locations",
    "/pricing",
    "/robots.txt",
    "/sitemap.xml",
    "/llms.txt",
    "/manifest.webmanifest",
    "/opengraph-image",
];

const PRIVATE_PATH_PATTERNS = [
    /^\/api(?:\/|$)/,
    /^\/customer-portal(?:\/|$)/,
    /^\/booking-confirmed(?:\/|$)/,
    /^\/thank-you(?:\/|$)/,
    /^\/portal(?:\/|$)/,
    /^\/dashboard(?:\/|$)/,
    /^\/admin(?:\/|$)/,
];

const PLACEHOLDER_PATTERNS = [
    /your company name/i,
    /your city/i,
    /service area:\s*your area/i,
    /serv(?:e|ing)\s+your area/i,
    /\(555\)\s*000-0000/i,
    /555-000-0000/i,
];

const PRIVATE_TEXT_MARKERS = [
    "/api/",
    "/customer-portal",
    "/booking-confirmed",
    "/thank-you",
    "/portal/",
    "/dashboard",
    "/admin",
];

const ALLOWED_SCHEMA_TYPES = new Set([
    "AggregateOffer",
    "Answer",
    "BreadcrumbList",
    "ContactPoint",
    "FAQPage",
    "GeoCoordinates",
    "HowTo",
    "HowToStep",
    "ImageObject",
    "ListItem",
    "LocalBusiness",
    "Offer",
    "OfferCatalog",
    "OpeningHoursSpecification",
    "Organization",
    "PostalAddress",
    "Question",
    "Service",
    "WebPage",
    "WebSite",
]);

const DISALLOWED_SCHEMA_TYPES = new Set([
    "AggregateRating",
    "Rating",
    "Review",
    "SearchAction",
]);

function parseArgs() {
    const args = process.argv.slice(2);
    const options = {
        baseUrl: process.env.SEO_AUDIT_BASE_URL || process.env.BASE_URL || "",
        output: process.env.SEO_AUDIT_OUTPUT || "",
        allowCityService: process.env.SEO_AUDIT_ALLOW_CITY_SERVICE_INDEX === "true",
    };

    for (let i = 0; i < args.length; i += 1) {
        const arg = args[i];
        if (arg === "--base-url") options.baseUrl = args[++i] || "";
        else if (arg.startsWith("--base-url=")) options.baseUrl = arg.slice("--base-url=".length);
        else if (arg === "--output") options.output = args[++i] || "";
        else if (arg.startsWith("--output=")) options.output = arg.slice("--output=".length);
        else if (arg === "--allow-city-service") options.allowCityService = true;
    }

    options.baseUrl = options.baseUrl.replace(/\/+$/, "");
    if (!options.baseUrl) {
        throw new Error("Missing base URL. Use SEO_AUDIT_BASE_URL=https://example.com npm run seo:audit or --base-url=https://example.com.");
    }

    return options;
}

function decodeHtmlEntities(value) {
    return value
        .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
        .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number.parseInt(code, 10)))
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, "\"")
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&nbsp;/g, " ");
}

function normalizePath(pathname) {
    const clean = pathname.replace(/\/+$/, "");
    return clean || "/";
}

function pathFromUrl(value) {
    return normalizePath(new URL(value).pathname);
}

function normalizeUrlWithoutHash(value) {
    const url = new URL(value);
    url.hash = "";
    return url.toString();
}

function hasPrivatePath(pathname) {
    return PRIVATE_PATH_PATTERNS.some(pattern => pattern.test(normalizePath(pathname)));
}

function isCityServicePath(pathname) {
    return /^\/locations\/[^/]+\/[^/]+$/.test(normalizePath(pathname));
}

function hasPlaceholder(value) {
    return PLACEHOLDER_PATTERNS.some(pattern => pattern.test(value));
}

function htmlAttr(html, pattern) {
    const match = html.match(pattern);
    return match?.[1]?.trim() || "";
}

function titleTags(html) {
    return [...html.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)].map(match => cleanText(match[1]));
}

function cleanText(value) {
    return decodeHtmlEntities(String(value || "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

function visibleText(html) {
    return cleanText(String(html || "")
        .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
        .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
        .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, " ")
        .replace(/<svg\b[\s\S]*?<\/svg>/gi, " "));
}

function normalizeForMatch(value) {
    return cleanText(value).toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}

function visibleContains(pageText, needle) {
    const normalizedNeedle = normalizeForMatch(needle);
    if (!normalizedNeedle) return true;
    return normalizeForMatch(pageText).includes(normalizedNeedle);
}

function metaContent(html, name) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return htmlAttr(html, new RegExp(`<meta\\s+[^>]*(?:name|property)=["']${escaped}["'][^>]*content=["']([^"']*)["'][^>]*>`, "i"))
        || htmlAttr(html, new RegExp(`<meta\\s+[^>]*content=["']([^"']*)["'][^>]*(?:name|property)=["']${escaped}["'][^>]*>`, "i"));
}

function canonicalHref(html) {
    return htmlAttr(html, /<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)
        || htmlAttr(html, /<link\s+[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*>/i);
}

function h1Text(html) {
    return [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map(match => cleanText(match[1]));
}

function robotsContent(html) {
    return metaContent(html, "robots").toLowerCase();
}

function jsonLdBlocks(html) {
    return [...html.matchAll(/<script\s+[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
        .map(match => match[1].trim())
        .filter(Boolean);
}

function parseTagAttrs(tag) {
    const attrs = {};
    for (const match of tag.matchAll(/\s([:\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g)) {
        attrs[match[1].toLowerCase()] = decodeHtmlEntities(match[2] ?? match[3] ?? match[4] ?? "");
    }
    return attrs;
}

function anchorLinks(html, pageUrl, baseUrl) {
    const baseOrigin = new URL(baseUrl).origin;
    return [...html.matchAll(/<a\b[^>]*>/gi)]
        .map(match => {
            const attrs = parseTagAttrs(match[0]);
            const href = attrs.href || "";
            if (!href || href.startsWith("#") || /^(?:mailto|tel|sms|javascript|data):/i.test(href)) {
                return null;
            }

            try {
                const url = new URL(href, pageUrl);
                if (url.origin !== baseOrigin) return null;
                url.hash = "";
                return {
                    href,
                    url: url.toString(),
                    path: normalizePath(url.pathname),
                };
            } catch {
                return null;
            }
        })
        .filter(Boolean);
}

function imageTags(html) {
    return [...html.matchAll(/<img\b[^>]*>/gi)].map(match => {
        const attrs = parseTagAttrs(match[0]);
        return {
            src: attrs.src || attrs["data-src"] || "",
            alt: attrs.alt,
            role: attrs.role || "",
            ariaHidden: attrs["aria-hidden"] || "",
        };
    });
}

function sitemapUrls(xml) {
    return [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)]
        .map(match => match[1].trim().replace(/&amp;/g, "&"))
        .filter(Boolean);
}

async function fetchText(url) {
    try {
        const response = await fetch(url, {
            redirect: "manual",
            headers: { "user-agent": "ScaleYourJunk SEO Release Audit/1.0" },
        });
        const text = await response.text().catch(() => "");
        return {
            url,
            status: response.status,
            contentType: response.headers.get("content-type") || "",
            text,
            location: response.headers.get("location") || "",
        };
    } catch (error) {
        return {
            url,
            status: 0,
            contentType: "",
            text: "",
            location: "",
            error: error.message,
        };
    }
}

async function mapLimit(items, limit, worker) {
    const results = new Array(items.length);
    let index = 0;

    async function run() {
        while (index < items.length) {
            const current = index;
            index += 1;
            results[current] = await worker(items[current], current);
        }
    }

    await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
    return results;
}

function addIssue(issues, code, message, details = {}) {
    issues.push({ code, message, ...details });
}

function assertStatus(issues, label, result, expected = 200) {
    if (result.status !== expected) {
        addIssue(issues, "BAD_STATUS", `${label} returned ${result.status}, expected ${expected}.`, {
            url: result.url,
            status: result.status,
            error: result.error,
        });
    }
}

function typeList(value) {
    if (Array.isArray(value)) return value.flatMap(typeList);
    if (typeof value === "string") return [value];
    return [];
}

function collectSchemaTypes(value, types = []) {
    if (Array.isArray(value)) {
        for (const item of value) collectSchemaTypes(item, types);
        return types;
    }

    if (!value || typeof value !== "object") return types;

    types.push(...typeList(value["@type"]));
    for (const item of Object.values(value)) collectSchemaTypes(item, types);
    return types;
}

function collectNodesByType(value, wantedType, nodes = []) {
    if (Array.isArray(value)) {
        for (const item of value) collectNodesByType(item, wantedType, nodes);
        return nodes;
    }

    if (!value || typeof value !== "object") return nodes;

    if (typeList(value["@type"]).includes(wantedType)) {
        nodes.push(value);
    }

    for (const item of Object.values(value)) collectNodesByType(item, wantedType, nodes);
    return nodes;
}

function firstAnswerText(answer) {
    const answers = Array.isArray(answer) ? answer : [answer];
    const first = answers.find(item => item && typeof item === "object");
    return cleanText(first?.text || "");
}

function auditJsonLd(issues, pathname, pageUrl, blockIndex, parsed, pageVisibleText) {
    const schemaTypes = [...new Set(collectSchemaTypes(parsed).filter(Boolean))];
    const disallowedTypes = schemaTypes.filter(type => DISALLOWED_SCHEMA_TYPES.has(type));
    const unsupportedTypes = schemaTypes.filter(type => !ALLOWED_SCHEMA_TYPES.has(type) && !DISALLOWED_SCHEMA_TYPES.has(type));

    if (disallowedTypes.length > 0) {
        addIssue(issues, "DISALLOWED_SCHEMA_TYPE", `${pathname} emits schema types that are not approved for this template.`, {
            url: pageUrl,
            block: blockIndex,
            types: disallowedTypes,
        });
    }

    if (unsupportedTypes.length > 0) {
        addIssue(issues, "UNSUPPORTED_SCHEMA_TYPE", `${pathname} emits schema types that are not in the approved schema allowlist.`, {
            url: pageUrl,
            block: blockIndex,
            types: unsupportedTypes,
        });
    }

    for (const faqPage of collectNodesByType(parsed, "FAQPage")) {
        const questions = Array.isArray(faqPage.mainEntity) ? faqPage.mainEntity : [faqPage.mainEntity].filter(Boolean);
        for (const question of questions) {
            if (!question || typeof question !== "object") continue;

            const questionText = cleanText(question.name || "");
            const answerText = firstAnswerText(question.acceptedAnswer);
            const answerNeedle = normalizeForMatch(answerText).split(" ").slice(0, 18).join(" ");

            if (questionText && !visibleContains(pageVisibleText, questionText)) {
                addIssue(issues, "FAQ_SCHEMA_NOT_VISIBLE", `${pathname} has FAQ schema with a question that is not visible on the page.`, {
                    url: pageUrl,
                    question: questionText,
                });
            }

            if (answerNeedle && !normalizeForMatch(pageVisibleText).includes(answerNeedle)) {
                addIssue(issues, "FAQ_SCHEMA_NOT_VISIBLE", `${pathname} has FAQ schema with an answer that is not visible on the page.`, {
                    url: pageUrl,
                    question: questionText,
                });
            }
        }
    }

    return schemaTypes;
}

function auditCanonical(issues, pathname, pageUrl, canonical, baseUrl) {
    if (!canonical) return;

    try {
        const canonicalUrl = new URL(canonical, baseUrl);
        const expectedOrigin = new URL(baseUrl).origin;
        if (canonicalUrl.origin !== expectedOrigin) {
            addIssue(issues, "CANONICAL_HOST_MISMATCH", `${pathname} canonical points to a different host.`, {
                url: pageUrl,
                canonical,
            });
        }
        if (normalizePath(canonicalUrl.pathname) !== pathname) {
            addIssue(issues, "CANONICAL_PATH_MISMATCH", `${pathname} canonical does not match the sitemap URL path.`, {
                url: pageUrl,
                canonical,
            });
        }
    } catch (error) {
        addIssue(issues, "BAD_CANONICAL", `${pathname} canonical URL is invalid.`, {
            url: pageUrl,
            canonical,
            error: error.message,
        });
    }
}

function isAllowedPrivateLink(pagePath, linkPath) {
    return pagePath === "/commercial" && linkPath === "/customer-portal";
}

function auditHtmlPage(issues, page, options) {
    const pathname = pathFromUrl(page.url);
    assertStatus(issues, pathname, page, 200);

    if (page.status !== 200) return null;

    const titles = titleTags(page.text);
    const description = metaContent(page.text, "description");
    const canonical = canonicalHref(page.text);
    const robots = robotsContent(page.text);
    const h1s = h1Text(page.text);
    const jsonLd = jsonLdBlocks(page.text);
    const noindex = robots.includes("noindex");
    const pageVisibleText = visibleText(page.text);
    const links = anchorLinks(page.text, page.url, options.baseUrl);
    const images = imageTags(page.text);
    const schemaTypes = [];

    if (titles.length !== 1) {
        addIssue(issues, "TITLE_COUNT", `${pathname} has ${titles.length} title tags.`, { url: page.url });
    }
    if (!titles[0]) {
        addIssue(issues, "MISSING_TITLE", `${pathname} is missing a title.`, { url: page.url });
    } else if (titles[0].length < TITLE_MIN_LENGTH || titles[0].length > TITLE_MAX_LENGTH) {
        addIssue(issues, "TITLE_LENGTH", `${pathname} title length is outside the release range.`, {
            url: page.url,
            length: titles[0].length,
            min: TITLE_MIN_LENGTH,
            max: TITLE_MAX_LENGTH,
            title: titles[0],
        });
    }
    if (!description) {
        addIssue(issues, "MISSING_DESCRIPTION", `${pathname} is missing a meta description.`, { url: page.url });
    } else if (description.length < DESCRIPTION_MIN_LENGTH || description.length > DESCRIPTION_MAX_LENGTH) {
        addIssue(issues, "DESCRIPTION_LENGTH", `${pathname} meta description length is outside the release range.`, {
            url: page.url,
            length: description.length,
            min: DESCRIPTION_MIN_LENGTH,
            max: DESCRIPTION_MAX_LENGTH,
            description,
        });
    }
    if (!canonical) {
        addIssue(issues, "MISSING_CANONICAL", `${pathname} is missing a canonical link.`, { url: page.url });
    } else {
        auditCanonical(issues, pathname, page.url, canonical, options.baseUrl);
    }
    if (h1s.length !== 1) {
        addIssue(issues, "H1_COUNT", `${pathname} has ${h1s.length} H1 elements.`, {
            url: page.url,
            h1s,
        });
    }
    if (noindex) {
        addIssue(issues, "NOINDEX_IN_SITEMAP", `${pathname} is in the sitemap but has noindex robots.`, { url: page.url });
    }
    if (hasPlaceholder(page.text)) {
        addIssue(issues, "PLACEHOLDER_TEXT", `${pathname} contains placeholder identity text.`, { url: page.url });
    }

    for (const [index, block] of jsonLd.entries()) {
        try {
            const parsed = JSON.parse(block);
            schemaTypes.push(...auditJsonLd(issues, pathname, page.url, index + 1, parsed, pageVisibleText));
        } catch (error) {
            addIssue(issues, "BAD_JSON_LD", `${pathname} has invalid JSON-LD block ${index + 1}.`, {
                url: page.url,
                error: error.message,
            });
        }
    }

    const privateLinks = links.filter(link => hasPrivatePath(link.path) && !isAllowedPrivateLink(pathname, link.path));
    if (privateLinks.length > 0) {
        addIssue(issues, "PRIVATE_LINK_IN_HTML", `${pathname} links to private or noindex URLs from an indexable page.`, {
            url: page.url,
            links: privateLinks.slice(0, 20),
            count: privateLinks.length,
        });
    }

    const imagesWithAltIssues = images.filter(image => {
        if (image.ariaHidden === "true" || image.role === "presentation") return false;
        return image.alt === undefined || image.alt.trim() === "";
    });
    if (imagesWithAltIssues.length > 0) {
        addIssue(issues, "IMAGE_ALT_TEXT", `${pathname} has images without useful alt text.`, {
            url: page.url,
            images: imagesWithAltIssues.slice(0, 20),
            count: imagesWithAltIssues.length,
        });
    }

    return {
        path: pathname,
        url: page.url,
        title: titles[0] || "",
        description,
        canonical,
        h1: h1s[0] || "",
        h1Count: h1s.length,
        robots,
        jsonLdCount: jsonLd.length,
        schemaTypes: [...new Set(schemaTypes)].sort(),
        internalLinks: links,
        imageCount: images.length,
        imageAltIssueCount: imagesWithAltIssues.length,
    };
}

function duplicateValues(rows, field) {
    const values = new Map();
    for (const row of rows) {
        const value = (row?.[field] || "").toLowerCase().trim();
        if (!value) continue;
        values.set(value, [...(values.get(value) || []), row.path]);
    }
    return [...values.entries()]
        .filter(([, paths]) => paths.length > 1)
        .map(([value, paths]) => ({ value, paths }));
}

async function main() {
    const options = parseArgs();
    const issues = [];
    const requiredResults = {};

    for (const path of REQUIRED_PATHS) {
        const result = await fetchText(`${options.baseUrl}${path}`);
        requiredResults[path] = { status: result.status, contentType: result.contentType, location: result.location, error: result.error };
        assertStatus(issues, path, result, 200);
        if (result.status === 200 && (path === "/llms.txt" || path === "/robots.txt") && hasPlaceholder(result.text)) {
            addIssue(issues, "PLACEHOLDER_TEXT", `${path} contains placeholder identity text.`, { url: result.url });
        }
        if (result.status === 200 && path === "/llms.txt" && PRIVATE_TEXT_MARKERS.some(marker => result.text.includes(marker))) {
            addIssue(issues, "PRIVATE_URL_IN_LLMS", "/llms.txt appears to contain a private path.", { url: result.url });
        }
    }

    const sitemapResult = await fetchText(`${options.baseUrl}/sitemap.xml`);
    const urls = sitemapUrls(sitemapResult.text);
    const uniqueUrls = [...new Set(urls)];

    if (urls.length === 0) {
        addIssue(issues, "EMPTY_SITEMAP", "Sitemap has no URLs.", { url: sitemapResult.url });
    }
    if (uniqueUrls.length !== urls.length) {
        addIssue(issues, "DUPLICATE_SITEMAP_URL", "Sitemap contains duplicate URLs.", {
            duplicateCount: urls.length - uniqueUrls.length,
        });
    }

    const privateSitemapUrls = uniqueUrls.filter(url => hasPrivatePath(pathFromUrl(url)));
    if (privateSitemapUrls.length > 0) {
        addIssue(issues, "PRIVATE_URL_IN_SITEMAP", "Sitemap contains private URLs.", {
            urls: privateSitemapUrls.slice(0, 20),
            count: privateSitemapUrls.length,
        });
    }

    const cityServiceUrls = uniqueUrls.filter(url => isCityServicePath(pathFromUrl(url)));
    if (cityServiceUrls.length > 0 && !options.allowCityService) {
        addIssue(issues, "CITY_SERVICE_IN_SITEMAP", "Sitemap contains city-service URLs before they are approved for indexing.", {
            urls: cityServiceUrls.slice(0, 20),
            count: cityServiceUrls.length,
        });
    }

    const pageResults = await mapLimit(uniqueUrls, 6, fetchText);
    const pages = [];
    for (const page of pageResults) {
        const audited = auditHtmlPage(issues, page, options);
        if (audited) pages.push(audited);
    }

    const sitemapStatusByUrl = new Map(pageResults.map(result => [normalizeUrlWithoutHash(result.url), result]));
    const internalLinkMap = new Map();
    for (const page of pages) {
        for (const link of page.internalLinks) {
            internalLinkMap.set(normalizeUrlWithoutHash(link.url), {
                source: page.path,
                href: link.href,
                url: normalizeUrlWithoutHash(link.url),
            });
        }
    }

    const internalLinks = [...internalLinkMap.values()];
    const uncrawledInternalLinks = internalLinks.filter(link => !sitemapStatusByUrl.has(link.url));
    const internalLinkResults = await mapLimit(uncrawledInternalLinks, 8, link => fetchText(link.url));
    const internalStatusByUrl = new Map(sitemapStatusByUrl);
    for (const result of internalLinkResults) {
        internalStatusByUrl.set(normalizeUrlWithoutHash(result.url), result);
    }

    const brokenInternalLinks = [];
    for (const link of internalLinks) {
        const result = internalStatusByUrl.get(link.url);
        if (!result || result.status === 0 || result.status >= 400) {
            brokenInternalLinks.push({
                ...link,
                status: result?.status || 0,
                error: result?.error,
            });
        }
    }
    if (brokenInternalLinks.length > 0) {
        addIssue(issues, "BROKEN_INTERNAL_LINK", "One or more indexable pages link to broken internal URLs.", {
            links: brokenInternalLinks.slice(0, 50),
            count: brokenInternalLinks.length,
        });
    }

    for (const duplicate of duplicateValues(pages, "title")) {
        addIssue(issues, "DUPLICATE_TITLE", "Multiple sitemap URLs share the same title.", duplicate);
    }

    for (const duplicate of duplicateValues(pages, "canonical")) {
        addIssue(issues, "DUPLICATE_CANONICAL", "Multiple sitemap URLs share the same canonical URL.", duplicate);
    }

    const report = {
        auditedAt: new Date().toISOString(),
        baseUrl: options.baseUrl,
        passed: issues.length === 0,
        summary: {
            sitemapUrlCount: urls.length,
            uniqueSitemapUrlCount: uniqueUrls.length,
            privateSitemapUrlCount: privateSitemapUrls.length,
            cityServiceSitemapUrlCount: cityServiceUrls.length,
            crawledPageCount: pages.length,
            internalLinkCount: internalLinks.length,
            brokenInternalLinkCount: brokenInternalLinks.length,
            issueCount: issues.length,
        },
        requiredResults,
        issues,
        pages,
    };

    const printable = JSON.stringify(report, null, 2);
    console.log(printable);

    if (options.output) {
        await mkdir(dirname(options.output), { recursive: true });
        await writeFile(options.output, `${printable}\n`);
    }

    if (issues.length > 0) {
        process.exitCode = 1;
    }
}

main().catch(error => {
    console.error(`SEO release audit failed: ${error.message}`);
    process.exitCode = 1;
});
