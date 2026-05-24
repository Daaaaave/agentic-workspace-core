#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import readline from "node:readline/promises";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const payloadRoot = path.join(packageRoot, "payload");
const packageJson = readJson(path.join(packageRoot, "package.json"));
const packageManifest = readJson(path.join(payloadRoot, ".agents/knowledge-core/manifest.json"));

const command = process.argv[2] || "help";
const args = process.argv.slice(3);

const baseReplaceEntries = [
  ["AGENTS.md", "AGENTS.md"],
  ["CLAUDE.md", "CLAUDE.md"],
  ["docs/index.md", "docs/index.md"],
  ["docs/knowledge-system.md", "docs/knowledge-system.md"],
  [".agents/README.md", ".agents/README.md"],
  [".agents/knowledge-core", ".agents/knowledge-core"]
];

const initOnlyReplaceEntries = [
  [".agents/knowledge.config.json", ".agents/knowledge.config.json"],
  [".agents/skills", ".agents/skills"],
  [".agents/evals", ".agents/evals"],
  ["llms.txt", "llms.txt"],
  ["docs/generated", "docs/generated"]
];

function parseFlags(values) {
  const flags = {
    target: process.cwd(),
    yes: false,
    dryRun: false,
    skipCheck: false,
    allowBroken: false
  };

  for (let index = 0; index < values.length; index += 1) {
    const arg = values[index];
    if (arg === "--target" || arg === "-C") {
      const next = values[index + 1];
      if (!next) die(`${arg} requires a path`);
      flags.target = next;
      index += 1;
      continue;
    }
    if (arg.startsWith("--target=")) {
      flags.target = arg.slice("--target=".length);
      continue;
    }
    if (arg === "--yes" || arg === "-y") {
      flags.yes = true;
      continue;
    }
    if (arg === "--dry-run") {
      flags.dryRun = true;
      continue;
    }
    if (arg === "--skip-check") {
      flags.skipCheck = true;
      continue;
    }
    if (arg === "--allow-broken") {
      flags.allowBroken = true;
      continue;
    }
    if (arg === "--help" || arg === "-h") {
      flags.help = true;
      continue;
    }
    die(`Unknown option: ${arg}`);
  }

  flags.target = path.resolve(flags.target);
  return flags;
}

async function main() {
  if (command === "help" || command === "--help" || command === "-h") {
    printHelp();
    return;
  }

  if (command === "version" || command === "--version" || command === "-v") {
    console.log(packageJson.version);
    return;
  }

  if (command === "init") {
    await init(parseFlags(args));
    return;
  }

  if (command === "update") {
    await update(parseFlags(args));
    return;
  }

  die(`Unknown command: ${command}`);
}

async function init(flags) {
  if (flags.help) {
    printInitHelp();
    return;
  }

  ensureDirectory(flags.target);

  const plan = buildPlan(flags.target, "init");
  printPlan(plan, flags, "init");

  if (flags.dryRun) return;

  await confirmIfNeeded(plan, flags, "init");

  applyPlan(plan, flags);

  console.log("Agentic Workspace Core initialized.");
}

async function update(flags) {
  if (flags.help) {
    printUpdateHelp();
    return;
  }

  ensureExistingDirectory(flags.target);
  const installedManifest = readInstalledManifest(flags.target);
  const plan = buildPlan(flags.target, "update", {
    currentVersion: installedManifest.version,
    targetVersion: packageManifest.version
  });
  printPlan(plan, flags, "update");

  if (flags.dryRun) return;

  if (!flags.skipCheck && !flags.allowBroken) {
    runNpmScript(flags.target, "knowledge:check", "Baseline knowledge check failed. Fix it first or rerun with --allow-broken.");
  }

  await confirmIfNeeded(plan, flags, "update");
  applyPlan(plan, flags);

  console.log(`Agentic Workspace Core updated: ${installedManifest.version} -> ${packageManifest.version}.`);
}

