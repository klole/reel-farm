# 04 — Security, privacy, installation, and operations

**Status:** proposed requirements. None of these controls is claimed implemented or audited.  
**Parent:** [North Star](../NORTH_STAR.md)

The principal risks are provider-key theft, unauthorized publication, unexpected charges, private-media disclosure, unsafe URL/file handling, lost content, duplicate side effects after recovery, and an installation that appears healthy while its worker has stopped. Security work is part of the normal workflow, not a final cosmetic checklist.

## 1. Deployment and threat boundary

### SEC-001 — Private by default

The initial application is for a private operator installation. Bind the default web port to loopback where practical; do not expose PostgreSQL or the worker publicly. A server deployment requires HTTPS, a supported reverse proxy, authentication, and deliberate exposure of only the web surface.

“Self-hosted” does not mean “no authentication needed.” Local applications can be reached by other software, hostile web pages, or unintended network binding. Apply origin/host validation and CSRF protection to state-changing browser requests. No public default owner password is acceptable.

A person with root/container-host access can usually access runtime secrets or application data. Encryption at rest helps against narrower threats such as a database-only leak; it does not protect against a fully compromised host. Document that boundary honestly.

### SEC-002 — Bootstrap and session security

Create the initial owner through a one-time random setup token or equivalent supported secure mechanism. Expire it after use, avoid writing it to public logs, and prevent a remote attacker from racing to become owner. Use a maintained authentication/password-hashing implementation rather than custom cryptography.

Sessions need appropriate cookie attributes, expiration, logout/revocation, and rate limiting. Development bypasses must fail closed in production configuration. A health endpoint should disclose only operational status appropriate for its access level.

When a server operator wants SSO later, introduce it through an explicit chapter with account-linking and authorization tests. Do not add several identity providers merely because they appear on a UI template.

### SEC-003 — Resource authorization is server-enforced

Every project, asset, thumbnail, job, render, account, approval, publication, and export request checks ownership and permissions. Guessing a UUID or possessing a storage path must not bypass access checks. Restrict service-level credentials to the components that need them.

Even in the one-owner release, implement domain ownership consistently. Later collaboration must not depend on hiding buttons. Editors should not read keys, and a scoped automation token should not gain approval authority through an alternate endpoint.

## 2. Secrets and provider data

### SEC-004 — BYOK secret storage

Use a maintained authenticated-encryption primitive for stored keys, with a randomly generated master key held separately from database records. Include a key version, unique nonce, and authenticated context such as credential/workspace identity. Use established libraries; do not invent a cipher or reuse nonces.

An environment/secret-file reference is an acceptable advanced alternative. The normal UI may accept a key over the authenticated server connection, store its encrypted value, and return only metadata such as provider, status, and masked suffix. Do not provide a routine “show me the original key” API.

Keys must not appear in `NEXT_PUBLIC_*` variables, JavaScript bundles, browser localStorage, HTML, URL parameters, exported projects, Git commits, CI logs, screenshots, analytics, or generated support bundles. Secret scanning and browser-network inspection are required acceptance evidence.

### SEC-005 — Rotation, removal, and incomplete work

A user can replace or remove a provider credential. Rotating a key invalidates cached health information and prompts a harmless recheck. Running jobs retain the external request IDs needed for reconciliation, but do not keep unencrypted old secrets indefinitely.

If an old key is needed to retrieve an already accepted job and has been revoked, report that condition and preserve local work. Do not generate again with the new key as an automatic substitute. Removing a publishing key blocks new submissions but may not cancel remote schedules; show the distinction and provide a provider-dashboard recovery path.

### SEC-006 — Minimize external disclosure

Provider operations should transmit only the selected brief fields, references, and media needed for that task. A project containing private product imagery is not blanket consent to send the entire library to a model. Setup and action previews identify the external services involved.

Prompt and source-text retention is configurable. Store enough version/provenance metadata to explain an output without retaining unnecessary sensitive content. Do not claim a vendor stores no data based solely on broad marketing language. Review the actual selected service/model terms and retention controls before describing a sensitive-use mode as supported.

## 3. Untrusted content and media safety

### SEC-007 — Controlled outbound URL fetching

All remote imports pass through a controlled fetcher. Restrict schemes, reject credentials in URLs, block loopback/private/link-local and cloud metadata destinations, validate IPv4 and IPv6, bound redirects, and revalidate redirect targets. DNS resolution must be handled in a way that does not allow validation of one address followed by a connection to a different private address. An allowlist for known provider CDNs can narrow exposure, but cannot replace content validation.

Never forward a provider API key to an arbitrary media host or to a presigned storage PUT. Use endpoint-specific authentication and a minimal header allowlist. Signed URLs are sensitive capability-bearing data and should be redacted from logs.

