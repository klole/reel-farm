import SetupForm from "../../src/components/SetupForm";

export const dynamic = "force-dynamic";

export default function SetupPage() { return <main className="auth-page"><div className="auth-card"><p className="eyebrow">Private local installation</p><h1>Make space for your ideas.</h1><p className="lede">Create the one owner account for this installation. No provider key or online account is needed for manual slideshows.</p><SetupForm /></div></main>; }