function buildPlan(targetRoot, mode, metadata = {}) {
  const replace = buildReplaceEntries(mode).map(([source, target]) => ({
    source,
    target,
    existed: fs.existsSync(path.join(targetRoot, target))
  }));

  return {
    mode,
    ...metadata,
    replace,
    knowledgeConfig: mode === "update" ? "structured update" : "replace",
    packageJson: fs.existsSync(path.join(targetRoot, "package.json")) ? "update scripts" : "create with scripts",
    gitignore: fs.existsSync(path.join(targetRoot, ".gitignore")) ? "ensure local runtime ignores" : "create",
    generated: fs.existsSync(path.join(targetRoot, "docs/generated")) ? "reset and rebuild" : "create"
  };
}

function buildReplaceEntries(mode) {
  if (mode === "init") return [...baseReplaceEntries, ...initOnlyReplaceEntries];

  return [
    ...baseReplaceEntries,
    ...starterSkillEntries()
  ];
}

function starterSkillEntries() {
  return getStarterSkills().flatMap((skill) => [
    [`.agents/skills/${skill}`, `.agents/skills/${skill}`],
    [`.agents/evals/skills/${skill}.eval.md`, `.agents/evals/skills/${skill}.eval.md`]
  ]);
}

function getStarterSkills() {
  if (Array.isArray(packageManifest.starterSkills) && packageManifest.starterSkills.length > 0) {
    return packageManifest.starterSkills;
  }

  const skillsDir = path.join(payloadRoot, ".agents/skills");
  return fs.readdirSync(skillsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => entry.name)
    .sort();
}

function printPlan(plan, flags, mode) {
  const verb = flags.dryRun ? "would replace" : "will replace";
  console.log(`Agentic Workspace Core ${mode} target: ${flags.target}`);
  if (mode === "update") {
    console.log(`Version: ${plan.currentVersion} -> ${plan.targetVersion}`);
  }
  console.log("");
  console.log(`Managed paths ${verb}:`);
  for (const action of plan.replace) {
    const marker = action.existed ? "overwrite" : "create";
    console.log(`- ${action.target} (${marker})`);
  }
  if (mode === "update") {
    console.log(`- .agents/knowledge.config.json (${plan.knowledgeConfig})`);
  }
  console.log(`- package.json (${plan.packageJson})`);
  console.log(`- .gitignore (${plan.gitignore})`);
  if (!flags.skipCheck) {
    if (mode === "update" && !flags.allowBroken) {
      console.log("- baseline knowledge:check before replacement");
    }
    if (!plan.replace.some((action) => action.target === "docs/generated")) {
      console.log(`- docs/generated (${plan.generated})`);
    }
    console.log("- generated indexes rebuilt and doctor run");
  }
  console.log("");
}

