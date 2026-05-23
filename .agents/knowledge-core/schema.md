# Knowledge Document Schema

Every durable authored Markdown document should use frontmatter compatible with `schemas/document.schema.json`.

Required fields:
- `id`: stable lowercase identifier, unique across the repository.
- `type`: document category from `schemas/document.schema.json`.
- `status`: lifecycle status from `schemas/document.schema.json`.
- `owner`: owning domain, team, or project.
- `summary`: one-line description for generated indexes.
- `canonical_for`: topics this document owns.
- `last_reviewed`: ISO date.

Optional fields:
- `depends_on`: IDs or topics that must be understood first.
- `related`: IDs or topics that are useful but not prerequisites.
- `code_refs`: repository paths related to the document.
- `verified_by`: commands or checks that verify the document.
- `supersedes`: previous document IDs replaced by this document.
- `superseded_by`: replacement document ID when status is `superseded`.
- `source_refs`: external or internal sources used to create the document.
- `tags`: optional UI/search tags. Tags are not canonical ownership.
- `project`: project-local metadata escape hatch.

Generated files configured in `.agents/knowledge.config.json` are excluded from this authored-document contract.

## Identifier Rules

Use stable, lowercase, dot-separated identifiers:

```txt
architecture.runtime
decision.database-choice
runbook.deploy
```

Identifiers should not include spaces, underscores, dates, or file extensions.

Use `canonical_for` for topics, not prose titles. One topic should have one canonical owner.

## Type Rules

Document types:

- `overview`
- `domain`
- `architecture`
- `component`
- `database`
- `integration`
- `api`
- `workflow`
- `runbook`
- `decision`
- `research`
- `plan`
- `reference`
- `policy`
- `glossary`

## Status Rules

Statuses:

- `draft`: incomplete or unreviewed.
- `proposed`: proposed decision or policy.
- `active`: in-progress plan.
- `current`: current durable project knowledge.
- `accepted`: accepted decision or policy.
- `completed`: completed plan or research note.
- `deprecated`: retained but discouraged.
- `superseded`: replaced by another document and must set `superseded_by`.
- `archived`: retained for history only.

Decision documents should use `proposed`, `accepted`, `deprecated`, `superseded`, or `archived`.

Plan documents should use `draft`, `active`, `completed`, `superseded`, or `archived`.

Research documents should use `draft`, `completed`, `superseded`, or `archived`.

Policy documents should use `draft`, `proposed`, `current`, `accepted`, `deprecated`, `superseded`, or `archived`.

Runbook documents should use `draft`, `current`, `deprecated`, `superseded`, or `archived`.

Overview, domain, architecture, component, database, integration, API, workflow, reference, and glossary documents should use `draft`, `current`, `deprecated`, `superseded`, or `archived`.

## Path Rules

Use repository-relative paths in `code_refs`.

Do not use absolute paths or `..` path traversal.

## Extension Rules

Do not add arbitrary frontmatter keys. Use the `project` object for project-local metadata that is not part of the portable core.
