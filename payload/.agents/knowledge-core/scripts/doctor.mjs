#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import {
  abs,
  asArray,
  collectDocuments,
  exists,
  isDirectory,
  isPlainObject,
  parseFrontmatter,
  uniqueItems
} from "./lib/core.mjs";

const configPath = ".agents/knowledge.config.json";
const manifestPath = ".agents/knowledge-core/manifest.json";

const errors = [];
const warnings = [];

const STATUS_BY_TYPE = {
  overview: ["draft", "current", "deprecated", "superseded", "archived"],
  domain: ["draft", "current", "deprecated", "superseded", "archived"],
  architecture: ["draft", "current", "deprecated", "superseded", "archived"],
  component: ["draft", "current", "deprecated", "superseded", "archived"],
  database: ["draft", "current", "deprecated", "superseded", "archived"],
  integration: ["draft", "current", "deprecated", "superseded", "archived"],
  api: ["draft", "current", "deprecated", "superseded", "archived"],
  workflow: ["draft", "current", "deprecated", "superseded", "archived"],
  runbook: ["draft", "current", "deprecated", "superseded", "archived"],
  decision: ["proposed", "accepted", "deprecated", "superseded", "archived"],
  research: ["draft", "completed", "superseded", "archived"],
  plan: ["draft", "active", "completed", "superseded", "archived"],
  reference: ["draft", "current", "deprecated", "superseded", "archived"],
  policy: ["draft", "proposed", "current", "accepted", "deprecated", "superseded", "archived"],
  glossary: ["draft", "current", "deprecated", "superseded", "archived"]
};

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(abs(file), "utf8"));
  } catch (error) {
    fail(file, `invalid JSON: ${error.message}`);
    return null;
  }
}

function fail(file, message) {
  errors.push({ file, message });
}

function warn(file, message) {
  warnings.push({ file, message });
}

function validateRelativePath(file, label) {
  if (typeof file !== "string" || file.length === 0) {
    fail(configPath, `${label} must be a non-empty string`);
    return;
  }
  if (path.isAbsolute(file) || file.split("/").includes("..")) {
    fail(configPath, `${label} must be a repository-relative path: ${file}`);
  }
}

function validateConfigShape(config) {
  if (!config) return;

  const allowedTop = new Set([
    "$schema",
    "schemaVersion",
    "core",
    "entrypoints",
    "paths",
    "documents",
    "skills",
    "ignore",
    "generated",
    "validation",
    "policy",
    "project"
  ]);

  for (const key of Object.keys(config)) {
    if (!allowedTop.has(key)) fail(configPath, `unknown top-level key: ${key}`);
  }

  for (const key of ["schemaVersion", "core", "entrypoints", "paths", "documents", "skills", "ignore", "generated", "validation", "policy", "project"]) {
    if (!(key in config)) fail(configPath, `missing required key: ${key}`);
  }

  if (!isPlainObject(config.core)) fail(configPath, "core must be an object");
  if (!isPlainObject(config.entrypoints)) fail(configPath, "entrypoints must be an object");
  if (!isPlainObject(config.paths)) fail(configPath, "paths must be an object");
  if (!isPlainObject(config.documents)) fail(configPath, "documents must be an object");
  if (!isPlainObject(config.skills)) fail(configPath, "skills must be an object");
  if (!isPlainObject(config.ignore)) fail(configPath, "ignore must be an object");
  if (!isPlainObject(config.generated)) fail(configPath, "generated must be an object");
  if (!isPlainObject(config.validation)) fail(configPath, "validation must be an object");
  if (!isPlainObject(config.policy)) fail(configPath, "policy must be an object");
  if (!isPlainObject(config.project)) fail(configPath, "project must be an object");

  if (isPlainObject(config.entrypoints)) {
    for (const key of ["agentInstructions", "knowledgeIndex", "humanKnowledgeHome"]) {
      validateRelativePath(config.entrypoints[key], `entrypoints.${key}`);
    }
  }

  if (isPlainObject(config.paths)) {
    for (const key of ["docsRoot", "generatedRoot", "handoffsRoot", "skillsRoot", "evalsRoot", "coreRoot"]) {
      validateRelativePath(config.paths[key], `paths.${key}`);
    }
  }

  if (isPlainObject(config.documents)) {
    validateRelativePath(config.documents.frontmatterSchema, "documents.frontmatterSchema");
    if (!Array.isArray(config.documents.authoredExtensions) || config.documents.authoredExtensions.length === 0) {
      fail(configPath, "documents.authoredExtensions must be a non-empty array");
    }
    for (const extension of asArray(config.documents.authoredExtensions)) {
      if (!/^\.[a-z0-9]+$/.test(extension)) {
        fail(configPath, `invalid authored extension: ${extension}`);
      }
    }
    if (!Array.isArray(config.documents.defaultDirectories)) {
      fail(configPath, "documents.defaultDirectories must be an array");
    }
    for (const dir of asArray(config.documents.defaultDirectories)) {
      validateRelativePath(dir, "documents.defaultDirectories[]");
    }
  }

  if (isPlainObject(config.skills)) {
    validateRelativePath(config.skills.frontmatterSchema, "skills.frontmatterSchema");
    for (const key of ["requireEvalForConcreteSkills", "allowAllowedToolsByDefault"]) {
      if (typeof config.skills[key] !== "boolean") fail(configPath, `skills.${key} must be a boolean`);
    }
  }

  if (isPlainObject(config.generated)) {
    for (const key of ["llmsTxt", "knowledgeMap", "knowledgeGraph"]) {
      validateRelativePath(config.generated[key], `generated.${key}`);
    }
  }
}

