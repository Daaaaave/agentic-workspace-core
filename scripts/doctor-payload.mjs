#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const payloadRoot = path.join(repoRoot, "payload");
const target = fs.mkdtempSync(path.join(os.tmpdir(), "awc-payload-doctor-"));

try {
  fs.cpSync(payloadRoot, target, { recursive: true });

  const ignoreFragment = path.join(target, "gitignore.fragment");
  if (fs.existsSync(ignoreFragment)) {
    fs.copyFileSync(ignoreFragment, path.join(target, ".gitignore"));
  }

  const result = spawnSync(process.execPath, [".agents/knowledge-core/scripts/doctor.mjs"], {
    cwd: target,
    stdio: "inherit"
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
} finally {
  fs.rmSync(target, { recursive: true, force: true });
}
