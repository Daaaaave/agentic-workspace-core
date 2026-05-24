import fs from "node:fs";
import path from "node:path";
import process from "node:process";

export const root = process.cwd();

export function abs(file) {
  return path.join(root, file);
}

export function readJson(file) {
  return JSON.parse(fs.readFileSync(abs(file), "utf8"));
}

export function exists(file) {
  return fs.existsSync(abs(file));
}

export function isDirectory(file) {
  try {
    return fs.statSync(abs(file)).isDirectory();
  } catch {
    return false;
  }
}

export function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function asArray(value) {
  return Array.isArray(value) ? value : [];
}

export function uniqueItems(values) {
  return new Set(values).size === values.length;
}

export function parseFrontmatter(file, options = {}) {
  const text = fs.readFileSync(abs(file), "utf8");
  const match = text.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
  if (!match) return null;

  const onError = options.onError || ((target, message) => {
    throw new Error(`${target}: ${message}`);
  });
  const data = {};
  let currentKey = null;
  let foldedKey = null;
  let foldedStyle = null;

  for (const rawLine of match[1].split("\n")) {
    const line = rawLine.replace(/\s+$/, "");
    if (line.trim() === "") {
      if (foldedKey && foldedStyle === "|") data[foldedKey] += "\n";
      continue;
    }

    const keyValue = line.match(/^([a-z_][a-z0-9_-]*):(?:\s*(.*))?$/);
    if (keyValue) {
      currentKey = keyValue[1];
      const value = keyValue[2] ?? "";
      foldedKey = null;
      foldedStyle = null;
      if (value === ">" || value === "|") {
        foldedKey = currentKey;
        foldedStyle = value;
        data[currentKey] = "";
      } else {
        data[currentKey] = value === "" ? [] : unquote(value);
      }
      continue;
    }

    const foldedLine = line.match(/^\s+(.+)$/);
    if (foldedLine && foldedKey) {
      const value = foldedLine[1].trim();
      data[foldedKey] = foldedStyle === "|"
        ? `${data[foldedKey]}${data[foldedKey] ? "\n" : ""}${value}`
        : `${data[foldedKey]}${data[foldedKey] ? " " : ""}${value}`;
      continue;
    }

    const arrayItem = line.match(/^\s+-\s+(.+)$/);
    if (arrayItem && currentKey) {
      if (!Array.isArray(data[currentKey])) {
        onError(file, `frontmatter key ${currentKey} mixes scalar and list values`);
        continue;
      }
      data[currentKey].push(unquote(arrayItem[1]));
      continue;
    }

    const objectItem = line.match(/^\s+([a-zA-Z0-9_.-]+):(?:\s*(.*))?$/);
    if (objectItem && currentKey) {
      if (Array.isArray(data[currentKey]) && data[currentKey].length === 0) {
        data[currentKey] = {};
      }
      if (!isPlainObject(data[currentKey])) {
        onError(file, `frontmatter key ${currentKey} mixes scalar and object values`);
        continue;
      }
      data[currentKey][objectItem[1]] = unquote(objectItem[2] ?? "");
      continue;
    }

    onError(file, `unsupported frontmatter syntax: ${line}`);
  }

  return data;
}

export function unquote(value) {
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

export function walk(dir, extensions, ignored = () => false) {
  const found = [];
  const start = abs(dir);
  if (!fs.existsSync(start)) return found;

  for (const entry of fs.readdirSync(start, { withFileTypes: true })) {
    const full = path.join(start, entry.name);
    const rel = path.relative(root, full).split(path.sep).join("/");
    if (ignored(rel)) continue;

    if (entry.isDirectory()) {
      found.push(...walk(rel, extensions, ignored));
      continue;
    }

    if (extensions.includes(path.extname(entry.name))) found.push(rel);
  }

  return found;
}

export function createIgnore(config) {
  const patterns = [...asArray(config.ignore?.paths), ...asArray(config.ignore?.authoredDocs)];

  return (file) => {
    let ignored = false;
    for (const pattern of patterns) {
      const negate = pattern.startsWith("!");
      const raw = negate ? pattern.slice(1) : pattern;
      if (matchesGlob(file, raw)) ignored = !negate;
    }
    return ignored;
  };
}

export function matchesGlob(file, pattern) {
  return globToRegExp(pattern).test(file);
}

function globToRegExp(pattern) {
  if (pattern.endsWith("/**")) {
    const prefix = pattern.slice(0, -3);
    return new RegExp(`^${globBodyToRegExp(prefix)}(?:/.*)?$`);
  }
  return new RegExp(`^${globBodyToRegExp(pattern)}$`);
}

function globBodyToRegExp(pattern) {
  let out = "";
  for (let i = 0; i < pattern.length; i += 1) {
    const char = pattern[i];
    if (char === "*") {
      if (pattern[i + 1] === "*") {
        if (pattern[i + 2] === "/") {
          out += "(?:.*/)?";
          i += 2;
        } else {
          out += ".*";
          i += 1;
        }
      } else {
        out += "[^/]*";
      }
      continue;
    }
    if (char === "?") {
      out += "[^/]";
      continue;
    }
    out += escapeRegExp(char);
  }
  return out;
}

function escapeRegExp(char) {
  return char.replace(/[|\\{}()[\]^$+?.]/g, "\\$&");
}

export function collectDocuments(config, options = {}) {
  const ignored = createIgnore(config);
  const docsRoot = config.paths?.docsRoot || "docs";
  const extensions = config.documents?.authoredExtensions || [".md"];
  const files = walk(docsRoot, extensions, ignored);

  return files
    .map((file) => ({
      file,
      frontmatter: parseFrontmatter(file, options.parseFrontmatter || {})
    }))
    .filter((doc) => options.includeMissingFrontmatter || doc.frontmatter)
    .sort((a, b) => {
      const aId = docSortKey(a);
      const bId = docSortKey(b);
      return aId.localeCompare(bId);
    });
}

function docSortKey(doc) {
  return doc.frontmatter?.id || doc.file;
}
