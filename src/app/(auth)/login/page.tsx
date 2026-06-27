"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Zap } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    searchParams.get("error") ? "Authentication failed. Please verify your credentials." : null
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic client validation
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleGuestLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Provision / reset guest user and active subscription
      const res = await fetch("/api/auth/guest", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to initialize guest session.");
        setLoading(false);
        return;
      }

      // 2. Sign in with the guest credentials returned
      const signinRes = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (signinRes?.error) {
        setError(signinRes.error);
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred during guest login. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-card">
      <h1 className="auth-form-title">Welcome Back</h1>
      <p className="auth-form-subtitle">Enter your credentials to access your fitness dashboard.</p>

      {error && <div className="auth-form-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            className="form-input"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="form-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: "100%", marginTop: "1rem", minHeight: "50px" }}
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <div style={{ display: "flex", alignItems: "center", margin: "1.5rem 0", color: "var(--text-muted)", fontSize: "0.85rem" }}>
        <div style={{ flex: 1, height: "1px", background: "var(--border-light)" }}></div>
        <span style={{ padding: "0 0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>OR</span>
        <div style={{ flex: 1, height: "1px", background: "var(--border-light)" }}></div>
      </div>

      <button
        type="button"
        onClick={handleGuestLogin}
        className="btn btn-secondary"
        style={{ 
          width: "100%", 
          minHeight: "50px", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          gap: "0.5rem",
          background: "linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(236, 72, 153, 0.15))",
          border: "1px solid var(--accent-purple)",
          color: "#fff"
        }}
        disabled={loading}
      >
        <Zap size={16} fill="currentColor" style={{ color: "var(--accent-pink)" }} />
        <span>{loading ? "Signing In..." : "⚡ Quick Guest Login"}</span>
      </button>

      <p className="auth-footer-text">
        Don't have an account?{" "}
        <Link href="/register" className="auth-link">
          Create one here
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="auth-form-card">
        <h1 className="auth-form-title">Loading...</h1>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
