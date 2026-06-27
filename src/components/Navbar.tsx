"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Dumbbell, Menu, X, User } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-logo" onClick={closeMenu} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0", height: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div className="navbar-logo-icon">
              <Dumbbell size={20} />
            </div>
            <span>FiTLiFe</span>
          </div>
          <span style={{ fontSize: "0.65rem", fontWeight: 500, color: "var(--text-muted)", marginTop: "2px", textTransform: "none", letterSpacing: "normal" }}>
            our fitness companion
          </span>
        </Link>

        {/* Navigation Links */}
        <ul className={`navbar-links ${isOpen ? "active" : ""}`}>
          <li>
            <Link href="/" className="navbar-link" onClick={closeMenu}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/locations" className="navbar-link" onClick={closeMenu}>
              Locations
            </Link>
          </li>
          <li>
            <Link href="/workouts" className="navbar-link" onClick={closeMenu}>
              Workouts
            </Link>
          </li>
          <li>
            <Link href="/tips" className="navbar-link" onClick={closeMenu}>
              Fitness Tips
            </Link>
          </li>
          
          {/* Mobile Actions (Visible in menu drawer on mobile only) */}
          {session ? (
            <>
              <li className="mobile-only" style={{ width: "100%", marginTop: "1rem" }}>
                <Link href="/dashboard" className="btn btn-secondary btn-sm" style={{ width: "100%", justifyContent: "center" }} onClick={closeMenu}>
                  <User size={16} />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li className="mobile-only" style={{ width: "100%", marginTop: "0.5rem" }}>
                <button
                  onClick={() => {
                    signOut({ callbackUrl: "/" });
                    closeMenu();
                  }}
                  className="btn btn-primary btn-sm"
                  style={{ width: "100%" }}
                >
                  Sign Out
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="mobile-only" style={{ width: "100%", marginTop: "1.5rem" }}>
                <Link href="/login" className="btn btn-secondary btn-sm" style={{ width: "100%", justifyContent: "center" }} onClick={closeMenu}>
                  Sign In
                </Link>
              </li>
              <li className="mobile-only" style={{ width: "100%", marginTop: "0.5rem" }}>
                <Link href="/register" className="btn btn-primary btn-sm" style={{ width: "100%", justifyContent: "center" }} onClick={closeMenu}>
                  Get Started
                </Link>
              </li>
            </>
          )}
          {/* Mobile Theme Toggle */}
          <li className="mobile-only" style={{ display: "flex", justifyContent: "center", marginTop: "1rem", listStyle: "none" }}>
            <ThemeToggle />
          </li>
        </ul>

        {/* Desktop actions (hidden on mobile) */}
        <div className="navbar-actions">
          <ThemeToggle />
          {session ? (
            <>
              <Link href="/dashboard" className="btn btn-secondary btn-sm" style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <User size={16} />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="btn btn-primary btn-sm"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button 
          className={`navbar-burger ${isOpen ? "active" : ""}`} 
          onClick={toggleMenu} 
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}
