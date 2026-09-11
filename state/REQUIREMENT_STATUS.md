# Requirement status — CH-001 checkpoint

Statuses below are chapter evidence statuses, not acceptance of the full North Star. Parent requirements remain partial/unreviewed; no parent requirement is marked `accepted` by this handoff. CH-001R-r2 static repairs and harnesses are committed, but the real database/browser/Compose environment was unavailable.

| Requirement subset | CH-001 status | Evidence / boundary |
|---|---|---|
| PRD-001, PRD-002, PRD-004 | `partial` | Private owner setup, zero-provider manual path, and project CRUD are implemented; live DB/browser verification is not run. |
| PRD-010, PRD-011, PRD-017 | `partial` | Local accepted assets, rights assertion, hashes, thumbnails, bounded multipart receipt, and protected routes are implemented; decoder/storage integration is not run. |
| PRD-028, PRD-029, PRD-030 | `partial` | Three authored layouts and 9:16/4:5 editor controls exist; visual/browser verification is not run. |
| PRD-031, PRD-032 | `partial` | Two local fonts, bounded typography, overflow checks, cover/contain/focal controls exist; render corpus is not run. |
| PRD-034 | `partial` | Autosave, session undo/redo, immutable revisions, stable mutation replay, and conflict UI exist; two-tab/lost-response exercise is not run. |
| PRD-035, PRD-036 | `partial` | Ordered JPEG/text/manifest packaging and exact preview routes exist; no real artifact was produced in this host. |
| PRD-052, PRD-053 | `partial` | Responsive/failure states were implemented; accessibility and narrow/desktop browser review are not run. |
| ARC-001, ARC-002, ARC-004, ARC-006, ARC-007, ARC-008 | `partial` | Workspace packages, PostgreSQL schema, immutable document contract, and local asset boundary are implemented. |
| ARC-010, ARC-012, ARC-013 | `partial` | Durable render intent/outbox, worker readiness, leases, fencing, attempt ceilings, and bounded retry policy are implemented; recovery exercise is not run. |
| ARC-018, ARC-019 | `partial` | Shared React scene, local fonts, browser capture, manifest, and export path are implemented; real render evidence is not run. |
| ARC-023, ARC-024 | `partial` | Health/readiness probes, sanitized errors, and guarded initial migration exist; migration idempotence is not run against PostgreSQL. |
| SEC-001, SEC-002, SEC-003, SEC-008, SEC-009 | `partial` | Loopback binding, sessions/ownership, CSRF/origin checks, pre-parse upload bounds, safe keys, explicit Chromium sandboxing, and non-root Compose worker configuration exist; live containment checks are not run. |
| OPS-001, OPS-002, OPS-003, OPS-007 | `partial` | Compose/host instructions, health route, dependency/license record, and local setup exist; clean installation and release qualification are not run. |
| NS-F01–NS-F09, NS-I01, NS-I02, NS-I08–NS-I12 | `partial / preserved` | Fixed provider, originality, evidence, ownership, portability, and chapter-boundary decisions are respected; the chapter remains awaiting review. |
| Provider discovery/generation/publishing, PRD-003/005–009, 012–027, 033, 037–051, 054–058 | `deferred_by_approved_decision` | No provider SDK, Pinterest, AI, publishing, billing, scheduling, video, or next-chapter work is in this patch. |

See the historical [CH-001 evidence index](../docs/evidence/CH-001/README.md), fresh [CH-001R-r2 evidence index](../docs/evidence/CH-001R-r2/README.md), and [CH-001R-r2 handoff](../handoffs/CH-001R.md) for the finite CH001-001 through CH001-072 ledgers. The frozen North Star status scaffold remains in the supplied reference packet.
