import { boolean, integer, jsonb, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

const now = () => timestamp({ withTimezone: true, mode: "date" }).defaultNow().notNull();

// Better Auth's documented Drizzle schema. The application intentionally exposes no generic signup route.
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: now(),
  updatedAt: now()
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: now(),
  updatedAt: now(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" })
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true, mode: "date" }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true, mode: "date" }),
  scope: text("scope"),
  password: text("password"),
  createdAt: now(),
  updatedAt: now()
}, (table) => ({ providerAccount: uniqueIndex("account_provider_account_unique").on(table.providerId, table.accountId) }));

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
  createdAt: now(),
  updatedAt: now()
});

export const workspace = pgTable("workspace", {
  id: uuid("id").defaultRandom().primaryKey(),
  singletonKey: text("singleton_key").notNull().unique(),
  ownerUserId: text("owner_user_id").notNull().unique().references(() => user.id, { onDelete: "restrict" }),
  createdAt: now()
});

export const project = pgTable("project", {
  id: uuid("id").defaultRandom().primaryKey(),
  workspaceId: uuid("workspace_id").notNull().references(() => workspace.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 120 }).notNull(),
  createdAt: now(),
  updatedAt: now(),
  lastSavedAt: timestamp("last_saved_at", { withTimezone: true, mode: "date" }).notNull().defaultNow()
}, (table) => ({ workspaceName: uniqueIndex("project_workspace_name_unique").on(table.workspaceId, table.name) }));

export const draft = pgTable("draft", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").notNull().unique().references(() => project.id, { onDelete: "cascade" }),
  headRevisionId: uuid("head_revision_id"),
  updatedAt: now()
});

export const draftRevision = pgTable("draft_revision", {
  id: uuid("id").defaultRandom().primaryKey(),
  draftId: uuid("draft_id").notNull().references(() => draft.id, { onDelete: "cascade" }),
  revisionNumber: integer("revision_number").notNull(),
  document: jsonb("document").notNull().$type<unknown>(),
  contentHash: text("content_hash").notNull(),
  canonicalizationVersion: text("canonicalization_version").notNull(),
  createdBy: text("created_by").notNull().references(() => user.id, { onDelete: "restrict" }),
  createdAt: now()
}, (table) => ({ draftRevisionNumber: uniqueIndex("draft_revision_number_unique").on(table.draftId, table.revisionNumber), draftRevisionHash: uniqueIndex("draft_revision_hash_unique").on(table.draftId, table.contentHash) }));

export const asset = pgTable("asset", {
  id: uuid("id").defaultRandom().primaryKey(),
  workspaceId: uuid("workspace_id").notNull().references(() => workspace.id, { onDelete: "cascade" }),
  originalName: varchar("original_name", { length: 255 }).notNull(),
  sourceKind: text("source_kind").notNull().default("upload"),
  uploadedBy: text("uploaded_by").notNull().references(() => user.id, { onDelete: "restrict" }),
  uploadedAt: now(),
  rightsAssertion: boolean("rights_assertion").notNull(),
  originalHash: text("original_hash").notNull(),
  derivativeHash: text("derivative_hash").notNull(),
  mime: text("mime").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  originalBytes: integer("original_bytes").notNull(),
  derivativeBytes: integer("derivative_bytes").notNull(),
  storageKey: text("storage_key").notNull().unique(),
  derivativeKey: text("derivative_key").notNull().unique(),
  thumbnailKey: text("thumbnail_key").notNull().unique(),
  acceptanceState: text("acceptance_state").notNull().default("accepted"),
  createdAt: now()
});

