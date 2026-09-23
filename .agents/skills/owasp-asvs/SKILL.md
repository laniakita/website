---
name: owasp-asvs
description: Complete OWASP Application Security Verification Standard (ASVS) 5.0 — every chapter, section, and individual requirement (V1.1.1-style IDs) tagged with its minimum applicable level (L1/L2/L3). Use for security requirements planning before building a feature (auth, sessions, file handling, payments, APIs, etc.), secure design/architecture review, full codebase security audits, and scoped verification of a diff or PR against ASVS. Trigger even when the user doesn't say "ASVS" or "audit" explicitly — e.g. "what should I check before shipping password reset," "review this endpoint for security gaps," "is this session handling sound," "does this PR meet our security bar."
license: MIT
---

# OWASP ASVS

Complete ASVS 5.0 standard: 17 chapters, each requirement individually identified (e.g. `V2.1.1`) and tagged with the minimum level — L1, L2, or L3 — at which it's mandatory. Levels are cumulative: an L2 requirement also applies to L3 apps; an L1 requirement applies to all three.

Each `references/vN.md` file is a table with columns `section_id, section_name, req_id, req_description, L`. When you load one, filter mentally (or with `grep`/`awk` for large chapters) to rows where `L` is less than or equal to the target level — rows above it aren't in scope for this pass.

## Step 1: Determine the target level

Ask or infer from context before touching any reference file:
- **L1** — baseline, every application regardless of risk.
- **L2** — apps handling sensitive data (credentials, PII, payment/financial data) or where compromise has real business impact. Most production apps land here.
- **L3** — high-value targets where a breach has severe consequences.

Don't guess silently on this — it's the single decision that determines how much of the standard is actually in play, and getting it wrong either buries the user in irrelevant L3 requirements or waves through real gaps.

## Step 2: Scope which chapters apply

Not all 17 chapters are relevant to every app. Ask about or infer the architecture — client type, auth model (direct token vs. delegated OAuth/OIDC), whether it handles files/media, whether it does realtime communication — and mark out-of-scope chapters explicitly with a one-line reason rather than silently skipping or forcing a check that doesn't fit. A chapter or section can be marked N/A as a complete, legitimate answer.

## Step 3: Pick the workflow for the scenario

**Planning / designing** — feature doesn't exist yet, or an architecture decision is being made. Identify what's being built, map it to the relevant chapter(s)/section(s), and return the applicable-level requirements as a checklist to design against — framed as guidance, not findings. There's no code yet, so skip the evidence table in Step 4.

**Auditing** — retrospective review of an existing codebase or subsystem. Full scope-then-verify pass: work through the in-scope chapters from Step 2, and for every requirement at or below the target level, produce a row in the Step 4 table. Read the actual code; don't infer compliance from what "should" be there.

**Verifying** — a diff, PR, or single feature against ASVS. Same evidence discipline as auditing, but scoped to the chapters/sections the change actually touches — a PR touching authentication is V6 (and likely V7/V9), not a full V1–V17 pass.

## Step 4: Output format for audits and verification

| Req ID | Section | Requirement | Level | Status | Evidence | Notes |
|---|---|---|---|---|---|---|

- **Status**: Pass / Fail / Partial / N/A / Unable to verify.
- **Evidence**: a concrete file:line citation or the specific artifact checked. Never mark Pass because something is "standard practice" or "probably handled" — if it can't be pointed to, the status is Unable to verify, not Pass.
- **Notes**: remediation for Fail/Partial, or the reason for N/A.

## Navigation

| chapter name                        | requirements                       |
| ----------------------------------- | ---------------------------------- |
| Encoding and Sanitization           | [V1.1-V1.5](./references/v1.md)    |
| Validation and Business Logic       | [V2.1-V2.4](./references/v2.md)    |
| Web Frontend Security               | [V3.1-V3.7](./references/v3.md)    |
| API and Web Service                 | [V4.1-V4.4](./references/v4.md)    |
| File Handling                       | [V5.1-V5.4](./references/v5.md)    |
| Authentication                      | [V6.1-V6.8](./references/v6.md)    |
| Session Management                  | [V7.1-V7.6](./references/v7.md)    |
| Authorization                       | [V8.1-V8.4](./references/v8.md)    |
| Self-contained Tokens               | [V9.1-V9.2](./references/v9.md)    |
| OAuth and OIDC                      | [V10.1-V10.7](./references/v10.md) |
| Cryptography                        | [V11.1-V11.7](./references/v11.md) |
| Secure Communication                | [V12.1-V12.3](./references/v12.md) |
| Configuration                       | [V13.1-V13.4](./references/v13.md) |
| Data Protection                     | [V14.1-V14.3](./references/v14.md) |
| Secure Coding and Architecture      | [V15.1-V15.4](./references/v15.md) |
| Security Logging and Error Handling | [V16.1-V16.5](./references/v16.md) |
| WebRTC                              | [V17.1-V17.3](./references/v17.md) |