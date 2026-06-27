import React from "react";
import "./auth.css";
import { Dumbbell } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-container">
      {/* Left panel: Gym Branding, Motivation & Statistics */}
      <div className="auth-sidebar">
        <div className="auth-brand" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div className="auth-brand-logo">
              <Dumbbell size={22} />
            </div>
            <span>FiTLiFe</span>
          </div>
          <span style={{ fontSize: "0.65rem", fontWeight: 500, color: "var(--text-muted)", marginTop: "2px", textTransform: "none", letterSpacing: "normal" }}>
            our fitness companion
          </span>
        </div>
        
        <div className="auth-quote-section">
          <h2 className="auth-quote text-gradient">
            "Your body can stand almost anything. It's your mind that you have to convince."
          </h2>
          <p className="auth-quote-author">— FiTLiFe Elite Club</p>
        </div>
        
        <div className="auth-stats">
          <div className="auth-stat-card">
            <div className="auth-stat-number text-gradient">25+</div>
            <div className="auth-stat-label">Gym Locations</div>
          </div>
          <div className="auth-stat-card">
            <div className="auth-stat-number text-gradient">10k+</div>
            <div className="auth-stat-label">Active Members</div>
          </div>
          <div className="auth-stat-card">
            <div className="auth-stat-number text-gradient">150+</div>
            <div className="auth-stat-label">Certified Coaches</div>
          </div>
        </div>
      </div>
      
      {/* Right panel: Login / Register Forms */}
      <div className="auth-form-side">
        {children}
      </div>
    </div>
  );
}