function validateCorePaths(config, manifest) {
  if (!config || !manifest) return;

  if (config.schemaVersion !== manifest.schemaVersion) {
    fail(configPath, `schemaVersion must match manifest: ${manifest.schemaVersion}`);
  }
  if (config.core?.name !== manifest.name) {
    fail(configPath, `core.name must match manifest name: ${manifest.name}`);
  }
  if (config.core?.version !== manifest.version) {
    fail(configPath, `core.version must match manifest version: ${manifest.version}`);
  }

  const expectedEntrypoints = {
    agentInstructions: manifest.entrypoints?.agentInstructions,
    knowledgeIndex: manifest.entrypoints?.knowledgeIndex,
    humanKnowledgeHome: manifest.entrypoints?.humanKnowledgeHome
  };
  for (const [name, expected] of Object.entries(expectedEntrypoints)) {
    if (expected && config.entrypoints?.[name] !== expected) {
      fail(configPath, `entrypoints.${name} must match manifest: ${expected}`);
    }
  }

  const expectedPaths = {
    docsRoot: manifest.canonicalPaths?.docs,
    generatedRoot: manifest.canonicalPaths?.generatedDocs,
    handoffsRoot: manifest.canonicalPaths?.handoffs,
    skillsRoot: manifest.canonicalPaths?.skills,
    evalsRoot: manifest.canonicalPaths?.evals,
    coreRoot: manifest.canonicalPaths?.core
  };
  for (const [name, expected] of Object.entries(expectedPaths)) {
    if (expected && config.paths?.[name] !== expected) {
      fail(configPath, `paths.${name} must match manifest: ${expected}`);
    }
  }

  for (const [name, expected] of Object.entries(manifest.generatedOutputs || {})) {
    if (config.generated?.[name] !== expected) {
      fail(configPath, `generated.${name} must match manifest: ${expected}`);
    }
  }
  if (config.entrypoints?.knowledgeIndex !== config.generated?.llmsTxt) {
    fail(configPath, "entrypoints.knowledgeIndex must match generated.llmsTxt");
  }
  for (const key of ["knowledgeMap", "knowledgeGraph"]) {
    const generatedFile = config.generated?.[key];
    if (generatedFile && !isInsideOrEqual(generatedFile, config.paths?.generatedRoot)) {
      fail(configPath, `generated.${key} must be under paths.generatedRoot`);
    }
  }

  for (const [name, file] of Object.entries(manifest.entrypoints || {})) {
    if (!exists(file)) fail(manifestPath, `missing entrypoint ${name}: ${file}`);
  }
  validateInstructionProxies(manifest);
  validateLocalIgnorePolicy(manifest);

  for (const [name, file] of Object.entries(manifest.canonicalPaths || {})) {
    if (name === "handoffs") continue;
    if (!exists(file)) fail(manifestPath, `missing canonical path ${name}: ${file}`);
  }

  for (const [name, file] of Object.entries(manifest.generatedOutputs || {})) {
    if (!exists(file)) fail(manifestPath, `missing generated output ${name}: ${file}`);
  }

  for (const dir of asArray(config.documents?.defaultDirectories)) {
    if (!isDirectory(dir)) fail(configPath, `missing default docs directory: ${dir}`);
  }

  for (const template of asArray(manifest.requiredTemplates)) {
    const file = path.posix.join(config.paths.coreRoot, "templates", template);
    if (!exists(file)) fail(manifestPath, `missing template: ${file}`);
  }

  for (const template of asArray(manifest.starterTemplates)) {
    const file = path.posix.join(config.paths.coreRoot, "templates", template);
    if (!exists(file)) fail(manifestPath, `missing starter template: ${file}`);
  }

  for (const script of asArray(manifest.requiredScripts)) {
    const file = path.posix.join(config.paths.coreRoot, "scripts", script);
    if (!exists(file)) fail(manifestPath, `missing script: ${file}`);
  }
}

