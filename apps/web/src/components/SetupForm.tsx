"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "./api";

export default function SetupForm() {
  const router = useRouter();
  const [values, setValues] = useState({ token: "", name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setError(""); setBusy(true); try { await apiFetch("/api/setup", { method: "POST", body: JSON.stringify(values) }); router.push("/login?created=1"); } catch (err) { setError(err instanceof Error ? err.message : "Setup could not be completed."); } finally { setBusy(false); } }
  return <form className="auth-form" onSubmit={submit}>
    {error && <div className="error" role="alert">{error}</div>}
    <div className="field"><label htmlFor="setup-token">One-time setup token</label><input id="setup-token" required autoComplete="off" value={values.token} onChange={(event) => setValues({ ...values, token: event.target.value })} /><p className="help">Print the token intentionally with <code>pnpm setup</code>; it is not stored in this form or in exports.</p></div>
    <div className="field"><label htmlFor="owner-name">Owner name</label><input id="owner-name" required autoComplete="name" value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} /></div>
    <div className="field"><label htmlFor="owner-email">Owner email</label><input id="owner-email" type="email" required autoComplete="email" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} /></div>
    <div className="field"><label htmlFor="owner-password">Password</label><input id="owner-password" type="password" required minLength={12} autoComplete="new-password" value={values.password} onChange={(event) => setValues({ ...values, password: event.target.value })} /><p className="help">Use at least 12 characters. Recovery is deliberately local; keep this credential safe.</p></div>
    <button className="button button-primary" type="submit" disabled={busy}>{busy ? "Creating owner…" : "Create private owner"}</button>
    <p className="auth-footer">Already initialized? <a className="link" href="/login">Go to sign in</a></p>
  </form>;
}
