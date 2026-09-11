import LoginForm from "../../src/components/LoginForm";

export const dynamic = "force-dynamic";

export default function LoginPage() { return <main className="auth-page"><div className="auth-card"><p className="eyebrow">Open Slideshow Studio</p><h1>Welcome back.</h1><p className="lede">This is a private installation. Sign in to continue to your local projects.</p><LoginForm /></div></main>; }
