# Security Policy

Agentic Workspace Core treats persistent memory as privileged input. A malicious or stale memory write can influence future agents, so reports about memory poisoning, prompt injection persistence, unsafe skill behavior, or adapter trust boundaries are security-relevant.

## Supported Versions

The project is pre-public and currently supports only the latest `main` branch.

## Reporting

While the repository is private, report issues directly to the repository owner. Do not publish exploit details until the affected behavior has been reviewed and patched.

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