OWASP's SSRF guidance is the reference for the threat category and defensive review; the exact implementation must be tested in the chosen runtime. [S26](08_SOURCES.md#s26)

### SEC-008 — Safe file acceptance

Bound request size, streaming download bytes, decoded image dimensions, frame count where applicable, extraction size, and processing time. Check actual file signatures/content rather than trusting filename extensions or response headers. Reject malformed images and unsupported formats with a useful error.

Normalize orientation and remove unnecessary private metadata from public/export derivatives while retaining appropriate source provenance locally. Originals may contain sensitive EXIF; the export policy must state what is preserved or stripped. Generated storage names and safe path joining prevent path traversal.

For project/recipe ZIP import, block absolute paths, `..` traversal, symlink escapes, zip bombs, unsupported schema versions, duplicate ambiguous paths, and unexpected executable content. Import into staging and validate before promotion.

### SEC-009 — Renderer containment

The browser renderer only processes trusted component code and validated declarative data. User text is escaped. Templates cannot supply scripts, arbitrary HTML, external stylesheets, runtime plugins, or filesystem reads. Font and image inputs are pinned/approved assets.

Run the browser with a supported sandbox configuration and minimal privileges where the deployment permits; do not casually disable sandboxing to make a container demo pass. Deny unnecessary network access and avoid passing provider credentials into the render subprocess. Apply time/memory limits and terminate hung rendering safely.

A render failure produces an error artifact/event, not a partially empty approved deck. Test malicious strings, oversized layouts, missing fonts, and unexpected remote references before importing community templates is supported.

### SEC-010 — Prompt injection and generated-output limits

Treat Pin descriptions, source pages, uploaded briefs, and model output as data. They cannot change system instructions, access credentials, call tools, change budgets, or authorize publishing. Use structured prompt composition with clearly separated trusted instructions and untrusted content.

Validate generated JSON against a strict schema and enforce field/slide counts, locked content, and prohibited actions server-side. A generated caption that says “approved” does not create an approval record. A model-generated URL does not automatically become an import destination.

## 4. Publishing and cost safety

### SEC-011 — Authorized side effects

Publishing, paid inference, account disconnection, remote cancellation, destructive data actions, and credential changes require appropriate authority and clear UI consequences. Read-only views do not trigger billable generation or public posts.

An approved chapter may authorize mocked or sandboxed tests but does not authorize live external actions unless it explicitly says so. Public test posts require an exact account, content scope, privacy/mode, and approval. Use owned/synthetic media; do not borrow a stranger's account or copyrighted test asset.

### SEC-012 — Spending controls that do not overpromise

Implement atomic reservations and hard request-count/parameter limits. Display estimates separately from observed provider usage. Freeze affected automated runs on exhausted budgets or unknown repeated charges. Log administrative changes to budget limits.

Application controls cannot guarantee a provider's total invoice when prices or externally incurred usage are unknown. Encourage users to set provider-side limits where available. Avoid language such as “you cannot be charged above this amount” unless the end-to-end guarantee is genuinely enforceable and tested.

Default batch sizes and concurrency are engineering safeguards, not paid-tier limits. Proposed conservative starting points are one render worker and a small number of external jobs, adjusted through measured testing. The UI explains these limits and does not direct users to a nonexistent upgrade plan.

### SEC-013 — Webhook and polling safety

Polling is a first-class mode for local installations without public callbacks. When webhooks are introduced, verify the exact provider's signature method, timestamp/replay protections, event identity, and body handling. Do not invent a generic signature header and call it supported.

Persist event IDs and apply idempotent state transitions. Out-of-order events cannot roll a publication backward incorrectly. A webhook triggers reconciliation when necessary rather than blindly trusting arbitrary posted JSON. Redact payloads before logs or public issue reports.

## 5. Installation and operational modes

### OPS-001 — Two explicit deployment profiles

**Local studio:** the user runs the containers on their computer. Editing, exports, generation, and locally owned scheduling require the relevant processes to be running. Closing the browser is different from stopping the containers; sleeping or shutting down the host can stop processing. Provider-owned schedules may continue after verified handoff, within the tested media window.

**Private always-on server:** the same application runs behind HTTPS with persistent storage, backups, and monitoring. This is the recommended operating mode for dependable recurring local generation. It adds hosting/maintenance costs but not a software subscription from the project.

Do not market a serverless static deployment as supporting a durable local worker unless a separately designed and tested worker/storage configuration exists. Do not require a public tunnel for the common bridge path when dashboard connection and polling suffice.

### OPS-002 — Reproducible installation

Release artifacts should include tagged container images, a Compose configuration, generated-secret setup instructions, persistent-volume definitions, health checks, upgrade instructions, and a minimal `.env.example` with placeholders only. The operator should not compile browser dependencies manually for an ordinary release installation.

