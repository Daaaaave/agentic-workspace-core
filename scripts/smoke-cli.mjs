#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const payloadRoot = path.join(repoRoot, "payload");
const cli = path.join(repoRoot, "bin/agentic-workspace-core.mjs");
const packageJson = readJson(path.join(repoRoot, "package.json"));
const target = fs.mkdtempSync(path.join(os.tmpdir(), "awc-smoke-"));
const skipCheckTarget = fs.mkdtempSync(path.join(os.tmpdir(), "awc-smoke-skip-check-"));

try {
  assertPayloadComplete();
  runCli(["init", "--target", skipCheckTarget, "--skip-check"]);
  verifyInstalledCore(skipCheckTarget);
  addLegacyInputs(target);
  runCli(["init", "--target", target]);
  verifyInstalledCore(target);
  verifyLegacyArchive(target);
  addLocalOverrides(target);
  runCli(["update", "--target", target]);
  verifyInstalledCore(target);
  verifyLocalOverrides(target);
  addLocalKnowledgeAndStaleIndexes(target);
  runCli(["update", "--target", target, "--skip-check"]);
  verifyInstalledCore(target);
  verifyLocalOverrides(target);
  verifyLocalKnowledgeIndexed(target);
  runCli(["update", "--target", target, "--full"]);
  verifyInstalledCore(target);
  verifyFullUpdate(target);
  console.log(`CLI smoke passed: ${target}`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

function runCli(args) {
  const result = spawnSync(process.execPath, [cli, ...args], {
    cwd: repoRoot,
    stdio: "inherit"
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`CLI command failed: ${args.join(" ")}`);
  }
}

function assertPayloadComplete() {
  const required = [
    "AGENTS.md",
    "CLAUDE.md",
    "gitignore.fragment",
    "llms.txt",
    ".agents/generated/knowledge-map.md",
    ".agents/generated/knowledge-graph.json",
    "docs/architecture/.gitkeep",
    "docs/components/.gitkeep",
    "docs/domain/.gitkeep",
    "docs/workflows/.gitkeep",
    "docs/runbooks/.gitkeep",
    "docs/decisions/.gitkeep",
    "docs/research/.gitkeep",
    "docs/plans/.gitkeep",
    "docs/reference/.gitkeep",
    "docs/glossary/.gitkeep",
    ".agents/knowledge.config.json",
    ".agents/knowledge-core/manifest.json",
    ".agents/knowledge-core/scripts/build-index.mjs",
    ".agents/knowledge-core/scripts/doctor.mjs",
    ".agents/skills/project-knowledge/SKILL.md",
    ".agents/skills/research-to-knowledge/SKILL.md",
    ".agents/skills/software-development-workflow/SKILL.md",
    ".agents/skills/software-development-workflow/references/task-contract.md",
    ".agents/skills/software-development-workflow/references/context-plan.md",
    ".agents/skills/software-development-workflow/references/implementation-loop.md",
    ".agents/skills/software-development-workflow/references/debugging-loop.md",
    ".agents/skills/software-development-workflow/references/security-gate.md",
    ".agents/skills/software-development-workflow/references/done-gate.md",
    ".agents/skills/write-agent-handoff/SKILL.md",
    ".agents/skills/write-agent-skill/SKILL.md",
    ".agents/evals/skills/software-development-workflow.eval.md"
  ];

  const missing = required.filter((file) => !fs.existsSync(path.join(payloadRoot, file)));
  if (missing.length > 0) throw new Error(`Payload is incomplete:\n${missing.join("\n")}`);

  const manifest = readJson(path.join(payloadRoot, ".agents/knowledge-core/manifest.json"));
  if (manifest.version !== packageJson.version) {
    throw new Error(`Payload manifest version ${manifest.version} does not match package version ${packageJson.version}`);
  }

  const config = readJson(path.join(payloadRoot, ".agents/knowledge.config.json"));
  const configuredDocDirs = config.documents?.defaultDirectories || [];
  const missingDocDirs = configuredDocDirs
    .map((dir) => `${dir}/.gitkeep`)
    .filter((file) => !fs.existsSync(path.join(payloadRoot, file)));
  if (missingDocDirs.length > 0) {
    throw new Error(`Payload docs skeleton does not match config.documents.defaultDirectories:\n${missingDocDirs.join("\n")}`);
  }

}

function addLocalOverrides(root) {
  const configPath = path.join(root, ".agents/knowledge.config.json");
  const config = readJson(configPath);
  config.project.localFlag = "keep-me";
  config.documents.defaultDirectories.push("docs/custom");
  config.ignore.paths.push("tmp-local/**");
  config.ignore.authoredDocs.push("docs/private/**");
  writeJson(configPath, config);

  const customDocsDir = path.join(root, "docs/custom");
  fs.mkdirSync(customDocsDir, { recursive: true });
  fs.writeFileSync(path.join(customDocsDir, ".gitkeep"), "");

  const skillDir = path.join(root, ".agents/skills/local-reviewer");
  fs.mkdirSync(skillDir, { recursive: true });
  fs.writeFileSync(path.join(skillDir, "SKILL.md"), `---
name: local-reviewer
description: Use for local project review conventions.
---

# Local Reviewer

Project-local skill kept across core updates.
`);

  const evalDir = path.join(root, ".agents/evals/skills");
  fs.mkdirSync(evalDir, { recursive: true });
  fs.writeFileSync(path.join(evalDir, "local-reviewer.eval.md"), `# local-reviewer Eval

## Should Trigger

| Prompt | Expected Behavior |
| --- | --- |
| "Apply our local review convention." | Loads the local project review skill. |

## Should Not Trigger

| Prompt | Expected Behavior |
| --- | --- |
| "Review this third-party skill." | Uses write-agent-skill instead. |

## Edge Cases

| Prompt | Expected Behavior |
| --- | --- |
| "Review code and also consider local conventions." | Uses the development workflow and may consult this local skill if available. |
`);

  writeText(path.join(root, ".agents/README.md"), "# Stale managed README\n");
  fs.mkdirSync(path.join(root, "docs/generated"), { recursive: true });
  writeText(path.join(root, "docs/generated/old-index.md"), "# Old generated index\n");
}

function addLocalKnowledgeAndStaleIndexes(root) {
  addObsoleteManagedDocs(root);
  writeText(path.join(root, "docs/custom/local-release.md"), `---
id: runbook.local-release
type: runbook
status: current
owner: smoke
summary: Local release procedure used to verify generated index rebuilds.
canonical_for:
  - local-release
last_reviewed: 2026-05-24
---

# Local Release

Smoke-only local knowledge document.
`);
  writeText(path.join(root, "llms.txt"), "stale llms index\n");
  writeText(path.join(root, ".agents/generated/knowledge-map.md"), "stale knowledge map\n");
  writeText(path.join(root, ".agents/generated/knowledge-graph.json"), "{\"stale\":true}\n");
}

function addObsoleteManagedDocs(root) {
  writeText(path.join(root, "docs/index.md"), `---
id: project.index
type: overview
status: current
owner: project
summary: Obsolete package docs home.
canonical_for:
  - project.index
last_reviewed: 2026-05-24
---

# Project Knowledge

Obsolete smoke-only docs home.
`);

  writeText(path.join(root, "docs/knowledge-system.md"), `---
id: project.knowledge-system
type: policy
status: current
owner: project
summary: Obsolete package knowledge-system policy.
canonical_for:
  - project.knowledge-system
last_reviewed: 2026-05-24
---

# Knowledge System

Obsolete smoke-only knowledge-system policy.
`);
}

function addLegacyInputs(root) {
  writeText(path.join(root, "AGENTS.md"), "# Old Agent Instructions\n\nlegacy root instructions\n");
  writeText(path.join(root, "CLAUDE.md"), "# Old Claude Instructions\n\nlegacy claude instructions\n");
  writeText(path.join(root, "GEMINI.md"), "# Old Gemini Instructions\n\nlegacy gemini instructions\n");
  writeText(path.join(root, "CODEX.md"), "# Old Codex Instructions\n\nlegacy codex instructions\n");
  writeText(path.join(root, "CONVENTIONS.md"), "# Old Aider Conventions\n\nlegacy aider conventions\n");
  writeText(path.join(root, "MEMORY.md"), "# Old Agent Memory\n\nlegacy memory\n");
  writeText(path.join(root, "backend.instructions.md"), "legacy root instruction file\n");
  writeText(path.join(root, "llms-dev.txt"), "legacy llms dev index\n");
  writeText(path.join(root, "llms-full.txt"), "legacy llms full index\n");
  writeText(path.join(root, ".mcp.json"), "{ \"mcpServers\": {} }\n");
  writeText(path.join(root, "docs/old-architecture.md"), "# Old Architecture\n\nlegacy docs\n");
  writeText(path.join(root, ".agents/skills/old-skill/SKILL.md"), "# Old Skill\n");
  writeText(path.join(root, ".codex/config.toml"), "[project]\n");
  writeText(path.join(root, ".cursor/rules/old.mdc"), "legacy cursor rule\n");
  writeText(path.join(root, ".cursorignore"), "dist\n");
  writeText(path.join(root, ".github/copilot-instructions.md"), "legacy copilot instructions\n");
  writeText(path.join(root, ".github/instructions/general.instructions.md"), "---\napplyTo: '**'\n---\nlegacy instruction\n");
  writeText(path.join(root, ".github/workflows/ci.yml"), "name: ci\n");
  writeText(path.join(root, ".vscode/mcp.json"), "{ \"servers\": {} }\n");
  writeText(path.join(root, ".windsurf/rules/old.md"), "---\ntrigger: always_on\n---\nlegacy windsurf rule\n");
  writeText(path.join(root, ".codeiumignore"), "tmp\n");
  writeText(path.join(root, ".clinerules/old.md"), "legacy cline rule\n");
  writeText(path.join(root, ".clinerules-debug"), "legacy cline debug rule\n");
  writeText(path.join(root, ".roo/rules-code/old.md"), "legacy roo rule\n");
  writeText(path.join(root, ".roorules-debug"), "legacy roo debug rule\n");
  writeText(path.join(root, ".continue/rules/old.md"), "legacy continue rule\n");
  writeText(path.join(root, ".aider.conf.yml"), "read: [CONVENTIONS.md]\n");
  writeText(path.join(root, ".aider.tags.cache.v3"), "legacy aider tags\n");
  writeText(path.join(root, ".augment/rules/old.md"), "legacy augment rule\n");
  writeText(path.join(root, ".devin/config.json"), "{}\n");
  writeText(path.join(root, ".devin.yml"), "setup: []\n");
  writeText(path.join(root, ".opencode/agent/reviewer.md"), "legacy opencode agent\n");
  writeText(path.join(root, ".kiro/steering/product.md"), "legacy kiro steering\n");
  writeText(path.join(root, ".junie/guidelines.md"), "legacy junie guideline\n");
  writeText(path.join(root, ".qwen/rules/old.md"), "legacy qwen rule\n");
}

function verifyInstalledCore(root) {
  const required = [
    "AGENTS.md",
    "CLAUDE.md",
    ".gitignore",
    "llms.txt",
    ".agents/generated/knowledge-map.md",
    ".agents/generated/knowledge-graph.json",
    "docs/architecture/.gitkeep",
    "docs/research/.gitkeep",
    ".agents/knowledge.config.json",
    ".agents/knowledge-core/manifest.json",
    ".agents/skills/software-development-workflow/SKILL.md",
    ".agents/skills/software-development-workflow/references/done-gate.md",
    ".agents/evals/skills/software-development-workflow.eval.md"
  ];
  const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
  if (missing.length > 0) throw new Error(`Installed core is incomplete:\n${missing.join("\n")}`);

  const manifest = readJson(path.join(root, ".agents/knowledge-core/manifest.json"));
  if (manifest.version !== packageJson.version) {
    throw new Error(`Installed manifest version ${manifest.version} does not match package version ${packageJson.version}`);
  }

  const config = readJson(path.join(root, ".agents/knowledge.config.json"));
  const configuredDocDirs = config.documents?.defaultDirectories || [];
  const missingDocDirs = configuredDocDirs
    .map((dir) => `${dir}/.gitkeep`)
    .filter((file) => !fs.existsSync(path.join(root, file)));
  if (missingDocDirs.length > 0) {
    throw new Error(`Installed docs skeleton does not match config.documents.defaultDirectories:\n${missingDocDirs.join("\n")}`);
  }

  const gitignore = fs.readFileSync(path.join(root, ".gitignore"), "utf8");
  if (!gitignore.includes(".context/") || !gitignore.includes("CLAUDE.local.md") || !gitignore.includes("legacy/")) {
    throw new Error("Installed .gitignore is missing required local runtime ignores");
  }
}

function verifyLegacyArchive(root) {
  const archived = [
    "legacy/AGENTS.md",
    "legacy/CLAUDE.md",
    "legacy/GEMINI.md",
    "legacy/CODEX.md",
    "legacy/CONVENTIONS.md",
    "legacy/MEMORY.md",
    "legacy/backend.instructions.md",
    "legacy/llms-dev.txt",
    "legacy/llms-full.txt",
    "legacy/.mcp.json",
    "legacy/docs/old-architecture.md",
    "legacy/.agents/skills/old-skill/SKILL.md",
    "legacy/.codex/config.toml",
    "legacy/.cursor/rules/old.mdc",
    "legacy/.cursorignore",
    "legacy/.github/copilot-instructions.md",
    "legacy/.github/instructions/general.instructions.md",
    "legacy/.vscode/mcp.json",
    "legacy/.windsurf/rules/old.md",
    "legacy/.codeiumignore",
    "legacy/.clinerules/old.md",
    "legacy/.clinerules-debug",
    "legacy/.roo/rules-code/old.md",
    "legacy/.roorules-debug",
    "legacy/.continue/rules/old.md",
    "legacy/.aider.conf.yml",
    "legacy/.aider.tags.cache.v3",
    "legacy/.augment/rules/old.md",
    "legacy/.devin/config.json",
    "legacy/.devin.yml",
    "legacy/.opencode/agent/reviewer.md",
    "legacy/.kiro/steering/product.md",
    "legacy/.junie/guidelines.md",
    "legacy/.qwen/rules/old.md",
    "legacy/MANIFEST.md"
  ];
  const missing = archived.filter((file) => !fs.existsSync(path.join(root, file)));
  if (missing.length > 0) throw new Error(`Legacy archive is incomplete:\n${missing.join("\n")}`);

  const removedFromActiveSurface = [
    "GEMINI.md",
    "CODEX.md",
    "CONVENTIONS.md",
    "MEMORY.md",
    "backend.instructions.md",
    "llms-dev.txt",
    "llms-full.txt",
    ".mcp.json",
    "docs/old-architecture.md",
    ".codex/config.toml",
    ".cursor/rules/old.mdc",
    ".cursorignore",
    ".github/copilot-instructions.md",
    ".github/instructions/general.instructions.md",
    ".vscode/mcp.json",
    ".windsurf/rules/old.md",
    ".codeiumignore",
    ".clinerules/old.md",
    ".clinerules-debug",
    ".roo/rules-code/old.md",
    ".roorules-debug",
    ".continue/rules/old.md",
    ".aider.conf.yml",
    ".aider.tags.cache.v3"
  ];
  const stillActive = removedFromActiveSurface.filter((file) => fs.existsSync(path.join(root, file)));
  if (stillActive.length > 0) throw new Error(`Legacy files are still active:\n${stillActive.join("\n")}`);

  if (!fs.existsSync(path.join(root, ".github/workflows/ci.yml"))) {
    throw new Error("Unrelated GitHub workflow should not be moved to legacy");
  }

  const activeAgents = fs.readFileSync(path.join(root, "AGENTS.md"), "utf8");
  if (activeAgents.includes("legacy root instructions")) {
    throw new Error("Legacy AGENTS.md content leaked into active AGENTS.md");
  }
}

function verifyLocalOverrides(root) {
  const config = readJson(path.join(root, ".agents/knowledge.config.json"));
  const checks = [
    [config.project.localFlag === "keep-me", "project localFlag was not preserved"],
    [config.documents.defaultDirectories.includes("docs/custom"), "custom docs directory was not preserved"],
    [config.ignore.paths.includes("tmp-local/**"), "custom ignore path was not preserved"],
    [config.ignore.authoredDocs.includes("docs/private/**"), "custom ignored doc pattern was not preserved"],
    [fs.existsSync(path.join(root, "docs/custom/.gitkeep")), "custom docs directory was not preserved"],
    [fs.existsSync(path.join(root, ".agents/skills/local-reviewer/SKILL.md")), "custom skill was not preserved"],
    [fs.existsSync(path.join(root, ".agents/evals/skills/local-reviewer.eval.md")), "custom skill eval was not preserved"],
    [!fs.existsSync(path.join(root, ".agents/README.md")), "obsolete .agents/README.md was not removed"],
    [!fs.existsSync(path.join(root, "docs/generated")), "obsolete docs/generated was not removed"],
    [fs.existsSync(path.join(root, "legacy/.agents/README.md")), "obsolete .agents/README.md was not archived"],
    [fs.existsSync(path.join(root, "legacy/docs/generated/old-index.md")), "obsolete docs/generated was not archived"],
    [!fs.existsSync(path.join(root, "legacy/AGENTS.legacy-2.md")), "update archived AGENTS.md through a case-insensitive legacy alias"]
  ];

  const failed = checks.filter(([passed]) => !passed).map(([, message]) => message);
  if (failed.length > 0) throw new Error(failed.join("\n"));
}

function verifyLocalKnowledgeIndexed(root) {
  const llms = fs.readFileSync(path.join(root, "llms.txt"), "utf8");
  const map = fs.readFileSync(path.join(root, ".agents/generated/knowledge-map.md"), "utf8");
  const graph = readJson(path.join(root, ".agents/generated/knowledge-graph.json"));
  const graphNode = graph.nodes?.find((node) => node.id === "runbook.local-release");

  const checks = [
    [llms.includes("runbook.local-release"), "--skip-check update did not rebuild llms.txt"],
    [!llms.includes("project.index"), "obsolete docs/index.md stayed in llms.txt"],
    [!llms.includes("project.knowledge-system"), "obsolete docs/knowledge-system.md stayed in llms.txt"],
    [map.includes("runbook.local-release"), "--skip-check update did not rebuild knowledge map"],
    [!map.includes("project.index"), "obsolete docs/index.md stayed in knowledge map"],
    [!map.includes("project.knowledge-system"), "obsolete docs/knowledge-system.md stayed in knowledge map"],
    [Boolean(graphNode), "--skip-check update did not rebuild knowledge graph"],
    [graphNode?.path === "docs/custom/local-release.md", "knowledge graph node path is wrong"],
    [!fs.existsSync(path.join(root, "docs/index.md")), "obsolete docs/index.md was not removed from active docs"],
    [!fs.existsSync(path.join(root, "docs/knowledge-system.md")), "obsolete docs/knowledge-system.md was not removed from active docs"],
    [fs.existsSync(path.join(root, "legacy/docs/index.md")), "obsolete docs/index.md was not archived"],
    [fs.existsSync(path.join(root, "legacy/docs/knowledge-system.md")), "obsolete docs/knowledge-system.md was not archived"]
  ];

  const failed = checks.filter(([passed]) => !passed).map(([, message]) => message);
  if (failed.length > 0) throw new Error(failed.join("\n"));
}

function verifyFullUpdate(root) {
  const config = readJson(path.join(root, ".agents/knowledge.config.json"));
  const llms = fs.readFileSync(path.join(root, "llms.txt"), "utf8");
  const activeAgents = fs.readFileSync(path.join(root, "AGENTS.md"), "utf8");

  const checks = [
    [!config.project.localFlag, "full update preserved local project config"],
    [!config.documents.defaultDirectories.includes("docs/custom"), "full update preserved custom docs directory config"],
    [!config.ignore.paths.includes("tmp-local/**"), "full update preserved custom ignore path"],
    [!fs.existsSync(path.join(root, "docs/custom/local-release.md")), "full update left local docs active"],
    [!fs.existsSync(path.join(root, ".agents/skills/local-reviewer/SKILL.md")), "full update left local skill active"],
    [!llms.includes("runbook.local-release"), "full update left local doc in llms.txt"],
    [!activeAgents.includes("legacy root instructions"), "full update leaked legacy AGENTS content"],
    [fs.existsSync(path.join(root, "legacy/AGENTS.legacy-2.md")), "full update did not archive active AGENTS.md"],
    [fs.existsSync(path.join(root, "legacy/CLAUDE.legacy-2.md")), "full update did not archive active CLAUDE.md"],
    [fs.existsSync(path.join(root, "legacy/.agents.legacy-2/skills/local-reviewer/SKILL.md")), "full update did not archive active .agents"],
    [fs.existsSync(path.join(root, "legacy/docs.legacy-2/custom/local-release.md")), "full update did not archive active docs"],
    [fs.existsSync(path.join(root, "legacy/llms.txt")), "full update did not archive active llms.txt"]
  ];

  const failed = checks.filter(([passed]) => !passed).map(([, message]) => message);
  if (failed.length > 0) throw new Error(failed.join("\n"));
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeText(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value);
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}
