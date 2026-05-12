#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_MODEL = process.env.OPENAI_LOCATION_CONTENT_MODEL || "gpt-5.4-mini";
const DEFAULT_OUTPUT = ".generated/sourced-location-content.json";
const DEFAULT_WEB_SEARCH_TOOL = process.env.OPENAI_WEB_SEARCH_TOOL || "web_search";

function usage() {
    return `
Generate source-backed city content for website-template location pages.

Usage:
  npm run location:content -- --city "Houston, TX" --city "Katy, TX"
  npm run location:content -- --cities "Houston, TX; Katy, TX; Sugar Land, TX"
  npm run location:content -- --dry-run --cities "Houston, TX; Katy, TX"
  npm run location:content -- --validate-only .generated/sourced-location-content.json

Options:
  --city <city[, state]>       Add one city. Can be repeated.
  --cities <list>              Semicolon-delimited city list.
  --state <state>              Default state for city names without a state.
  --output <path>              Output JSON path. Default: ${DEFAULT_OUTPUT}
  --model <model>              OpenAI model. Default: ${DEFAULT_MODEL}
  --dry-run                    Print the planned run without calling OpenAI.
  --validate-only [path]       Validate an existing generated JSON file.
  --max-cities <number>        Stop after N cities.
`.trim();
}

function parseArgs(argv) {
    const options = {
        cities: [],
        defaultState: process.env.NEXT_PUBLIC_STATE || "",
        output: DEFAULT_OUTPUT,
        model: DEFAULT_MODEL,
        webSearchTool: DEFAULT_WEB_SEARCH_TOOL,
        dryRun: false,
        validateOnly: false,
        validatePath: "",
        maxCities: null,
    };

    for (let i = 0; i < argv.length; i += 1) {
        const arg = argv[i];
        if (arg === "--help" || arg === "-h") {
            console.log(usage());
            process.exit(0);
        } else if (arg === "--city") {
            options.cities.push(argv[++i] || "");
        } else if (arg.startsWith("--city=")) {
            options.cities.push(arg.slice("--city=".length));
        } else if (arg === "--cities") {
            options.cities.push(...String(argv[++i] || "").split(";"));
        } else if (arg.startsWith("--cities=")) {
            options.cities.push(...arg.slice("--cities=".length).split(";"));
        } else if (arg === "--state") {
            options.defaultState = argv[++i] || "";
        } else if (arg.startsWith("--state=")) {
            options.defaultState = arg.slice("--state=".length);
        } else if (arg === "--output") {
            options.output = argv[++i] || DEFAULT_OUTPUT;
        } else if (arg.startsWith("--output=")) {
            options.output = arg.slice("--output=".length);
        } else if (arg === "--model") {
            options.model = argv[++i] || DEFAULT_MODEL;
        } else if (arg.startsWith("--model=")) {
            options.model = arg.slice("--model=".length);
        } else if (arg === "--dry-run") {
            options.dryRun = true;
        } else if (arg === "--validate-only") {
            options.validateOnly = true;
            if (argv[i + 1] && !argv[i + 1].startsWith("--")) {
                options.validatePath = argv[++i];
            }
        } else if (arg.startsWith("--validate-only=")) {
            options.validateOnly = true;
            options.validatePath = arg.slice("--validate-only=".length);
        } else if (arg === "--max-cities") {
            options.maxCities = Number.parseInt(argv[++i] || "", 10);
        } else if (arg.startsWith("--max-cities=")) {
            options.maxCities = Number.parseInt(arg.slice("--max-cities=".length), 10);
        } else {
            throw new Error(`Unknown option: ${arg}`);
        }
    }

    if (options.cities.length === 0 && process.env.NEXT_PUBLIC_CITY) {
        options.cities.push(process.env.NEXT_PUBLIC_CITY);
        if (process.env.NEXT_PUBLIC_SERVICE_AREA?.includes(",") || process.env.NEXT_PUBLIC_SERVICE_AREA?.includes(";")) {
            options.cities.push(...process.env.NEXT_PUBLIC_SERVICE_AREA.split(/[,;]+/));
        }
    }

    const cityMap = new Map();
    for (const cityInput of options.cities) {
        const parsed = parseCity(cityInput, options.defaultState);
        if (!parsed.city) continue;
        cityMap.set(`${parsed.city.toLowerCase()}|${parsed.state.toLowerCase()}`, parsed);
    }

    options.cities = [...cityMap.values()];
    if (Number.isInteger(options.maxCities) && options.maxCities > 0) {
        options.cities = options.cities.slice(0, options.maxCities);
    }

    return options;
}

function parseCity(input, defaultState) {
    const clean = String(input || "").replace(/\s+/g, " ").trim();
    if (!clean) return { city: "", state: "" };

    const parts = clean.split(",").map((part) => part.trim()).filter(Boolean);
    if (parts.length >= 2) {
        return { city: parts[0], state: parts[1] };
    }

    return { city: clean, state: String(defaultState || "").trim() };
}

