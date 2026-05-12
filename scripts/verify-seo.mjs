#!/usr/bin/env node

import { spawn } from "node:child_process";
import { performance } from "node:perf_hooks";

const forwardedAuditArgs = process.argv.slice(2);

const steps = [
    { name: "TypeScript typecheck", command: "npm", args: ["run", "typecheck"] },
    { name: "ESLint", command: "npm", args: ["run", "lint"] },
    { name: "Next production build", command: "npm", args: ["run", "build"] },
    {
        name: "SEO release audit",
        command: "npm",
        args: forwardedAuditArgs.length > 0
            ? ["run", "seo:audit", "--", ...forwardedAuditArgs]
            : ["run", "seo:audit"],
    },
];

const timeoutSeconds = Number(process.env.VERIFY_SEO_STEP_TIMEOUT_SECONDS || 0);

function formatSeconds(startedAt) {
    return `${Math.round((performance.now() - startedAt) / 1000)}s`;
}

async function runStep(step) {
    const startedAt = performance.now();
    console.error(`\n[verify:seo] Starting ${step.name}: ${step.command} ${step.args.join(" ")}`);

    return new Promise((resolve, reject) => {
        const child = spawn(step.command, step.args, {
            stdio: "inherit",
            shell: false,
            env: process.env,
        });

        const heartbeat = setInterval(() => {
            console.error(`[verify:seo] ${step.name} still running after ${formatSeconds(startedAt)}.`);
        }, 30000);

        let timeout = null;
        if (Number.isFinite(timeoutSeconds) && timeoutSeconds > 0) {
            timeout = setTimeout(() => {
                child.kill("SIGTERM");
                reject(new Error(`${step.name} exceeded VERIFY_SEO_STEP_TIMEOUT_SECONDS=${timeoutSeconds}.`));
            }, timeoutSeconds * 1000);
        }

        child.on("error", error => {
            clearInterval(heartbeat);
            if (timeout) clearTimeout(timeout);
            reject(error);
        });

        child.on("exit", (code, signal) => {
            clearInterval(heartbeat);
            if (timeout) clearTimeout(timeout);

            if (signal) {
                reject(new Error(`${step.name} stopped with signal ${signal} after ${formatSeconds(startedAt)}.`));
                return;
            }

            if (code !== 0) {
                reject(new Error(`${step.name} failed with exit code ${code} after ${formatSeconds(startedAt)}.`));
                return;
            }

            console.error(`[verify:seo] Finished ${step.name} in ${formatSeconds(startedAt)}.`);
            resolve();
        });
    });
}

for (const step of steps) {
    await runStep(step);
}

console.error("\n[verify:seo] All checks passed.");
