"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "./api";

export default function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const [values, setValues] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setError(""); setBusy(true); try { await apiFetch("/api/auth/sign-in/email", { method: "POST", body: JSON.stringify({ ...values, rememberMe: true }) }); router.push("/projects"); router.refresh(); } catch (err) { setError(err instanceof Error ? err.message : "Sign in failed."); } finally { setBusy(false); } }
  return <form className="auth-form" onSubmit={submit}>
    {search.get("created") === "1" && <div className="success" role="status">Owner created. Sign in to open your projects.</div>}
    {error && <div className="error" role="alert">{error}</div>}
    <div className="field"><label htmlFor="login-email">Owner email</label><input id="login-email" type="email" required autoComplete="email" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} /></div>
    <div className="field"><label htmlFor="login-password">Password</label><input id="login-password" type="password" required autoComplete="current-password" value={values.password} onChange={(event) => setValues({ ...values, password: event.target.value })} /></div>
    <button className="button button-primary" type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
    <p className="auth-footer">No owner yet? <a className="link" href="/setup">Start private setup</a></p>
  </form>;
}