function toSlug(name) {
    return String(name || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

function cleanUrl(value) {
    if (typeof value !== "string") return "";
    try {
        const url = new URL(value.trim());
        return ["http:", "https:"].includes(url.protocol) ? url.toString() : "";
    } catch {
        return "";
    }
}

function cleanSourceUrls(value) {
    if (!Array.isArray(value)) return [];
    return [...new Set(value.map(cleanUrl).filter(Boolean))];
}

function validateSourceBackedItems(items, fieldName, label, errors, locationLabel) {
    if (items == null) return;
    if (!Array.isArray(items)) {
        errors.push(`${locationLabel}: ${label} must be an array.`);
        return;
    }

    for (const [index, item] of items.entries()) {
        if (!item || typeof item !== "object") {
            errors.push(`${locationLabel}: ${label}[${index}] must be an object.`);
            continue;
        }
        if (typeof item[fieldName] !== "string" || !item[fieldName].trim()) {
            errors.push(`${locationLabel}: ${label}[${index}].${fieldName} is required.`);
        }
        if (cleanSourceUrls(item.sourceUrls).length === 0) {
            errors.push(`${locationLabel}: ${label}[${index}] needs at least one source URL.`);
        }
    }
}

function validateLocationContent(payload) {
    const errors = [];
    const locations = Array.isArray(payload)
        ? payload
        : payload && typeof payload === "object" && Array.isArray(payload.locations)
            ? payload.locations
            : null;

    if (!locations) {
        return { ok: false, errors: ["Root JSON must be an array or an object with a locations array."] };
    }

    for (const [locationIndex, location] of locations.entries()) {
        const label = `locations[${locationIndex}]`;
        if (!location || typeof location !== "object") {
            errors.push(`${label}: entry must be an object.`);
            continue;
        }
        if (typeof location.city !== "string" || !location.city.trim()) {
            errors.push(`${label}: city is required.`);
        }
        if (location.intro && cleanSourceUrls(location.introSourceUrls).length === 0) {
            errors.push(`${label}: intro needs introSourceUrls.`);
        }

        validateSourceBackedItems(location.localFacts, "text", "localFacts", errors, label);
        validateSourceBackedItems(location.neighborhoods, "name", "neighborhoods", errors, label);
        validateSourceBackedItems(location.districts, "name", "districts", errors, label);
        validateSourceBackedItems(location.landmarks, "name", "landmarks", errors, label);

        if (location.faqs != null) {
            if (!Array.isArray(location.faqs)) {
                errors.push(`${label}: faqs must be an array.`);
            } else {
                for (const [faqIndex, faq] of location.faqs.entries()) {
                    if (!faq || typeof faq !== "object") {
                        errors.push(`${label}: faqs[${faqIndex}] must be an object.`);
                        continue;
                    }
                    if (typeof faq.q !== "string" || !faq.q.trim()) errors.push(`${label}: faqs[${faqIndex}].q is required.`);
                    if (typeof faq.a !== "string" || !faq.a.trim()) errors.push(`${label}: faqs[${faqIndex}].a is required.`);
                    if (cleanSourceUrls(faq.sourceUrls).length === 0) errors.push(`${label}: faqs[${faqIndex}] needs at least one source URL.`);
                }
            }
        }
    }

    return { ok: errors.length === 0, errors };
}

function buildPrompt(city, state) {
    const locationLabel = state ? `${city}, ${state}` : city;
    return `
Research public, source-backed local context for a junk removal location page for ${locationLabel}.

Return only valid JSON with this exact shape:
{
  "city": "${city}",
  "state": "${state}",
  "slug": "${toSlug(city)}",
  "intro": "One concise local intro sentence using only cited public facts.",
  "introSourceUrls": ["https://..."],
  "localFacts": [
    { "text": "One concise public-source fact about the city, access context, geography, or local area.", "sourceUrls": ["https://..."] }
  ],
  "neighborhoods": [
    { "name": "Neighborhood or subdivision", "sourceUrls": ["https://..."] }
  ],
  "districts": [
    { "name": "District or named area", "sourceUrls": ["https://..."] }
  ],
  "landmarks": [
    { "name": "Public landmark or recognizable place", "sourceUrls": ["https://..."] }
  ],
  "faqs": [
    { "q": "City-specific customer question", "a": "Concise answer supported by the cited public source.", "sourceUrls": ["https://..."] }
  ],
  "sources": [
    { "url": "https://...", "title": "Source title", "publisher": "Publisher", "accessedAt": "${new Date().toISOString().slice(0, 10)}" }
  ]
}

Rules:
- Use web search.
- Do not invent neighborhoods, subdivisions, districts, landmarks, population facts, local rules, reviews, case studies, recognition, credentials, service frequency, or operational claims.
- Every intro, fact, place, landmark, and FAQ must include at least one source URL.
- Prefer official city, county, tourism, chamber, planning, neighborhood, or public map sources.
- Avoid competitor junk removal websites as sources.
- Keep answers useful for a local junk removal customer, but do not claim the business has completed jobs, has recurring route coverage, handles property-access rules, or has special local experience.
- If a category cannot be sourced, return an empty array for that category.
`.trim();
}

function responseOutputText(responseJson) {
    if (typeof responseJson.output_text === "string") return responseJson.output_text;

    const chunks = [];
    for (const item of responseJson.output || []) {
        for (const content of item.content || []) {
            if (typeof content.text === "string") chunks.push(content.text);
        }
    }
    return chunks.join("\n").trim();
}

function collectUrlCitations(node, output = []) {
    if (!node || typeof node !== "object") return output;
    if (Array.isArray(node)) {
        for (const item of node) collectUrlCitations(item, output);
        return output;
    }

    if (node.type === "url_citation" && cleanUrl(node.url)) {
        output.push({
            url: cleanUrl(node.url),
            ...(typeof node.title === "string" && node.title.trim() ? { title: node.title.trim() } : {}),
        });
    }

    for (const value of Object.values(node)) {
        if (value && typeof value === "object") collectUrlCitations(value, output);
    }

    return output;
}

function parseJsonFromText(text) {
    const clean = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
    try {
        return JSON.parse(clean);
    } catch {
        const match = clean.match(/\{[\s\S]*\}/);
        if (!match) throw new Error("Model response did not contain JSON.");
        return JSON.parse(match[0]);
    }
}

function mergeSources(location, citations) {
    const existing = Array.isArray(location.sources) ? location.sources : [];
    const byUrl = new Map();

    for (const source of [...existing, ...citations]) {
        const url = cleanUrl(source?.url);
        if (!url || byUrl.has(url)) continue;
        byUrl.set(url, {
            url,
            ...(typeof source.title === "string" && source.title.trim() ? { title: source.title.trim() } : {}),
            ...(typeof source.publisher === "string" && source.publisher.trim() ? { publisher: source.publisher.trim() } : {}),
            ...(typeof source.accessedAt === "string" && source.accessedAt.trim() ? { accessedAt: source.accessedAt.trim() } : {}),
        });
    }

    return { ...location, sources: [...byUrl.values()] };
}

async function generateCityContent(city, state, options) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY is required unless you use --dry-run or --validate-only.");

    const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: options.model,
            tools: [{ type: options.webSearchTool }],
            input: buildPrompt(city, state),
            max_output_tokens: 3200,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI request failed for ${city}: ${response.status} ${errorText}`);
    }

    const responseJson = await response.json();
    const parsed = parseJsonFromText(responseOutputText(responseJson));
    const location = parsed.location && typeof parsed.location === "object" ? parsed.location : parsed;
    return mergeSources(location, collectUrlCitations(responseJson));
}

async function main() {
    const options = parseArgs(process.argv.slice(2));

    if (options.validateOnly) {
        const target = options.validatePath || options.output;
        const payload = JSON.parse(await readFile(target, "utf8"));
        const validation = validateLocationContent(payload);
        if (!validation.ok) {
            console.error(`Location content validation failed for ${target}:`);
            for (const error of validation.errors) console.error(`- ${error}`);
            process.exit(1);
        }
        console.log(`Location content validation passed for ${target}.`);
        return;
    }

    if (options.cities.length === 0) {
        throw new Error("No cities provided. Use --city, --cities, or set NEXT_PUBLIC_CITY.");
    }

    console.log(`Location content generator`);
    console.log(`Model: ${options.model}`);
    console.log(`Output: ${options.output}`);
    console.log(`Cities: ${options.cities.map(({ city, state }) => state ? `${city}, ${state}` : city).join("; ")}`);

    if (options.dryRun) {
        console.log("Dry run complete. No OpenAI request was made and no file was written.");
        return;
    }

    const locations = [];
    for (const { city, state } of options.cities) {
        console.log(`Generating sourced content for ${state ? `${city}, ${state}` : city}...`);
        locations.push(await generateCityContent(city, state, options));
    }

    const payload = {
        version: 1,
        generatedAt: new Date().toISOString(),
        model: options.model,
        locations,
    };

    const validation = validateLocationContent(payload);
    if (!validation.ok) {
        console.error("Generated location content failed validation:");
        for (const error of validation.errors) console.error(`- ${error}`);
        process.exit(1);
    }

    const outputPath = path.resolve(options.output);
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`);
    console.log(`Wrote ${locations.length} sourced location entries to ${outputPath}.`);
    console.log("For production, set LOCATION_CONTENT_JSON to the generated JSON string or run this script before building the template.");
}

main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
});
