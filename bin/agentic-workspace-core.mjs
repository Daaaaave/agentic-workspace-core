#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const payloadRoot = path.join(packageRoot, "payload");
const packageJson = readJson(path.join(packageRoot, "package.json"));
const packageManifest = readJson(path.join(payloadRoot, ".agents/knowledge-core/manifest.json"));

const command = process.argv[2] || "help";
const args = process.argv.slice(3);

const initReplaceEntries = [
  ["AGENTS.md", "AGENTS.md"],
  ["CLAUDE.md", "CLAUDE.md"],
  [".agents", ".agents"],
  ["docs", "docs"],
  ["llms.txt", "llms.txt"],
];

const updateBaseReplaceEntries = [
  ["AGENTS.md", "AGENTS.md"],
  ["CLAUDE.md", "CLAUDE.md"],
  [".agents/knowledge-core", ".agents/knowledge-core"]
];

const obsoleteManagedPaths = [
  [".agents/README.md", "obsolete agent layer index"],
  ["docs/generated", "old generated index location"]
];

const legacyAgentEntries = [
  ["AGENT.md", "singular AGENTS.md compatibility file"],
  ["agents.md", "lowercase AGENTS.md variant"],
  ["Agents.md", "mixed-case AGENTS.md variant"],
  ["AGENTS.local.md", "local AGENTS.md override"],
  ["AGENTS.override.md", "AGENTS.md override file"],
  ["CODEX.md", "legacy Codex/OpenCode instruction file"],
  [".codex", "Codex project config/instructions/skills"],
  ["INSTRUCTIONS.md", "generic agent instruction file"],
  ["CLAUDE.local.md", "Claude local project instructions"],
  [".claude", "Claude Code project commands/settings/agents"],
  ["GEMINI.md", "Gemini CLI context file"],
  [".gemini", "Gemini CLI project settings/commands"],
  [".geminiignore", "Gemini CLI context ignore file"],
  [".rules", "Zed project rules"],
  [".zed", "Zed project AI settings/rules"],
  [".cursorrules", "legacy Cursor rules"],
  [".cursorignore", "Cursor context ignore file"],
  ["CURSOR.md", "Cursor instruction file"],
  [".cursor", "Cursor project rules/settings/MCP config"],
  [".github/copilot-instructions.md", "GitHub Copilot repository instructions"],
  [".github/instructions", "GitHub Copilot path-specific instructions"],
  [".github/prompts", "GitHub Copilot prompt files"],
  [".vscode/copilot-instructions.md", "VS Code Copilot workspace instructions"],
  [".vscode/instructions", "VS Code instruction files"],
  [".vscode/mcp.json", "VS Code MCP server config"],
  [".vscode/prompts", "VS Code prompt files"],
  [".windsurfrules", "legacy Windsurf rules"],
  [".codeiumignore", "Codeium/Windsurf context ignore file"],
  ["WINDSURF.md", "Windsurf instruction file"],
  [".windsurf", "Windsurf workspace rules/workflows"],
  [".clinerules", "Cline workspace rules"],
  [".clinerules.md", "Cline workspace rules file"],
  ["CLINE.md", "Cline instruction file"],
  [".cline", "Cline project settings/rules"],
  [".continue", "Continue local rules/config"],
  [".roo", "Roo Code rules/modes/MCP config"],
  [".roomodes", "Roo Code project mode config"],
  [".roorules", "legacy Roo Code rules file"],
  [".roorules-code", "legacy Roo Code code-mode rules file"],
  [".roorules-architect", "legacy Roo Code architect-mode rules file"],
  ["ROO.md", "Roo Code instruction file"],
  ["CONVENTIONS.md", "Aider conventions file"],
  [".aider", "Aider project state/config"],
  [".aider.conf.yml", "Aider project config"],
  [".aider.conf.yaml", "Aider project config"],
  [".aiderignore", "Aider context ignore file"],
  [".aider.model.settings.yml", "Aider model settings"],
  [".aider.model.metadata.json", "Aider model metadata"],
  [".aider.chat.history.md", "Aider chat history"],
  [".aider.input.history", "Aider input history"],
  [".aider.tags.cache.v3", "Aider tags cache"],
  [".augment", "Augment rules/config"],
  [".augment-guidelines", "legacy Augment guidelines"],
  [".augment-guidelines.md", "legacy Augment guidelines"],
  [".devin", "Devin project config/instructions"],
  [".devin.yml", "Devin project config"],
  [".devin.yaml", "Devin project config"],
  ["DEVIN.md", "Devin instruction file"],
  ["devin.yml", "Devin project config"],
  ["devin.yaml", "Devin project config"],
  ["REVIEW.md", "Devin Review instruction file"],
  [".opencode", "OpenCode project agents/commands/config"],
  ["opencode.json", "OpenCode project config"],
  ["opencode.jsonc", "OpenCode project config"],
  ["OPENCODE.md", "OpenCode instruction file"],
  [".goose", "Goose project config"],
  ["GOOSE.md", "Goose instruction file"],
  [".openhands", "OpenHands project config"],
  ["openhands.yaml", "OpenHands project config"],
  ["openhands.yml", "OpenHands project config"],
  [".openhands_instructions", "OpenHands instruction file"],
  [".jules", "Jules project config"],
  ["JULES.md", "Jules instruction file"],
  [".kiro", "Kiro specs/steering/hooks"],
  ["KIRO.md", "Kiro instruction file"],
  [".kilocode", "Kilo Code project rules/config"],
  [".kilocodemodes", "Kilo Code project modes"],
  ["KILOCODE.md", "Kilo Code instruction file"],
  [".factory", "Factory project config"],
  ["FACTORY.md", "Factory instruction file"],
  [".amp", "Amp project config"],
  ["AMP.md", "Amp instruction file"],
  [".warp", "Warp project config"],
  ["WARP.md", "Warp instruction file"],
  [".qwen", "Qwen project config"],
  ["QWEN.md", "Qwen instruction file"],
  [".mcp.json", "project MCP server config"],
  ["mcp.json", "project MCP server config"],
  ["llm.txt", "legacy LLM context index"],
  ["LLM.txt", "legacy LLM context index"],
  ["llms.md", "legacy LLM context index"],
  ["llms-full.txt", "legacy LLM context index"],
  ["llms-small.txt", "legacy LLM context index"],
  ["MEMORY.md", "generic agent memory file"],
  ["memory.md", "generic agent memory file"],
  [".memory", "generic agent memory directory/file"],
  ["AI.md", "generic AI instruction file"],
  ["AI_CONTEXT.md", "generic AI context file"],
  ["LLM.md", "generic LLM instruction file"],
  ["LLMS.md", "generic LLM instruction file"],
  ["PROJECT_CONTEXT.md", "generic project context file"],
  ["PROMPT.md", "generic prompt instruction file"],
  [".aiassistant", "JetBrains AI Assistant project rules"],
  [".aiassistant/rules", "JetBrains AI Assistant project rules"],
  [".junie", "JetBrains Junie project guidelines/config"],
  [".junie/guidelines.md", "JetBrains Junie guidelines"],
  [".junie/instructions.md", "JetBrains Junie instructions"]
];

