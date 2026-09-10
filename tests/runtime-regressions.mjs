/** Builds and exercises Next production routes with local backend fixtures only. */
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";
import { fixtureBlog, fixtureEnvironment } from "./runtime-fixture.mjs";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const requests = [];
let previewFetches = 0;
let liveDecisionFetches = 0;
const backend = createServer((req, res) => {
    requests.push({ method: req.method, path: req.url });
    res.setHeader("Content-Type", "application/json");
    const url = new URL(req.url, "http://127.0.0.1");
    if (req.method !== "GET") { res.writeHead(405); res.end('{}'); return; }
    if (url.pathname === "/api/agents/blogs/public") res.end(JSON.stringify({ blogs: [fixtureBlog] }));
    else if (url.pathname === "/api/public/reviews") res.end(JSON.stringify({ reviews: [], stats: null }));
    else if (["/api/public/available-slots", "/api/booking/container-availability", "/api/promo/validate"].includes(url.pathname)) res.end(JSON.stringify({ revision: ++liveDecisionFetches }));
    else if (url.pathname.startsWith("/api/website-preview/session/")) {
        previewFetches++;
        res.end(JSON.stringify({ config: { companyName: `Preview Tenant ${previewFetches}`, city: "Houston", phoneNumber: "7135550199" }, expiresAt: new Date(Date.now() + 60000).toISOString() }));
    } else { res.writeHead(404); res.end('{}'); }
});
await new Promise(resolve => backend.listen(0, "127.0.0.1", resolve));
const env = fixtureEnvironment(root, `http://127.0.0.1:${backend.address().port}`);
const next = join(root, "node_modules/next/dist/bin/next");
const run = args => new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [next, ...args], { cwd: root, env, stdio: "inherit" });
    child.on("error", reject); child.on("exit", code => code === 0 ? resolve() : reject(new Error(`Next ${args[0]} failed: ${code}`)));
});
let app;
try {
    if (!process.argv.includes("--skip-build")) await run(["build"]);
    const prerender = JSON.parse(readFileSync(join(root, ".next/prerender-manifest.json")));
    assert.ok(prerender.routes["/"], "Homepage must stay statically generated");
    assert.ok(prerender.routes["/blog/fixture-blog"], "Fixture blog must be generated");
    assert.equal(prerender.routes["/blog/fixture-blog"].initialRevalidateSeconds, 3600);
    assert.ok(!prerender.routes["/preview"] && !prerender.routes["/__preview"], "Preview must stay dynamic");
    const port = Number(process.env.FIXTURE_WEBSITE_PORT || 4317);
    app = spawn(process.execPath, [next, "start", "-H", "127.0.0.1", "-p", String(port)], { cwd: root, env, stdio: "inherit" });
    const base = `http://127.0.0.1:${port}`;
    let ready = false;
    for (let i = 0; i < 150; i++) { if (app.exitCode !== null) throw new Error("Next start exited"); try { await fetch(base); ready = true; break; } catch { await delay(200); } }
    assert.ok(ready, "Production server must become ready");
    for (const path of ["/", "/book", "/services", "/pricing", "/locations", "/cost", "/blog/fixture-blog", "/booking-confirmed", "/locations/houston", "/locations/houston/furniture-removal", ...Object.keys(prerender.routes).filter(p => /^(\/services\/|\/cost\/|\/locations\/)/.test(p)).slice(0, 8)]) {
        const res = await fetch(base + path); const html = await res.text(); assert.equal(res.status, 200, path); assert.match(html, /<title>/); assert.doesNotMatch(html, /Website Setup Required/);
    }
    const unknown = await fetch(base + "/services/not-a-configured-service"); assert.equal(unknown.status, 404);
    for (const path of ["/preview", "/__preview"]) {
        const res = await fetch(base + path); assert.equal(res.status, 200); assert.match(res.headers.get("cache-control"), /no-store/); assert.match(res.headers.get("x-robots-tag"), /noindex/); assert.match(await res.text(), /Preview unavailable/);
    }
    for (const n of [1, 2]) {
        const res = await fetch(base + "/__preview?token=local-preview-fixture-token"); const html = await res.text(); assert.equal(res.status, 200); assert.match(html, new RegExp(`Preview Tenant ${n}`)); assert.match(res.headers.get("cache-control"), /no-store/);
    }
    assert.equal(previewFetches, 2, "Preview config must never be reused from the data cache");
    for (const path of ["/api/available-slots?date=2026-10-01", "/api/container-availability?size=20", "/api/validate-promo?code=FIXTURE"]) {
        const first = await fetch(base + path); const second = await fetch(base + path);
        assert.equal(first.status, 200); assert.equal(second.status, 200);
        assert.notEqual((await first.json()).revision, (await second.json()).revision, "Live booking decisions cannot use cached backend responses");
    }
    assert.equal(liveDecisionFetches, 6);
    const forged = await fetch(base, { headers: { "x-template-preview-route": "1" } }); assert.doesNotMatch(await forged.text(), /Preview Tenant/);
    const redirect = await fetch(base + "/get-started", { redirect: "manual" }); assert.equal(redirect.status, 308); assert.equal(redirect.headers.get("location"), "/book");
    assert.ok(requests.every(r => r.method === "GET"), "No booking/payment/provider writes");
    console.log(`PASS Next 16 production runtime: static routes, metadata, dynamic preview isolation, uncached sessions, ISR and redirects; ${requests.length} local fixture GETs.`);
    if (process.argv.includes("--serve")) { console.log(`FIXTURE_READY ${base}`); await new Promise(resolve => process.once("SIGTERM", resolve)); }
} finally { if (app) { app.kill("SIGTERM"); await new Promise(resolve => app.once("exit", resolve)); } await new Promise(resolve => backend.close(resolve)); }
