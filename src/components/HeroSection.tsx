"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Particle {
  id: number;
  top: string;
  left: string;
  delay: string;
  duration: string;
}

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setMounted(true);
    // Generate particle variables after mounting to avoid React hydration mismatches
    const generated: Particle[] = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 80 + 10}%`,
      left: `${Math.random() * 80 + 10}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 8 + 6}s`,
    }));
    setParticles(generated);
  }, []);

  return (
    <section className="hero">
      {/* Background radial overlays */}
      <div className="hero-bg-effects">
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>
      </div>

      {/* Dynamic Animated Particles (rendered client-side post-mount) */}
      {mounted && (
        <div className="hero-particles-container">
          {particles.map((p) => (
            <div
              key={p.id}
              className="hero-particle animate-pulse-slow"
              style={{
                top: p.top,
                left: p.left,
                animationDelay: p.delay,
                animationDuration: p.duration,
              }}
            />
          ))}
        </div>
      )}

      <div className="container" style={{ position: "relative", zIndex: 10 }}>
        <div className="hero-content">
          <div className="hero-badge animate-float">
            <span>🇮🇳 All-India Gym Franchise</span>
          </div>

          <h1 className="hero-title">
            Build Your Ultimate <br />
            <span className="text-gradient">Physique & Vibe</span>
          </h1>

          <p className="hero-description">
            Unlock access to 25+ premium gym locations across India. Access dynamic workout splits, 
            track fitness goals, and train under certified coaches.
          </p>

          <div className="hero-actions">
            <Link href="/register" className="btn btn-primary btn-lg">
              <span>Start Your Journey</span>
              <ArrowRight size={18} />
            </Link>
            <a href="#plans" className="btn btn-secondary btn-lg">
              <span>Explore Plans</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
