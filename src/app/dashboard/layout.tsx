"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  CreditCard, 
  Target, 
  TrendingUp, 
  Clipboard, 
  LogOut, 
  Dumbbell,
  Menu,
  X,
  Sparkles
} from "lucide-react";
import "./dashboard.css";
import ThemeToggle from "@/components/ThemeToggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const date = new Date();
    setCurrentTime(
      date.toLocaleDateString("en-IN", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    );
  }, []);

  const menuItems = [
    { name: "Overview", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Membership", path: "/dashboard/membership", icon: <CreditCard size={18} /> },
    { name: "Fitness Goals", path: "/dashboard/goals", icon: <Target size={18} /> },
    { name: "Progress Tracking", path: "/dashboard/progress", icon: <TrendingUp size={18} /> },
    { name: "Workout Logger", path: "/dashboard/log", icon: <Clipboard size={18} /> },
    { name: "FiTLiFe Plus", path: "/dashboard/plus", icon: <Sparkles size={18} /> },
  ];

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const getPageTitle = () => {
    const active = menuItems.find((item) => item.path === pathname);
    return active ? active.name : "Dashboard";
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar panel */}
      <aside className={`dashboard-sidebar ${mobileOpen ? "active" : ""}`}>
        <div className="dashboard-sidebar-header">
          <Link href="/" className="dashboard-sidebar-logo" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0", height: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div className="dashboard-sidebar-logo-icon">
                <Dumbbell size={18} />
              </div>
              <span>FiTLiFe</span>
            </div>
            <span style={{ fontSize: "0.6rem", fontWeight: 500, color: "var(--text-muted)", marginTop: "2px", textTransform: "none", letterSpacing: "normal", fontFamily: "var(--font-body)" }}>
              our fitness companion
            </span>
          </Link>
        </div>

        <nav className="dashboard-nav">
          {menuItems.map((item) => (
            <li key={item.path} style={{ listStyle: "none" }}>
              <Link 
                href={item.path} 
                className={`dashboard-nav-link ${pathname === item.path ? "active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </nav>

        <div className="dashboard-sidebar-footer">
          <button 
            onClick={handleLogout}
            className="dashboard-nav-link" 
            style={{ 
              width: "100%", 
              background: "transparent", 
              border: "none", 
              cursor: "pointer",
              textAlign: "left",
              display: "flex",
              alignItems: "center"
            }}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content workspace */}
      <div className="dashboard-content">
        <header className="dashboard-header">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {/* Mobile menu trigger */}
            <button 
              onClick={() => setMobileOpen(!mobileOpen)}
              className="btn btn-secondary btn-sm mobile-sidebar-toggle-btn"
              style={{ padding: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <h2 className="dashboard-header-title">{getPageTitle()}</h2>
          </div>

          <div className="dashboard-header-actions">
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }} className="mobile-hidden">
              {currentTime}
            </span>
            
            <ThemeToggle />
            
            <div className="dashboard-user-profile">
              <div className="dashboard-user-avatar">
                {session?.user?.name ? session.user.name[0].toUpperCase() : "M"}
              </div>
              <div className="mobile-hidden" style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                  {session?.user?.name || "Member"}
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
                  {session?.user?.role || "MEMBER"}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="dashboard-main-area">
          {children}
        </main>
      </div>
    </div>
  );
}