const legacyAgentEntryPatterns = [
  [/^\.clinerules-.+$/, "Cline mode-specific workspace rules file"],
  [/^\.roorules-.+$/, "Roo Code mode-specific rules file"],
  [/^llms-.+\.txt$/i, "legacy LLM context index"],
  [/^.+\.instructions\.md$/i, "workspace instruction file"]
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

  applyPlan(plan, flags);

  console.log(`Agentic Workspace Core updated: ${installedManifest.version} -> ${packageManifest.version}.`);
}

function buildPlan(targetRoot, mode, metadata = {}) {
  const replace = buildReplaceEntries(mode).map(([source, target]) => ({
    source,
    target,
    existed: fs.existsSync(path.join(targetRoot, target))
  }));
  const archive = mode === "init" ? buildLegacyArchiveEntries(targetRoot, replace) : [];

  return {
    mode,
    ...metadata,
    replace,
    archive,
    archiveRoot: archive.length > 0 ? legacyArchiveRootForPlan() : null,
    knowledgeConfig: mode === "update" ? "structured update" : "replace",
    packageJson: fs.existsSync(path.join(targetRoot, "package.json")) ? "update scripts" : "create with scripts",
    gitignore: fs.existsSync(path.join(targetRoot, ".gitignore")) ? "ensure local runtime ignores" : "create",
    generatedRoot: getSourceGeneratedRoot(),
    generated: fs.existsSync(path.join(targetRoot, getSourceGeneratedRoot())) ? "reset and rebuild" : "create",
    remove: mode === "update" ? buildObsoleteManagedEntries(targetRoot) : []
  };
}

