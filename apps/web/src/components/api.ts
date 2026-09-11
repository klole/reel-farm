let csrfPromise: Promise<string> | undefined;

function cookie(name: string): string | undefined {
  return document.cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1);
}

async function csrfToken(): Promise<string> {
  if (!csrfPromise) csrfPromise = fetch("/api/csrf", { credentials: "same-origin", cache: "no-store" }).then(async (response) => { if (!response.ok) throw new Error("Unable to establish a local request token."); const data = await response.json() as { token: string }; return data.token; });
  return csrfPromise;
}

export async function apiFetch<T>(input: string, init: RequestInit = {}): Promise<T> {
  const method = (init.method ?? "GET").toUpperCase();
  const headers = new Headers(init.headers);
  if (method !== "GET" && method !== "HEAD") headers.set("x-csrf-token", cookie("oss_csrf") ?? await csrfToken());
  if (init.body && !(init.body instanceof FormData) && !headers.has("content-type")) headers.set("content-type", "application/json");
  const response = await fetch(input, { ...init, headers, credentials: "same-origin", cache: "no-store" });
  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json") ? await response.json() as T & { error?: { message?: string } } : undefined;
  if (!response.ok) throw new Error(payload && "error" in payload && payload.error?.message ? payload.error.message : `Local request failed (${response.status}).`);
  return payload as T;
}

export function newClientId(): string {
  return crypto.randomUUID();
}
