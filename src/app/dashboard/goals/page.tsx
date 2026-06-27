"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Trash2, 
  Target, 
  Award, 
  CheckCircle, 
  Calendar, 
  HelpCircle,
  TrendingUp,
  X
} from "lucide-react";
import "./goals.css";

interface Goal {
  id: string;
  type: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  deadline: string | null;
  status: string;
}

export default function GoalsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Goals State
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Tab control
  const [activeTab, setActiveTab] = useState<"ACTIVE" | "COMPLETED" | "ALL">("ACTIVE");

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("WEIGHT");
  const [target, setTarget] = useState("");
  const [current, setCurrent] = useState("");
  const [unit, setUnit] = useState("kg");
  const [deadline, setDeadline] = useState("");

  // Inline update state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchGoals();
    }
  }, [status]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/goals");
      if (!res.ok) throw new Error("Failed to load goals");
      const data = await res.json();
      setGoals(data);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title || !target || !current || !unit) {
      setError("Please fill out all required fields.");
      return;
    }

    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          type,
          target: parseFloat(target),
          current: parseFloat(current),
          unit,
          deadline: deadline || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create goal");

      setGoals([data, ...goals]);
      setSuccess("Fitness goal created successfully!");
      setShowForm(false);
      
      // Reset form
      setTitle("");
      setType("WEIGHT");
      setTarget("");
      setCurrent("");
      setUnit("kg");
      setDeadline("");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  const handleUpdateProgress = async (id: string, newProgress: number) => {
    setError("");
    try {
      const res = await fetch("/api/goals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          current: newProgress,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update goal");

      setGoals(goals.map((g) => (g.id === id ? data : g)));
      setEditingId(null);
      setSuccess("Goal progress updated!");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (!confirm("Are you sure you want to delete this fitness goal?")) return;
    setError("");
    try {
      const res = await fetch(`/api/goals?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete goal");

      setGoals(goals.filter((g) => g.id !== id));
      setSuccess("Fitness goal deleted.");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  const filteredGoals = goals.filter((g) => {
    if (activeTab === "ALL") return true;
    return g.status === activeTab;
  });

  if (status === "loading" || loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: "2rem 0", alignItems: "center", justifyContent: "center" }}>
        <div className="summary-card-icon-wrapper summary-icon-purple animate-pulse-slow">
          <Target size={24} />
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Loading fitness goals...</p>
      </div>
    );
  }

  return (
    <div className="goals-page-wrapper">
      {/* Header and Add Trigger */}
      <div className="goals-header-row">
        <div>
          <h2 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>My Fitness Goals</h2>
          <p style={{ color: "var(--text-muted)" }}>
            Establish targets, log continuous progress, and unlock visual achievements
          </p>
        </div>
        
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="btn btn-primary btn-sm"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          <span>{showForm ? "Cancel" : "Add New Goal"}</span>
        </button>
      </div>

      {/* Alert Notices */}
      {error && (
        <div className="glass-panel" style={{ padding: "1rem", background: "rgba(239,68,68,0.05)", borderColor: "rgba(239,68,68,0.2)", color: "#ef4444", borderRadius: "var(--radius-md)" }}>
          {error}
        </div>
      )}
      {success && (
        <div className="glass-panel" style={{ padding: "1rem", background: "rgba(16,185,129,0.05)", borderColor: "rgba(16,185,129,0.2)", color: "var(--accent-emerald)", borderRadius: "var(--radius-md)" }}>
          {success}
        </div>
      )}

      {/* Goal creation Form */}
      {showForm && (
        <div className="goals-form-container glass-panel">
          <h3 style={{ fontSize: "1.25rem", marginBottom: "1.25rem", fontFamily: "var(--font-heading)" }}>Define New Target</h3>
          
          <form onSubmit={handleCreateGoal} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Goal Title / Milestone</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g., Squat 150 kg, Bench 100 kg" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="goals-form-grid">
              <div className="form-group">
                <label className="form-label">Goal Category</label>
                <select 
                  className="locator-select-field" 
                  style={{ width: "100%", height: "42px" }}
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value);
                    if (e.target.value === "WEIGHT") setUnit("kg");
                    else if (e.target.value === "STRENGTH") setUnit("reps");
                    else if (e.target.value === "ENDURANCE") setUnit("mins");
                  }}
                >
                  <option value="WEIGHT">Weight Control</option>
                  <option value="STRENGTH">Strength Lift</option>
                  <option value="ENDURANCE">Endurance Cardio</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Measurement Unit</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. kg, reps, lbs" 
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="goals-form-grid">
              <div className="form-group">
                <label className="form-label">Current Progress</label>
                <input 
                  type="number" 
                  step="any"
                  className="form-input" 
                  placeholder="e.g. 70" 
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Target Metric</label>
                <input 
                  type="number" 
                  step="any"
                  className="form-input" 
                  placeholder="e.g. 80" 
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Deadline (Optional)</label>
              <input 
                type="date" 
                className="form-input" 
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
              Create Fitness Goal
            </button>
          </form>
        </div>
      )}

      {/* Nav Tabs */}
      <div className="catalog-tabs" style={{ justifyContent: "flex-start", marginBottom: "1.5rem" }}>
        <button 
          onClick={() => setActiveTab("ACTIVE")} 
          className={`catalog-tab ${activeTab === "ACTIVE" ? "active" : ""}`}
          style={{ background: "none", border: "none", padding: "0.75rem 1.25rem" }}
        >
          Active Goals
        </button>
        <button 
          onClick={() => setActiveTab("COMPLETED")} 
          className={`catalog-tab ${activeTab === "COMPLETED" ? "active" : ""}`}
          style={{ background: "none", border: "none", padding: "0.75rem 1.25rem" }}
        >
          Completed
        </button>
        <button 
          onClick={() => setActiveTab("ALL")} 
          className={`catalog-tab ${activeTab === "ALL" ? "active" : ""}`}
          style={{ background: "none", border: "none", padding: "0.75rem 1.25rem" }}
        >
          All History
        </button>
      </div>

      {/* Goals Display Grid */}
      {filteredGoals.length === 0 ? (
        <div className="glass-panel" style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--text-muted)" }}>
          <Target size={48} style={{ margin: "0 auto 1.25rem auto", opacity: 0.4, display: "block" }} />
          <h3>No Milestones Found</h3>
          <p style={{ maxWidth: "400px", margin: "0 auto 1rem auto" }}>
            You don't have any registered fitness targets in this tab. Define a goal to begin mapping progress!
          </p>
        </div>
      ) : (
        <div className="goals-grid">
          {filteredGoals.map((goal) => {
            const percentage = Math.min(
              100,
              Math.max(0, Math.round((goal.current / goal.target) * 100))
            );
            
            // SVG Circle Specs
            const radius = 50;
            const stroke = 8;
            const normalizedRadius = radius - stroke * 2;
            const circumference = normalizedRadius * 2 * Math.PI;
            const strokeDashoffset = circumference - (percentage / 100) * circumference;

            return (
              <div key={goal.id} className="goal-card glass-panel">
                
                {/* Header info */}
                <div className="goal-card-header">
                  <div>
                    <span className="goal-card-type">{goal.type}</span>
                    <h3 className="goal-card-title">{goal.title}</h3>
                  </div>
                  <button 
                    onClick={() => handleDeleteGoal(goal.id)}
                    style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
                    aria-label="Delete Goal"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* SVG Progress Ring */}
                <div className="goal-ring-container">
                  <svg
                    height={radius * 2}
                    width={radius * 2}
                    className="goal-ring-svg"
                  >
                    <circle
                      className="goal-ring-circle-bg"
                      r={normalizedRadius}
                      cx={radius}
                      cy={radius}
                    />
                    <circle
                      className={`goal-ring-circle-progress type-${goal.type.toLowerCase()}`}
                      strokeDasharray={circumference + " " + circumference}
                      style={{ strokeDashoffset }}
                      r={normalizedRadius}
                      cx={radius}
                      cy={radius}
                    />
                  </svg>
                  <div className="goal-ring-percent-text">{percentage}%</div>
                </div>

                {/* Metrics detail row */}
                <div className="goal-metrics-row">
                  <div>
                    <div className="goal-metric-label">Current</div>
                    <div className="goal-metric-val">{goal.current} {goal.unit}</div>
                  </div>
                  <div>
                    <div className="goal-metric-label">Target</div>
                    <div className="goal-metric-val">{goal.target} {goal.unit}</div>
                  </div>
                </div>

                {/* Deadline */}
                {goal.deadline && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    <Calendar size={12} />
                    <span>
                      Target Date: {new Date(goal.deadline).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}

                {/* Completed Indicator */}
                {goal.status === "COMPLETED" && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", color: "var(--accent-emerald)", fontWeight: 700 }}>
                    <CheckCircle size={14} />
                    <span>Goal Achieved!</span>
                  </div>
                )}

                {/* Update Action Panel */}
                {goal.status !== "COMPLETED" && (
                  <div>
                    {editingId === goal.id ? (
                      <div className="goal-update-panel">
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <input 
                            type="number" 
                            step="any"
                            className="form-input" 
                            style={{ padding: "0.4rem 0.75rem", fontSize: "0.9rem" }}
                            placeholder="Current value"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            required
                          />
                          <button 
                            onClick={() => handleUpdateProgress(goal.id, parseFloat(editingValue))}
                            className="btn btn-primary btn-sm"
                            style={{ padding: "0.4rem 1rem" }}
                          >
                            Save
                          </button>
                          <button 
                            onClick={() => setEditingId(null)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: "0.4rem 0.75rem" }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => {
                          setEditingId(goal.id);
                          setEditingValue(goal.current.toString());
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ width: "100%", justifyContent: "center", display: "flex", gap: "0.5rem" }}
                      >
                        <TrendingUp size={14} />
                        <span>Update Progress</span>
                      </button>
                    )}
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