function isInsideOrEqual(file, dir) {
  if (!file || !dir) return false;
  return file === dir || file.startsWith(`${dir}/`);
}

function validateInstructionProxies(manifest) {
  const agentInstructions = manifest.entrypoints?.agentInstructions;
  const claudeInstructions = manifest.entrypoints?.claudeInstructions;
  if (!agentInstructions || !claudeInstructions || !exists(claudeInstructions)) return;

  const text = fs.readFileSync(abs(claudeInstructions), "utf8");
  const firstDirective = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line.length > 0 && !line.startsWith("<!--"));

  if (firstDirective !== `@${agentInstructions}`) {
    fail(claudeInstructions, `Claude proxy must start by importing ${agentInstructions}`);
  }
}

function validateLocalIgnorePolicy(manifest) {
  const requiredIgnores = [".context/", "legacy/"];
  if (manifest.entrypoints?.claudeInstructions) requiredIgnores.push("CLAUDE.local.md");

  const gitignore = ".gitignore";
  if (!exists(gitignore)) {
    warn(".gitignore", `missing ${requiredIgnores.join(", ")} ignore rules`);
    return;
  }

  const lines = fs.readFileSync(abs(gitignore), "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim());

  if (!lines.includes(".context/") && !lines.includes(".context/**")) {
    warn(gitignore, "missing .context/ ignore rule");
  }
  if (!lines.includes("legacy/") && !lines.includes("legacy/**")) {
    warn(gitignore, "missing legacy/ ignore rule");
  }
  if (manifest.entrypoints?.claudeInstructions && !lines.includes("CLAUDE.local.md")) {
    warn(gitignore, "missing CLAUDE.local.md ignore rule");
  }
}

function validateFrontmatter(file, frontmatter, schema) {
  if (!frontmatter) {
    fail(file, "missing frontmatter");
    return;
  }

  const allowedKeys = new Set(Object.keys(schema.properties || {}));
  const requiredKeys = schema.required || [];
  const identifier = new RegExp(schema.$defs.identifier.pattern);
  const repositoryPath = new RegExp(schema.$defs.repositoryPath.pattern);
  const tagPattern = new RegExp(schema.$defs.tag.pattern);
  const allowedTypes = new Set(schema.$defs.documentType.enum);
  const allowedStatuses = new Set(schema.$defs.status.enum);

  for (const key of Object.keys(frontmatter)) {
    if (!allowedKeys.has(key)) fail(file, `unknown frontmatter key: ${key}`);
  }

  for (const key of requiredKeys) {
    if (!(key in frontmatter)) fail(file, `missing required frontmatter key: ${key}`);
  }

  checkIdentifier(file, "id", frontmatter.id, identifier);
  checkIdentifier(file, "owner", frontmatter.owner, identifier);

  if (frontmatter.type && !allowedTypes.has(frontmatter.type)) fail(file, `invalid type: ${frontmatter.type}`);
  if (frontmatter.status && !allowedStatuses.has(frontmatter.status)) fail(file, `invalid status: ${frontmatter.status}`);

  if (typeof frontmatter.summary !== "string" || frontmatter.summary.length === 0 || frontmatter.summary.length > 280) {
    fail(file, "summary must be 1-280 characters");
  }

  for (const key of ["canonical_for", "depends_on", "related", "supersedes"]) {
    checkIdentifierArray(file, key, frontmatter[key], identifier, key === "canonical_for");
  }

  if (frontmatter.superseded_by) checkIdentifier(file, "superseded_by", frontmatter.superseded_by, identifier);

  for (const key of ["code_refs", "verified_by", "source_refs", "tags"]) {
    if (frontmatter[key] !== undefined && !Array.isArray(frontmatter[key])) fail(file, `${key} must be an array`);
    if (Array.isArray(frontmatter[key]) && !uniqueItems(frontmatter[key])) fail(file, `${key} must not contain duplicates`);
  }

  for (const ref of asArray(frontmatter.code_refs)) {
    if (!repositoryPath.test(ref)) fail(file, `invalid code_ref: ${ref}`);
    else if (!exists(ref)) fail(file, `code_ref does not exist: ${ref}`);
  }

  for (const tag of asArray(frontmatter.tags)) {
    if (!tagPattern.test(tag)) fail(file, `invalid tag: ${tag}`);
  }

  if (frontmatter.status === "superseded" && !frontmatter.superseded_by) {
    fail(file, "superseded documents must set superseded_by");
  }
  if (frontmatter.superseded_by && frontmatter.status !== "superseded") {
    fail(file, "documents with superseded_by must use status: superseded");
  }

  const statusesForType = STATUS_BY_TYPE[frontmatter.type];
  if (statusesForType && frontmatter.status && !statusesForType.includes(frontmatter.status)) {
    fail(file, `${frontmatter.type} documents cannot use status: ${frontmatter.status}`);
  }

  if (frontmatter.project !== undefined && !isPlainObject(frontmatter.project)) {
    fail(file, "project must be an object");
  }
}

function validateSkills(config, schema) {
  if (!config || !schema) return 0;

  const skillsRoot = config.paths?.skillsRoot || ".agents/skills";
  const evalsRoot = path.posix.join(config.paths?.evalsRoot || ".agents/evals", "skills");
  if (!isDirectory(skillsRoot)) {
    fail(configPath, `missing skills directory: ${skillsRoot}`);
    return 0;
  }

  const skillNamePattern = new RegExp(schema.properties?.name?.pattern || "^[a-z0-9]+(-[a-z0-9]+)*$");
  const concreteSkills = new Set();
  let count = 0;

  for (const entry of fs.readdirSync(abs(skillsRoot), { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;

    const skillDir = path.posix.join(skillsRoot, entry.name);
    if (!entry.isDirectory()) {
      fail(skillDir, "skills root may contain only skill directories and dotfiles");
      continue;
    }

    concreteSkills.add(entry.name);
    count += 1;

    if (!skillNamePattern.test(entry.name)) {
      fail(skillDir, "skill directory must be lowercase kebab-case");
    }

    const skillFile = path.posix.join(skillDir, "SKILL.md");
    if (!exists(skillFile)) {
      fail(skillDir, "missing SKILL.md");
      continue;
    }

    const skillText = fs.readFileSync(abs(skillFile), "utf8");
    validateSkillDirectoryShape(skillDir, skillText);
    validateSkillFrontmatter(skillFile, parseFrontmatter(skillFile, { onError: fail }), schema, entry.name, config);

    if (config.skills?.requireEvalForConcreteSkills) {
      const evalFile = path.posix.join(evalsRoot, `${entry.name}.eval.md`);
      if (!exists(evalFile)) fail(skillFile, `missing skill eval: ${evalFile}`);
    }
  }

  validateOrphanSkillEvals(evalsRoot, concreteSkills);
  return count;
}

function validateSkillDirectoryShape(skillDir, skillText) {
  const allowedEntries = new Set(["SKILL.md", "references", "scripts", "assets", "agents"]);
  const optionalDirectories = new Set(["references", "scripts", "assets", "agents"]);
  const discouragedDocs = new Set(["README.md", "CHANGELOG.md", "INSTALLATION_GUIDE.md", "QUICK_REFERENCE.md"]);

  for (const entry of fs.readdirSync(abs(skillDir), { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const file = path.posix.join(skillDir, entry.name);
    if (entry.isSymbolicLink()) {
      fail(file, "skill entries must not be symlinks");
      continue;
    }
    if (discouragedDocs.has(entry.name)) {
      fail(file, "extra documentation belongs in SKILL.md or references/");
      continue;
    }
    if (!allowedEntries.has(entry.name)) {
      warn(file, "unexpected skill entry; keep skills small and predictable");
      continue;
    }
    if (optionalDirectories.has(entry.name)) {
      if (!entry.isDirectory()) {
        fail(file, `${entry.name} must be a directory`);
        continue;
      }
      const visibleEntries = fs.readdirSync(abs(file)).filter((name) => !name.startsWith("."));
      if (visibleEntries.length === 0) {
        fail(file, `${entry.name}/ must not be empty`);
      }
      if (!skillText.includes(`${entry.name}/`)) {
        fail(file, `${entry.name}/ must be explicitly routed from SKILL.md`);
      }
    }
  }
}

function validateSkillFrontmatter(file, frontmatter, schema, expectedName, config) {
  if (!frontmatter) {
    fail(file, "missing frontmatter");
    return;
  }

  const text = fs.readFileSync(abs(file), "utf8");
  const body = text.replace(/^---\n[\s\S]*?\n---(?:\n|$)/, "").trim();
  if (!body) fail(file, "SKILL.md must include Markdown instructions after frontmatter");

  const allowedKeys = new Set(Object.keys(schema.properties || {}));
  const requiredKeys = schema.required || [];
  const namePattern = new RegExp(schema.properties?.name?.pattern || "^[a-z0-9]+(-[a-z0-9]+)*$");

  for (const key of Object.keys(frontmatter)) {
    if (!allowedKeys.has(key)) fail(file, `unknown frontmatter key: ${key}`);
  }

  for (const key of requiredKeys) {
    if (!(key in frontmatter)) fail(file, `missing required frontmatter key: ${key}`);
  }

  if (typeof frontmatter.name !== "string" || !namePattern.test(frontmatter.name)) {
    fail(file, `invalid name: ${frontmatter.name}`);
  } else if (frontmatter.name !== expectedName) {
    fail(file, `name must match directory: ${expectedName}`);
  }

  checkStringLength(file, "description", frontmatter.description, 1, 1024);
  if (frontmatter.license !== undefined) checkStringLength(file, "license", frontmatter.license, 1, 120);
  if (frontmatter.compatibility !== undefined) checkStringLength(file, "compatibility", frontmatter.compatibility, 1, 500);
  if (frontmatter["allowed-tools"] !== undefined) {
    checkStringLength(file, "allowed-tools", frontmatter["allowed-tools"], 1, 500);
    if (config.skills?.allowAllowedToolsByDefault === false) {
      fail(file, "allowed-tools is disabled by default; audit the skill and opt in via knowledge.config.json");
    }
  }

  if (frontmatter.metadata !== undefined) {
    if (!isPlainObject(frontmatter.metadata)) {
      fail(file, "metadata must be an object");
    } else {
      for (const [key, value] of Object.entries(frontmatter.metadata)) {
        if (typeof value !== "string") fail(file, `metadata.${key} must be a string`);
      }
    }
  }
}

function checkStringLength(file, key, value, min, max) {
  if (typeof value !== "string" || value.length < min || value.length > max) {
    fail(file, `${key} must be ${min}-${max} characters`);
  }
}

function validateOrphanSkillEvals(evalsRoot, concreteSkills) {
  if (!isDirectory(evalsRoot)) return;

  for (const entry of fs.readdirSync(abs(evalsRoot), { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const file = path.posix.join(evalsRoot, entry.name);
    if (!entry.isFile() || !entry.name.endsWith(".eval.md")) {
      warn(file, "unexpected skill eval entry");
      continue;
    }
    const skillName = entry.name.replace(/\.eval\.md$/, "");
    if (!concreteSkills.has(skillName)) warn(file, `eval has no matching skill: ${skillName}`);
    else validateSkillEval(file);
  }
}

function validateSkillEval(file) {
  const text = fs.readFileSync(abs(file), "utf8");
  for (const heading of ["## Should Trigger", "## Should Not Trigger", "## Edge Cases"]) {
    const section = extractHeadingSection(text, heading);
    if (!section) {
      fail(file, `missing eval section: ${heading}`);
      continue;
    }
    if (!/\|\s*Prompt\s*\|\s*Expected Behavior\s*\|/.test(section)) {
      fail(file, `${heading} must include a Prompt / Expected Behavior table`);
    }
    const rowCount = countEvalRows(section);
    if (rowCount < 1) fail(file, `${heading} must include at least one concrete prompt row`);
  }
}

function extractHeadingSection(text, heading) {
  const start = text.indexOf(heading);
  if (start === -1) return null;
  const rest = text.slice(start + heading.length);
  const next = rest.search(/\n## /);
  return next === -1 ? rest : rest.slice(0, next);
}

function countEvalRows(section) {
  return section
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|"))
    .filter((line) => !/^\|\s*-+\s*\|/.test(line))
    .filter((line) => !/^\|\s*Prompt\s*\|/i.test(line))
    .length;
}

function checkIdentifier(file, key, value, pattern) {
  if (typeof value !== "string" || !pattern.test(value)) fail(file, `invalid ${key}: ${value}`);
}

function checkIdentifierArray(file, key, value, pattern, required) {
  if (value === undefined) {
    if (required) fail(file, `${key} is required`);
    return;
  }
  if (!Array.isArray(value)) {
    fail(file, `${key} must be an array`);
    return;
  }
  if (required && value.length === 0) fail(file, `${key} must not be empty`);
  if (!uniqueItems(value)) fail(file, `${key} must not contain duplicates`);
  for (const item of value) {
    if (!pattern.test(item)) fail(file, `invalid ${key} item: ${item}`);
  }
}

function validateKnowledgeGraph(docs, config, schema) {
  const ids = new Map();
  const topics = new Map();
  const allKnown = new Set();

  for (const doc of docs) {
    const id = doc.frontmatter?.id;
    if (id) {
      allKnown.add(id);
      if (ids.has(id)) fail(doc.file, `duplicate id also used by ${ids.get(id)}`);
      else ids.set(id, doc.file);
    }

    for (const topic of asArray(doc.frontmatter?.canonical_for)) {
      allKnown.add(topic);
      if (topics.has(topic)) fail(doc.file, `duplicate canonical topic ${topic} also owned by ${topics.get(topic)}`);
      else topics.set(topic, doc.file);
    }
  }

  for (const doc of docs) {
    const fields = ["depends_on", "related", "supersedes"];
    for (const field of fields) {
      for (const ref of asArray(doc.frontmatter?.[field])) {
        if (!allKnown.has(ref)) warn(doc.file, `${field} references unknown id/topic: ${ref}`);
      }
    }
    const supersededBy = doc.frontmatter?.superseded_by;
    if (supersededBy && !allKnown.has(supersededBy)) warn(doc.file, `superseded_by references unknown id/topic: ${supersededBy}`);
  }

  if (config.validation?.warnOnStaleDocuments) {
    const now = new Date();
    const staleAfterDays = config.policy?.staleAfterDays ?? 180;
    for (const doc of docs) {
      const reviewed = doc.frontmatter?.last_reviewed;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(reviewed || "")) continue;
      const ageDays = Math.floor((now - new Date(`${reviewed}T00:00:00Z`)) / 86400000);
      if (ageDays > staleAfterDays) warn(doc.file, `last_reviewed is stale by ${ageDays - staleAfterDays} days`);
    }
  }
}

function main() {
  const config = readJson(configPath);
  const manifest = readJson(manifestPath);
  validateConfigShape(config);
  validateCorePaths(config, manifest);

  const documentSchemaPath = config?.documents?.frontmatterSchema;
  const documentSchema = documentSchemaPath ? readJson(documentSchemaPath) : null;
  const skillSchemaPath = config?.skills?.frontmatterSchema;
  const skillSchema = skillSchemaPath ? readJson(skillSchemaPath) : null;

  const docs = collectDocuments(config || {}, {
    includeMissingFrontmatter: true,
    parseFrontmatter: { onError: fail }
  });

  for (const { file, frontmatter } of docs) {
    if (documentSchema) validateFrontmatter(file, frontmatter, documentSchema);
  }

  if (documentSchema) validateKnowledgeGraph(docs, config || {}, documentSchema);
  const skillCount = validateSkills(config || {}, skillSchema);

  for (const { file, message } of warnings) {
    console.warn(`WARN ${file}: ${message}`);
  }

  if (errors.length > 0) {
    for (const { file, message } of errors) {
      console.error(`ERROR ${file}: ${message}`);
    }
    console.error(`Knowledge doctor failed: ${errors.length} error(s), ${warnings.length} warning(s).`);
    process.exit(1);
  }

  console.log(`Knowledge doctor passed: ${docs.length} authored document(s), ${skillCount} skill(s), ${warnings.length} warning(s).`);
}

main();
