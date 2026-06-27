"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CITIES = [
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Pune",
  "Hyderabad",
  "Chennai",
  "Ahmedabad",
  "Kolkata",
  "Gurugram",
  "Noida",
  "Jaipur",
  "Chandigarh",
  "Lucknow",
  "Indore",
];

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validations
    if (!name || !email || !password || !city) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          phone: phone || null,
          city,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed. Please try again.");
        setLoading(false);
      } else {
        setSuccess(true);
        setError(null);
        setTimeout(() => {
          router.push("/login?registered=true");
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-card">
      <h1 className="auth-form-title">Join AB Gym</h1>
      <p className="auth-form-subtitle">Create a membership account and start tracking your gains.</p>

      {error && <div className="auth-form-error">{error}</div>}
      {success && (
        <div className="auth-form-success">
          Account created successfully! Redirecting to login...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            className="form-input"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading || success}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            className="form-input"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading || success}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="form-input"
            placeholder="Min. 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading || success}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="phone">Phone Number (Optional)</label>
          <input
            id="phone"
            type="tel"
            className="form-input"
            placeholder="+91 9988776655"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={loading || success}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="city">Your City</label>
          <select
            id="city"
            className="form-select"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            disabled={loading || success}
          >
            <option value="">Select a city</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: "100%", marginTop: "1rem", minHeight: "50px" }}
          disabled={loading || success}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <p className="auth-footer-text">
        Already have an account?{" "}
        <Link href="/login" className="auth-link">
          Sign in here
        </Link>
      </p>
    </div>
  );
}
