"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "./api";

export default function AppTopbar({ ownerName, editor = false }: { ownerName?: string; editor?: boolean }) {
  const router = useRouter();
  async function signOut() { try { await apiFetch("/api/auth/sign-out", { method: "POST", body: JSON.stringify({}) }); router.push("/login"); router.refresh(); } catch { router.push("/login"); } }
  return <header className={editor ? "editor-topbar" : "topbar"}><Link className="brand" href="/projects"><span className="brand-name">Open Slideshow Studio</span><span className="brand-note">v0.1</span></Link><div className="topbar-actions"><span className="owner-pill"><span className="owner-dot" aria-hidden="true" />{ownerName ? `Owner · ${ownerName}` : "Private workspace"}</span><button className="button button-quiet button-small" onClick={signOut}>Sign out</button></div></header>;
}