function buildReplaceEntries(mode) {
  if (mode === "init") return initReplaceEntries;

  return [
    ...updateBaseReplaceEntries,
    ...starterSkillEntries()
  ];
}

function buildLegacyArchiveEntries(targetRoot, replaceEntries) {
  const candidates = [
    ...replaceEntries
      .filter((action) => action.existed)
      .map((action) => ({
        target: action.target,
        reason: "core-managed path being replaced"
      })),
    ...legacyAgentEntries.map(([target, reason]) => ({ target, reason })),
    ...discoverLegacyAgentPatternEntries(targetRoot)
  ];

  const seen = new Set();
  const existing = [];
  for (const candidate of candidates) {
    const target = normalizeRelativePath(candidate.target);
    if (!target || seen.has(target)) continue;
    const resolved = resolveExistingArchiveTarget(targetRoot, target);
    if (!resolved || seen.has(resolved.identity)) continue;
    seen.add(target);
    seen.add(resolved.identity);
    existing.push({ target: resolved.target, reason: candidate.reason });
  }

  existing.sort((left, right) => pathDepth(left.target) - pathDepth(right.target) || left.target.localeCompare(right.target));

  const selected = [];
  for (const entry of existing) {
    if (selected.some((parent) => isPathInside(entry.target, parent.target))) continue;
    selected.push(entry);
  }

  return selected;
}

function resolveExistingArchiveTarget(targetRoot, target) {
  const absolute = path.join(targetRoot, target);
  if (!fs.existsSync(absolute)) return null;

  const identity = archivePathIdentity(absolute);
  const realTarget = realRelativePath(targetRoot, absolute);
  return {
    target: realTarget || target,
    identity
  };
}

function archivePathIdentity(absolute) {
  try {
    return fs.realpathSync.native(absolute);
  } catch {
    return path.resolve(absolute);
  }
}

function realRelativePath(root, absolute) {
  try {
    const realRoot = fs.realpathSync.native(root);
    const realFile = fs.realpathSync.native(absolute);
    const relative = path.relative(realRoot, realFile);
    return normalizeRelativePath(relative);
  } catch {
    return null;
  }
}

