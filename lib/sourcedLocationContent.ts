import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { LocationSourcedContent } from "./locationData";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cleanText(value: unknown): string {
    return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function toSlug(value: string): string {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

function isUrl(value: unknown): boolean {
    const text = cleanText(value);
    return /^https?:\/\/[^\s]+$/i.test(text);
}

function recordHasSource(record: UnknownRecord): boolean {
    const direct = [record.sourceUrl, record.url, record.source, record.citationUrl].some(isUrl);
    if (direct) return true;
    const sources = record.sources ?? record.sourceUrls ?? record.citations;
    return Array.isArray(sources) && sources.some((item) => {
        if (isUrl(item)) return true;
        return isRecord(item) && [item.url, item.sourceUrl, item.href].some(isUrl);
    });
}

function cleanSourceBackedStrings(value: unknown, parentHasSource: boolean): string[] {
    if (!Array.isArray(value)) return [];
    const result: string[] = [];

    for (const item of value) {
        if (typeof item === "string") {
            const text = cleanText(item);
            if (text && parentHasSource) result.push(text);
            continue;
        }

        if (!isRecord(item)) continue;
        if (!recordHasSource(item) && !parentHasSource) continue;

        const text = cleanText(item.text) || cleanText(item.name) || cleanText(item.value) || cleanText(item.fact);
        if (text) result.push(text);
    }

    return Array.from(new Set(result));
}

function cleanFaqs(value: unknown, parentHasSource: boolean): { q: string; a: string }[] {
    if (!Array.isArray(value)) return [];
    const result: { q: string; a: string }[] = [];

    for (const item of value) {
        if (!isRecord(item)) continue;
        if (!recordHasSource(item) && !parentHasSource) continue;

        const q = cleanText(item.q) || cleanText(item.question);
        const a = cleanText(item.a) || cleanText(item.answer);
        if (q && a) result.push({ q, a });
    }

    return result;
}

function normalizeEntry(entry: unknown): LocationSourcedContent | null {
    if (!isRecord(entry)) return null;

    const parentHasSource = recordHasSource(entry);
    const intro = parentHasSource ? cleanText(entry.intro) || cleanText(entry.localIntro) : "";
    const localFacts = cleanSourceBackedStrings(entry.localFacts ?? entry.facts, parentHasSource);
    const neighborhoods = cleanSourceBackedStrings(entry.neighborhoods, parentHasSource);
    const districts = cleanSourceBackedStrings(entry.districts, parentHasSource);
    const landmarks = cleanSourceBackedStrings(entry.landmarks, parentHasSource);
    const faqs = cleanFaqs(entry.faqs, parentHasSource);

    if (!intro && localFacts.length === 0 && neighborhoods.length === 0 && districts.length === 0 && landmarks.length === 0 && faqs.length === 0) {
        return null;
    }

    return {
        intro: intro || undefined,
        localFacts,
        neighborhoods,
        districts,
        landmarks,
        faqs,
    };
}

function readGeneratedContent(): unknown {
    const generatedPath = path.join(process.cwd(), ".generated", "sourced-location-content.json");
    try {
        if (!fs.existsSync(generatedPath)) return null;
        return JSON.parse(fs.readFileSync(generatedPath, "utf8"));
    } catch {
        return null;
    }
}

function readPayload(): unknown {
    const envPayload = process.env.LOCATION_CONTENT_JSON;
    if (envPayload && envPayload.trim()) {
        try {
            return JSON.parse(envPayload);
        } catch {
            return null;
        }
    }

    return readGeneratedContent();
}

function buildContentMap(): Map<string, LocationSourcedContent> {
    const payload = readPayload();
    const map = new Map<string, LocationSourcedContent>();

    if (Array.isArray(payload)) {
        for (const item of payload) {
            if (!isRecord(item)) continue;
            const slug = cleanText(item.slug) || toSlug(cleanText(item.name) || cleanText(item.city));
            const normalized = normalizeEntry(item);
            if (slug && normalized) map.set(slug, normalized);
        }
        return map;
    }

    if (isRecord(payload)) {
        const locations = payload.locations;
        if (Array.isArray(locations)) {
            for (const item of locations) {
                if (!isRecord(item)) continue;
                const slug = cleanText(item.slug) || toSlug(cleanText(item.name) || cleanText(item.city));
                const normalized = normalizeEntry(item);
                if (slug && normalized) map.set(slug, normalized);
            }
        }

        for (const [key, value] of Object.entries(payload)) {
            if (key === "locations") continue;
            const normalized = normalizeEntry(value);
            if (normalized) map.set(toSlug(key), normalized);
        }
    }

    return map;
}

export function getSourcedLocationContent(slug: string): LocationSourcedContent | null {
    return buildContentMap().get(toSlug(slug)) ?? null;
}