async function confirmIfNeeded(plan, flags, mode) {
  const destructive = plan.replace.filter((action) => action.existed);
  if (destructive.length === 0 || flags.yes) return;

  if (!process.stdin.isTTY) {
    die(`Refusing to ${mode} existing managed paths without --yes in a non-interactive shell.`);
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(`Overwrite existing managed Agentic Workspace Core paths for ${mode}? Type 'yes' to continue: `);
  rl.close();
  if (answer !== "yes") die(`${capitalize(mode)} aborted.`);
}

function applyPlan(plan, flags) {
  for (const action of plan.replace) {
    const source = path.join(payloadRoot, action.source);
    const target = path.join(flags.target, action.target);
    replacePath(source, target);
  }

  updateKnowledgeConfig(flags.target, plan.mode);
  ensureDocDirectories(flags.target);
  updatePackageJson(flags.target);
  updateGitignore(flags.target);

  if (!flags.skipCheck) {
    resetGenerated(flags.target);
    runNodeScript(flags.target, ".agents/knowledge-core/scripts/build-index.mjs");
    runNodeScript(flags.target, ".agents/knowledge-core/scripts/doctor.mjs");
  }
}

function replacePath(source, target) {
  if (!fs.existsSync(source)) die(`Package payload is missing: ${path.relative(payloadRoot, source)}`);
  fs.rmSync(target, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.cpSync(source, target, { recursive: true, force: true, errorOnExist: false });
}

function updateKnowledgeConfig(targetRoot, mode) {
  const sourceConfig = readJson(path.join(payloadRoot, ".agents/knowledge.config.json"));
  const targetConfigPath = path.join(targetRoot, ".agents/knowledge.config.json");
  if (mode !== "update") {
    writeJson(targetConfigPath, sourceConfig);
    return;
  }

  const existingConfig = fs.existsSync(targetConfigPath) ? readJson(targetConfigPath) : {};
  writeJson(targetConfigPath, mergeKnowledgeConfig(sourceConfig, existingConfig));
}

function mergeKnowledgeConfig(sourceConfig, existingConfig) {
  const next = cloneJson(sourceConfig);

  if (isPlainObject(existingConfig.project)) {
    next.project = {
      ...(isPlainObject(sourceConfig.project) ? sourceConfig.project : {}),
      ...existingConfig.project
    };
  }

  const sourceDirectories = asStringArray(sourceConfig.documents?.defaultDirectories);
  const localDirectories = asStringArray(existingConfig.documents?.defaultDirectories);
  next.documents.defaultDirectories = uniqueStrings([...sourceDirectories, ...localDirectories])
    .filter(isSafeRelativePath);

  const sourceIgnorePaths = asStringArray(sourceConfig.ignore?.paths);
  const localIgnorePaths = asStringArray(existingConfig.ignore?.paths);
  next.ignore.paths = uniqueStrings([...sourceIgnorePaths, ...localIgnorePaths])
    .filter(isSafeRelativePath);

  const sourceIgnoredDocs = asStringArray(sourceConfig.ignore?.authoredDocs);
  const localIgnoredDocs = asStringArray(existingConfig.ignore?.authoredDocs);
  next.ignore.authoredDocs = uniqueStrings([...sourceIgnoredDocs, ...localIgnoredDocs])
    .filter(isSafeRelativePath);

  return next;
}

function ensureDocDirectories(targetRoot) {
  for (const dir of getConfiguredDocDirectories(targetRoot)) {
    const absolute = path.join(targetRoot, dir);
    fs.mkdirSync(absolute, { recursive: true });
    const keep = path.join(absolute, ".gitkeep");
    if (!fs.existsSync(keep)) fs.writeFileSync(keep, "");
  }
}

function getConfiguredDocDirectories(targetRoot) {
  const configFile = path.join(targetRoot, ".agents/knowledge.config.json");
  if (fs.existsSync(configFile)) {
    const config = readJson(configFile);
    const directories = asStringArray(config.documents?.defaultDirectories).filter(isSafeRelativePath);
    if (directories.length > 0) return directories;
  }

  const sourceConfig = readJson(path.join(payloadRoot, ".agents/knowledge.config.json"));
  return asStringArray(sourceConfig.documents?.defaultDirectories).filter(isSafeRelativePath);
}

function resetGenerated(targetRoot) {
  const generated = path.join(targetRoot, "docs/generated");
  fs.rmSync(generated, { recursive: true, force: true });
  fs.mkdirSync(generated, { recursive: true });
}

function updatePackageJson(targetRoot) {
  const file = path.join(targetRoot, "package.json");
  const pkg = fs.existsSync(file) ? readJson(file) : {};
  pkg.scripts = {
    ...(isPlainObject(pkg.scripts) ? pkg.scripts : {}),
    "knowledge:build": "node .agents/knowledge-core/scripts/build-index.mjs",
    "knowledge:doctor": "node .agents/knowledge-core/scripts/doctor.mjs",
    "knowledge:check": "node .agents/knowledge-core/scripts/build-index.mjs --check && npm run knowledge:doctor"
  };
  writeJson(file, pkg);
}

function updateGitignore(targetRoot) {
  const file = path.join(targetRoot, ".gitignore");
  const current = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
  const lines = current.split(/\r?\n/).map((line) => line.trim());
  const desired = readGitignoreFragment();
  const additions = desired.filter((line) => !lines.includes(line) && !(line === ".context/" && lines.includes(".context/**")));
  if (additions.length === 0) return;

  const prefix = current.endsWith("\n") || current.length === 0 ? current : `${current}\n`;
  fs.writeFileSync(file, `${prefix}${additions.join("\n")}\n`);
}

function readGitignoreFragment() {
  const file = path.join(payloadRoot, "gitignore");
  if (!fs.existsSync(file)) die("Package payload is missing: gitignore");
  return fs.readFileSync(file, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"));
}

function runNodeScript(targetRoot, script) {
  const result = spawnSync(process.execPath, [script], {
    cwd: targetRoot,
    stdio: "inherit"
  });
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

function runNpmScript(targetRoot, script, failureMessage) {
  const result = spawnSync("npm", ["run", script], {
    cwd: targetRoot,
    stdio: "inherit"
  });
  if (result.error) {
    die(`Failed to run npm: ${result.error.message}`);
  }
  if (result.status !== 0) {
    die(failureMessage);
  }
}

function ensureDirectory(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    return;
  }
  if (!fs.statSync(dir).isDirectory()) die(`Target is not a directory: ${dir}`);
}

function ensureExistingDirectory(dir) {
  if (!fs.existsSync(dir)) die(`Target directory does not exist: ${dir}`);
  if (!fs.statSync(dir).isDirectory()) die(`Target is not a directory: ${dir}`);
}

function readInstalledManifest(targetRoot) {
  const required = [
    "AGENTS.md",
    ".agents/knowledge.config.json",
    ".agents/knowledge-core/manifest.json"
  ];
  for (const file of required) {
    if (!fs.existsSync(path.join(targetRoot, file))) {
      die(`Agentic Workspace Core is not installed in ${targetRoot}. Missing ${file}. Run init first.`);
    }
  }
  return readJson(path.join(targetRoot, ".agents/knowledge-core/manifest.json"));
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    die(`Cannot read JSON ${file}: ${error.message}`);
  }
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function asStringArray(value) {
  return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
}

function uniqueStrings(values) {
  return [...new Set(values.filter((value) => value.length > 0))];
}

function isSafeRelativePath(value) {
  if (typeof value !== "string" || value.length === 0) return false;
  if (path.isAbsolute(value)) return false;
  if (value.split(/[\\/]+/).includes("..")) return false;
  const normalized = path.normalize(value);
  return normalized !== "." && !normalized.startsWith("..") && !path.isAbsolute(normalized);
}

function printHelp() {
  console.log(`agentic-workspace-core ${packageJson.version}

Usage:
  agentic-workspace-core init [--target <dir>] [--yes] [--dry-run] [--skip-check]
  agentic-workspace-core update [--target <dir>] [--yes] [--dry-run] [--skip-check] [--allow-broken]
  agentic-workspace-core version
`);
}

function printInitHelp() {
  console.log(`Usage:
  agentic-workspace-core init [options]

Options:
  --target, -C <dir>  Directory to initialize. Defaults to current directory.
  --yes, -y          Overwrite existing managed paths without prompting.
  --dry-run          Print the init plan without writing files.
  --skip-check       Skip index rebuild and doctor validation.
`);
}

function printUpdateHelp() {
  console.log(`Usage:
  agentic-workspace-core update [options]

Updates core-managed paths and starter skills while preserving project-specific skills/evals and safe local config extensions.

Options:
  --target, -C <dir>  Directory to update. Defaults to current directory.
  --yes, -y          Overwrite existing managed paths without prompting.
  --dry-run          Print the update plan without writing files.
  --skip-check       Skip baseline check, index rebuild, and doctor validation.
  --allow-broken     Allow update when the pre-update knowledge check fails.
`);
}

function capitalize(value) {
  return value.slice(0, 1).toUpperCase() + value.slice(1);
}

function die(message) {
  console.error(message);
  process.exit(1);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