function discoverLegacyAgentPatternEntries(targetRoot) {
  if (!fs.existsSync(targetRoot)) return [];

  return fs.readdirSync(targetRoot, { withFileTypes: true })
    .flatMap((entry) => {
      const matches = legacyAgentEntryPatterns
        .filter(([pattern]) => pattern.test(entry.name))
        .map(([, reason]) => ({ target: entry.name, reason }));
      return matches;
    });
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

function getSourceGeneratedRoot() {
  const sourceConfig = readJson(path.join(payloadRoot, ".agents/knowledge.config.json"));
  return isSafeRelativePath(sourceConfig.paths?.generatedRoot) ? sourceConfig.paths.generatedRoot : ".agents/generated";
}

function buildObsoleteManagedEntries(targetRoot) {
  return obsoleteManagedPaths
    .map(([target, reason]) => ({ target, reason, existed: fs.existsSync(path.join(targetRoot, target)) }))
    .filter((entry) => entry.existed);
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
  if (mode === "init" && plan.archive.length > 0) {
    const archiveVerb = flags.dryRun ? "would move" : "will move";
    console.log("");
    console.log(`Legacy agent context ${archiveVerb} to ${plan.archiveRoot}:`);
    for (const entry of plan.archive) {
      console.log(`- ${entry.target} (${entry.reason})`);
    }
  }
  if (mode === "update" && plan.remove.length > 0) {
    console.log("");
    console.log("Obsolete managed paths will be removed:");
    for (const entry of plan.remove) {
      console.log(`- ${entry.target} (${entry.reason})`);
    }
  }
  console.log(`- package.json (${plan.packageJson})`);
  console.log(`- .gitignore (${plan.gitignore})`);
  if (mode === "update" && !flags.skipCheck && !flags.allowBroken) {
    console.log("- baseline knowledge:check before replacement");
  }
  if (!plan.replace.some((action) => isPathInside(plan.generatedRoot, action.target))) {
    console.log(`- ${plan.generatedRoot} (${plan.generated})`);
  }
  console.log(flags.skipCheck ? "- generated indexes rebuilt" : "- generated indexes rebuilt and doctor run");
  console.log("");
}

function applyPlan(plan, flags) {
  const archiveResult = archiveLegacyAgentContext(plan, flags.target);

  for (const action of plan.replace) {
    const source = path.join(payloadRoot, action.source);
    const target = path.join(flags.target, action.target);
    replacePath(source, target);
  }

  updateKnowledgeConfig(flags.target, plan.mode);
  ensureDocDirectories(flags.target);
  updatePackageJson(flags.target);
  updateGitignore(flags.target);
  removeObsoleteManagedPaths(plan, flags.target);

  resetGenerated(flags.target);
  runNodeScript(flags.target, ".agents/knowledge-core/scripts/build-index.mjs");
  if (!flags.skipCheck) {
    runNodeScript(flags.target, ".agents/knowledge-core/scripts/doctor.mjs");
  }

  if (archiveResult && archiveResult.moved.length > 0) {
    console.log(`Legacy agent context archived to ${archiveResult.relativeRoot}.`);
  }
}

function removeObsoleteManagedPaths(plan, targetRoot) {
  for (const entry of plan.remove || []) {
    fs.rmSync(path.join(targetRoot, entry.target), { recursive: true, force: true });
  }
}

function archiveLegacyAgentContext(plan, targetRoot) {
  if (plan.mode !== "init" || plan.archive.length === 0) return null;

  const relativeRoot = plan.archiveRoot;
  const absoluteRoot = path.join(targetRoot, relativeRoot);
  const moved = [];

  for (const entry of plan.archive) {
    const source = path.join(targetRoot, entry.target);
    if (!fs.existsSync(source)) continue;

    const { destination, archivedAs } = nextAvailableArchivePath(absoluteRoot, entry.target);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    movePath(source, destination);
    moved.push({ ...entry, archivedAs });
  }

  if (moved.length > 0) {
    fs.mkdirSync(absoluteRoot, { recursive: true });
    const { destination } = nextAvailableArchivePath(absoluteRoot, "MANIFEST.md");
    fs.writeFileSync(destination, legacyManifest(relativeRoot, moved));
  }

  return { relativeRoot, moved };
}

function movePath(source, destination) {
  try {
    fs.renameSync(source, destination);
  } catch (error) {
    if (error && error.code === "EXDEV") {
      fs.cpSync(source, destination, { recursive: true, force: true, errorOnExist: false });
      fs.rmSync(source, { recursive: true, force: true });
      return;
    }
    throw error;
  }
}

function legacyManifest(relativeRoot, moved) {
  const lines = [
    "# Legacy Agent Context Archive",
    "",
    `Created: ${new Date().toISOString()}`,
    "",
    "These files were moved by `agentic-workspace-core init` before installing the clean core agent layer.",
    "They are preserved for review, but should not be treated as active project instructions.",
    "",
    `Archive path: \`${relativeRoot}\``,
    "",
    "Moved paths:",
    ""
  ];

  for (const entry of moved) {
    const suffix = entry.archivedAs === entry.target ? "" : ` -> \`${entry.archivedAs}\``;
    lines.push(`- \`${entry.target}\`${suffix}: ${entry.reason}`);
  }

  lines.push(
    "",
    "To recover durable project knowledge, review these files manually and move only verified, current facts into `docs/` or procedural rules into `.agents/skills/`.",
    "Do not treat this archive as active project instructions."
  );

  return `${lines.join("\n")}\n`;
}

function nextAvailableArchivePath(archiveRoot, relativeTarget) {
  const initial = path.join(archiveRoot, relativeTarget);
  if (!fs.existsSync(initial)) return { destination: initial, archivedAs: relativeTarget };

  const parsed = path.posix.parse(relativeTarget);
  const dir = parsed.dir;
  for (let index = 2; index < 1000; index += 1) {
    const name = `${parsed.name}.legacy-${index}${parsed.ext}`;
    const archivedAs = dir ? path.posix.join(dir, name) : name;
    const destination = path.join(archiveRoot, archivedAs);
    if (!fs.existsSync(destination)) return { destination, archivedAs };
  }

  die(`Cannot find an available legacy archive path for ${relativeTarget}`);
}

function legacyArchiveRootForPlan() {
  return "legacy";
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
  const generated = path.join(targetRoot, getGeneratedRoot(targetRoot));
  fs.rmSync(generated, { recursive: true, force: true });
  fs.mkdirSync(generated, { recursive: true });
}

function getGeneratedRoot(targetRoot) {
  const configFile = path.join(targetRoot, ".agents/knowledge.config.json");
  if (fs.existsSync(configFile)) {
    const config = readJson(configFile);
    if (isSafeRelativePath(config.paths?.generatedRoot)) return config.paths.generatedRoot;
  }
  return getSourceGeneratedRoot();
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
  const file = path.join(payloadRoot, "gitignore.fragment");
  if (!fs.existsSync(file)) die("Package payload is missing: gitignore.fragment");
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

function normalizeRelativePath(value) {
  if (!isSafeRelativePath(value)) return null;
  return path.normalize(value).split(path.sep).join(path.posix.sep);
}

function pathDepth(value) {
  return value.split("/").length;
}

function isPathInside(child, parent) {
  return child === parent || child.startsWith(`${parent}/`);
}

function printHelp() {
  console.log(`agentic-workspace-core ${packageJson.version}

Usage:
  agentic-workspace-core init [--target <dir>] [--dry-run] [--skip-check]
  agentic-workspace-core update [--target <dir>] [--dry-run] [--skip-check] [--allow-broken]
  agentic-workspace-core version
`);
}

function printInitHelp() {
  console.log(`Usage:
  agentic-workspace-core init [options]

Options:
  --target, -C <dir>  Directory to initialize. Defaults to current directory.
  --dry-run          Print the init plan without writing files.
  --skip-check       Rebuild generated indexes but skip doctor validation.
`);
}

function printUpdateHelp() {
  console.log(`Usage:
  agentic-workspace-core update [options]

Updates core-managed paths and starter skills while preserving project-specific skills/evals and safe local config extensions.

Options:
  --target, -C <dir>  Directory to update. Defaults to current directory.
  --dry-run          Print the update plan without writing files.
  --skip-check       Rebuild generated indexes but skip baseline check and doctor validation.
  --allow-broken     Allow update when the pre-update knowledge check fails.
`);
}

function die(message) {
  console.error(message);
  process.exit(1);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