Builds pin dependencies and renderer versions. Document required network access for image pulls and provider calls, supported host architectures, disk needs, and measured resource requirements. A nominal hardware target is not a published minimum until tested on a named environment.

Avoid “one-click” claims until someone unfamiliar with the code has completed the actual flow. Track steps that caused confusion. Simple installation is a product acceptance outcome, not a short README hiding many assumptions.

### OPS-003 — Health, maintenance, and user-visible readiness

Track web readiness, database/migration readiness, storage free space, worker heartbeat, queue lag, pending external requests, and unresolved publication outcomes. Expose a human-readable status screen without secrets. Show degraded capabilities rather than one global green indicator.

Detect low disk before expensive generation/import where possible. Garbage-collect orphaned staging files and unreferenced derivatives through a bounded retention job, never by deleting originals referenced by approved artifacts. Keep operational log retention limited and configurable.

Provider outages should pause only the affected work. The editor and library remain available. A circuit breaker cannot secretly drop queued tasks; it changes them to a visible held state with a reason.

### OPS-004 — Backup is a tested workflow

Back up PostgreSQL state and referenced media coherently, with a manifest and integrity checks. A maintenance-mode backup is an acceptable early implementation; an online backup needs a defined consistency strategy. Include configuration metadata needed to restore, but keep the master encryption secret in a separately secured recovery channel.

A project export is not a full backup. A full backup may contain encrypted credentials, private content, and operational history and must be treated as sensitive. Document what happens if the master key is lost: encrypted provider keys may be unrecoverable, while nonsecret content should remain recoverable if its data/blobs are intact.

Test restoration into a fresh isolated installation. Verify project counts, asset hashes, editable drafts, and render outputs—not merely that a database command exited successfully. Never verify restore by unintentionally resuming public scheduled posts.

### OPS-005 — Restore and restart cannot replay old side effects

Ordinary process restart resumes accepted jobs by their recorded identifiers. Restoring an older backup is different: it may lack provider operations that occurred after the backup. Start restored installations with generation/submission paused and mark them `reconciliation_required`.

Reconcile connected accounts, remote schedules, and known recent provider activity before enabling delivery. An old local ledger is not proof that a post was never submitted. Do not automatically create replacement schedules from restored rows. The operator must see unresolved gaps and confirm a safe resumption policy.

This distinction is mandatory for release. Backup/restore that duplicates public posts is not a successful backup feature.

### OPS-006 — Upgrades and rollback

Before a state-changing upgrade, show release notes, schema changes, compatibility, and backup requirements. Test migrations on fixtures resembling an existing installation. For irreversible migrations, provide a verified restore/forward-repair route and clearly state the limitation.

Do not auto-update running deployments to a moving `latest` image and mutate their database without operator control. Do not mix application versions sharing a schema unless explicitly supported. Pinning versions is not permission to ignore security patches; handle urgent fixes through a bounded maintenance release.

## 6. Open-source release and community operations

### OPS-007 — Licensing, provenance, and notices

Kyle must approve the source-code license before public repository distribution. AGPL-3.0-only is the proposal, not an applied license in this planning package. Record the chosen SPDX identifier and preserve dependency licenses and required notices. Do not add a “no commercial use” restriction and still call the result ordinary open source.

Starter recipes, icons, illustrations, test images, and fonts need their own redistribution review. Do not distribute the environment's font files or competitor assets. The project's code license does not automatically resolve every media/model-output license. Contributors must attest they have the right to submit their work.

### OPS-008 — Contribution and release hygiene

Use small pull requests, automated formatting/type checks/tests, dependency and secret scanning, and a documented review process. Provider adapters include sanitized fixtures and conformance results. Do not commit real credentials or private account data even to a temporary test branch.

Public issue templates ask users to redact keys, signed URLs, personal images, and account details. Provide a security-reporting path separate from public issues. Telemetry is off by default; any optional telemetry discloses exact collected fields and can be disabled without losing core functionality.

A release support matrix distinguishes experimental, mock-tested, documentation-verified, live-qualified, and unsupported features. Removing “experimental” requires evidence, not a UI rename.

## 7. Operational acceptance priorities

The highest-priority gates are secret isolation, owner authentication, safe media import, rendering without arbitrary code, immutable approval enforcement, bounded costs, honest uncertain outcomes, native photo verification, and restore-without-replay. These gate the relevant features as they arrive; they are not deferred until after an unattended scheduler ships.

The product's promise is control. An operator should be able to explain where content is stored, which service received it, what may still incur costs, which system owns a scheduled post, what is genuinely published, and what needs attention. When those answers are unclear, the interface and implementation need work.