export const renderRequest = pgTable("render_request", {
  id: uuid("id").defaultRandom().primaryKey(),
  workspaceId: uuid("workspace_id").notNull().references(() => workspace.id, { onDelete: "cascade" }),
  draftId: uuid("draft_id").notNull().references(() => draft.id, { onDelete: "cascade" }),
  revisionId: uuid("revision_id").notNull().references(() => draftRevision.id, { onDelete: "restrict" }),
  clientRequestId: text("client_request_id").notNull(),
  payloadHash: text("payload_hash").notNull(),
  status: text("status").notNull().default("queued"),
  attempts: integer("attempts").notNull().default(0),
  maxAttempts: integer("max_attempts").notNull().default(3),
  errorCode: text("error_code"),
  errorMessage: text("error_message"),
  leaseToken: text("lease_token"),
  leaseExpiresAt: timestamp("lease_expires_at", { withTimezone: true, mode: "date" }),
  rendererBuildId: text("renderer_build_id").notNull(),
  createdAt: now(),
  startedAt: timestamp("started_at", { withTimezone: true, mode: "date" }),
  completedAt: timestamp("completed_at", { withTimezone: true, mode: "date" })
}, (table) => ({ requestIdentity: uniqueIndex("render_request_identity_unique").on(table.draftId, table.clientRequestId) }));

export const renderOutbox = pgTable("render_outbox", {
  id: uuid("id").defaultRandom().primaryKey(),
  renderRequestId: uuid("render_request_id").notNull().unique().references(() => renderRequest.id, { onDelete: "cascade" }),
  availableAt: timestamp("available_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
  leaseToken: text("lease_token"),
  leaseExpiresAt: timestamp("lease_expires_at", { withTimezone: true, mode: "date" }),
  sentAt: timestamp("sent_at", { withTimezone: true, mode: "date" }),
  attempts: integer("attempts").notNull().default(0),
  lastError: text("last_error"),
  createdAt: now()
});

export const renderArtifact = pgTable("render_artifact", {
  id: uuid("id").defaultRandom().primaryKey(),
  renderRequestId: uuid("render_request_id").notNull().unique().references(() => renderRequest.id, { onDelete: "cascade" }),
  revisionId: uuid("revision_id").notNull().references(() => draftRevision.id, { onDelete: "restrict" }),
  revisionHash: text("revision_hash").notNull(),
  rendererBuildId: text("renderer_build_id").notNull(),
  fontSetHash: text("font_set_hash").notNull(),
  canvasWidth: integer("canvas_width").notNull(),
  canvasHeight: integer("canvas_height").notNull(),
  images: jsonb("images").notNull().$type<unknown[]>(),
  manifest: jsonb("manifest").notNull().$type<unknown>(),
  zipKey: text("zip_key").notNull().unique(),
  createdAt: now()
});

export const workerHeartbeat = pgTable("worker_heartbeat", {
  workerName: text("worker_name").primaryKey(),
  status: text("status").notNull(),
  buildId: text("build_id").notNull(),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true, mode: "date" }).notNull(),
  lastError: text("last_error")
});

export const saveMutation = pgTable("save_mutation", {
  id: uuid("id").defaultRandom().primaryKey(),
  draftId: uuid("draft_id").notNull().references(() => draft.id, { onDelete: "cascade" }),
  actorUserId: text("actor_user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  mutationId: text("mutation_id").notNull(),
  payloadHash: text("payload_hash").notNull(),
  revisionId: uuid("revision_id").notNull().references(() => draftRevision.id, { onDelete: "restrict" }),
  createdAt: now()
}, (table) => ({ mutationIdentity: uniqueIndex("save_mutation_identity_unique").on(table.draftId, table.actorUserId, table.mutationId) }));

export const schema = { user, session, account, verification, workspace, project, draft, draftRevision, asset, renderRequest, renderOutbox, renderArtifact, workerHeartbeat, saveMutation };

export type Workspace = typeof workspace.$inferSelect;
export type Project = typeof project.$inferSelect;
export type Draft = typeof draft.$inferSelect;
export type DraftRevision = typeof draftRevision.$inferSelect;
export type Asset = typeof asset.$inferSelect;
export type RenderRequest = typeof renderRequest.$inferSelect;
export type RenderArtifact = typeof renderArtifact.$inferSelect;
