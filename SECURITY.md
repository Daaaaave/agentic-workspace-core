# Security Policy

Agentic Workspace Core treats persistent memory as privileged input. A malicious or stale memory write can influence future agents, so reports about memory poisoning, prompt injection persistence, unsafe skill behavior, or adapter trust boundaries are security-relevant.

## Supported Versions

The supported release line is `0.1.x`, plus the latest `main` branch in the public GitHub repository.
Security fixes ship as npm patch releases when they affect the published package.

## Reporting

For non-sensitive reports, open a GitHub issue at <https://github.com/Daaaaave/agentic-workspace-core/issues>.
For sensitive reports, contact the repository owner privately first and do not publish exploit details until the affected behavior has been reviewed and patched.

## Security Scope

Security-sensitive areas include:

- memory write, correction, deletion, and consolidation policy
- generated index trust boundaries
- skill routing and tool permission metadata
- bundled scripts under `.agents/knowledge-core/scripts/`
- adapter contracts for Obsidian, vector search, MCP, graph stores, or databases
- handling of secrets, private data, prompt injections, logs, transcripts, and external content

## Design Expectations

- No hidden shared memory.
- No generated or external content may silently become policy.
- No skill may pre-approve tools without explicit audit and config opt-in.
- Runtime state belongs in `.context/` and must not be treated as durable project knowledge.
- Unsafe memory should be rejected, redacted, quarantined, or deleted depending on risk.
