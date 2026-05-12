#!/usr/bin/env node

import { spawn } from "node:child_process";
import { performance } from "node:perf_hooks";

const separatorIndex = process.argv.indexOf("--");
const label = process.argv[2] || "Command";

if (separatorIndex === -1 || separatorIndex === process.argv.length - 1) {
    console.error("Usage: node ./scripts/run-with-heartbeat.mjs \"Label\" -- <command> [args...]");
    process.exit(1);
}

const [command, ...args] = process.argv.slice(separatorIndex + 1);
const timeoutSeconds = Number(process.env.CHECK_STEP_TIMEOUT_SECONDS || 0);
const startedAt = performance.now();

function elapsedSeconds() {
    return Math.round((performance.now() - startedAt) / 1000);
}

console.error(`[${label}] Starting: ${command} ${args.join(" ")}`);

const child = spawn(command, args, {
    stdio: "inherit",
    shell: false,
    env: process.env,
});

const heartbeat = setInterval(() => {
    console.error(`[${label}] Still running after ${elapsedSeconds()}s.`);
}, 30000);

let timeout = null;
if (Number.isFinite(timeoutSeconds) && timeoutSeconds > 0) {
    timeout = setTimeout(() => {
        child.kill("SIGTERM");
        console.error(`[${label}] Stopped after CHECK_STEP_TIMEOUT_SECONDS=${timeoutSeconds}.`);
        process.exitCode = 1;
    }, timeoutSeconds * 1000);
}

child.on("error", error => {
    clearInterval(heartbeat);
    if (timeout) clearTimeout(timeout);
    console.error(`[${label}] Failed to start: ${error.message}`);
    process.exitCode = 1;
});

child.on("exit", (code, signal) => {
    clearInterval(heartbeat);
    if (timeout) clearTimeout(timeout);

    if (signal) {
        console.error(`[${label}] Stopped with signal ${signal} after ${elapsedSeconds()}s.`);
        process.exitCode = 1;
        return;
    }

    if (code !== 0) {
        console.error(`[${label}] Failed with exit code ${code} after ${elapsedSeconds()}s.`);
        process.exitCode = code || 1;
        return;
    }

    console.error(`[${label}] Finished in ${elapsedSeconds()}s.`);
});
