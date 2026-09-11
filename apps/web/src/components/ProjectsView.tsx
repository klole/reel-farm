"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "./api";
import AppTopbar from "./AppTopbar";

type Project = { id: string; name: string; createdAt: string; updatedAt: string; lastSavedAt: string; draftId: string; headRevisionId: string | null };

function savedLabel(date: string): string { const delta = Math.max(0, Date.now() - new Date(date).getTime()); if (delta < 60_000) return "Saved just now"; if (delta < 3_600_000) return `Saved ${Math.floor(delta / 60_000)}m ago`; return `Saved ${Math.floor(delta / 3_600_000)}h ago`; }

export default function ProjectsView({ initialProjects, ownerName }: { initialProjects: Project[]; ownerName: string }) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [worker, setWorker] = useState<"ready" | "degraded" | "offline" | "checking">("checking");
  useEffect(() => { void apiFetch<{ renderer: "ready" | "degraded" | "offline" }>("/api/health/details").then((health) => setWorker(health.renderer)).catch(() => setWorker("offline")); }, []);
  async function create(event: FormEvent) { event.preventDefault(); if (!newName.trim()) return; setCreating(true); setError(""); try { const result = await apiFetch<{ project: Project }>("/api/projects", { method: "POST", body: JSON.stringify({ name: newName }) }); setNewName(""); router.push(`/projects/${result.project.id}`); } catch (err) { setError(err instanceof Error ? err.message : "Project could not be created."); } finally { setCreating(false); } }
  async function rename(project: Project) { const name = window.prompt("Rename project", project.name); if (!name || name.trim() === project.name) return; try { const result = await apiFetch<{ project: Project }>(`/api/projects/${project.id}`, { method: "PATCH", body: JSON.stringify({ name }) }); setProjects((items) => items.map((item) => item.id === project.id ? { ...item, name: result.project.name } : item)); } catch (err) { setError(err instanceof Error ? err.message : "Project could not be renamed."); } }
  return <div className="app-shell"><AppTopbar ownerName={ownerName} /><main className="page-wrap"><div className="page-heading"><div><p className="eyebrow">Your local workspace</p><h1>Projects</h1></div><form className="inline-form" onSubmit={create}><input aria-label="New project name" placeholder="A project name" value={newName} onChange={(event) => setNewName(event.target.value)} /><button className="button button-primary" type="submit" disabled={creating}>{creating ? "Creating…" : "Create project"}</button></form></div><div className="status-strip"><span className={`status-chip ${worker === "ready" ? "ready" : worker === "offline" ? "offline" : worker === "degraded" ? "degraded" : ""}`}>Renderer {worker === "ready" ? "ready" : worker === "degraded" ? "degraded · check worker" : worker === "offline" ? "offline · queued renders wait" : "checking"}</span><span className="status-chip ready">Database and media protected</span></div>{error && <div className="error" role="alert">{error}</div>}<section className="project-grid" aria-label="Projects">{projects.length === 0 ? <div className="empty-card"><div><h2>Start with one honest slide.</h2><p>Create a project, type your own words, and add local images when you are ready. The manual path stays useful without provider credentials.</p><button className="button button-primary" onClick={() => document.querySelector<HTMLInputElement>("input[aria-label='New project name']")?.focus()}>Name your first project</button></div></div> : projects.map((project) => <article className="project-card" key={project.id}><div><p className="eyebrow">{project.headRevisionId ? "Draft saved" : "New draft"}</p><h2>{project.name}</h2><p className="project-card-meta">One editable slideshow draft<br />{savedLabel(project.lastSavedAt)}</p></div><div className="project-card-actions"><button className="button button-quiet button-small" onClick={() => void rename(project)}>Rename</button><Link className="button button-primary button-small" href={`/projects/${project.id}`}>Open studio</Link></div></article>)}</section></main></div>;
}
