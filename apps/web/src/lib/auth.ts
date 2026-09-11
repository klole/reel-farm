import "dotenv/config";
import { APIError, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@oss/db";
import { eq } from "drizzle-orm";
import { user, workspace, schema } from "@oss/db/schema";

const isNextBuild = process.env.NEXT_PHASE === "phase-production-build";
const bootstrapToken = process.env.BOOTSTRAP_TOKEN ?? (isNextBuild ? "build-only-bootstrap-token" : "");
const authSecret = process.env.BETTER_AUTH_SECRET ?? (isNextBuild ? "build-only-secret-that-is-never-used-at-runtime" : "");
if (authSecret.length < 32) throw new Error("BETTER_AUTH_SECRET must be at least 32 characters.");
if (!bootstrapToken) throw new Error("BOOTSTRAP_TOKEN is required.");

const origins = Array.from(new Set([process.env.APP_ORIGIN ?? "http://localhost:3000", "http://localhost:3000", "http://127.0.0.1:3000"]));

export const auth = betterAuth({
  secret: authSecret,
  baseURL: process.env.APP_ORIGIN ?? "http://localhost:3000",
  trustedOrigins: origins,
  database: drizzleAdapter(db, { provider: "pg", schema: { ...schema, user, session: schema.session, account: schema.account, verification: schema.verification } }),
  emailAndPassword: { enabled: true, autoSignIn: false, requireEmailVerification: false, disableSignUp: false, minPasswordLength: 12, maxPasswordLength: 128 },
  session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24, storeSessionInDatabase: true },
  advanced: { useSecureCookies: process.env.NODE_ENV === "production" },
  telemetry: { enabled: false },
  rateLimit: { enabled: true, window: 60, max: 10 },
  databaseHooks: {
    user: {
      create: {
        before: async (_newUser, context) => {
          const internalToken = context?.request?.headers.get("x-oss-bootstrap");
          if (!internalToken || internalToken !== bootstrapToken) throw new APIError("FORBIDDEN", { message: "Owner bootstrap is only available through the private setup flow." });
          const existing = await db.select({ id: workspace.id }).from(workspace).where(eq(workspace.singletonKey, "primary"));
          if (existing.length > 0) throw new APIError("BAD_REQUEST", { message: "This installation already has an owner." });
        },
        after: async (newUser) => {
          await db.insert(workspace).values({ singletonKey: "primary", ownerUserId: newUser.id });
        }
      }
    }
  }
});

export type AuthSession = Awaited<ReturnType<typeof auth.api.getSession>>;

export async function getSession(headers: Headers): Promise<NonNullable<AuthSession>> {
  const result = await auth.api.getSession({ headers });
  if (!result) throw new Error("UNAUTHENTICATED");
  return result;
}

export async function maybeSession(headers: Headers): Promise<AuthSession> {
  return auth.api.getSession({ headers });
}
