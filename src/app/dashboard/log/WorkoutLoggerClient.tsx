"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Clipboard, 
  Dumbbell, 
  Trash2, 
  Calendar,
  Sparkles,
  BarChart as ChartIcon,
  Plus
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import "./log.css";

interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string;
}

interface WorkoutLog {
  id: string;
  exerciseId: string;
  sets: number | null;
  reps: number | null;
  weight: number | null;
  duration: number | null; // in seconds
  notes: string | null;
  date: string;
}

interface WorkoutLoggerClientProps {
  initialExercises: Exercise[];
  initialLogs: any[]; // DB logs
}

export default function WorkoutLoggerClient({ initialExercises, initialLogs }: WorkoutLoggerClientProps) {
  const [logs, setLogs] = useState<WorkoutLog[]>(initialLogs);
  const [exercises] = useState<Exercise[]>(initialExercises);
  const [mounted, setMounted] = useState(false);

  // Form State
  const [exerciseId, setExerciseId] = useState(exercises[0]?.id || "");
  const [sets, setSets] = useState("3");
  const [reps, setReps] = useState("10");
  const [weight, setWeight] = useState("");
  const [durationMins, setDurationMins] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const exerciseMap = useMemo(() => {
    return new Map(exercises.map((e) => [e.id, e]));
  }, [exercises]);

  const handleLogWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!exerciseId) {
      setError("Please select an exercise from the library.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/workout-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exerciseId,
          sets: sets ? parseInt(sets) : null,
          reps: reps ? parseInt(reps) : null,
          weight: weight ? parseFloat(weight) : null,
          duration: durationMins ? parseInt(durationMins) * 60 : null,
          notes: notes || null,
          date: date || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to log workout");

      setLogs([data, ...logs]);
      setSuccess("Workout logged successfully!");
      
      // Reset parts of form
      setWeight("");
      setDurationMins("");
      setNotes("");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this workout log?")) return;
    setError("");
    try {
      const res = await fetch(`/api/workout-log?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete log");

      setLogs(logs.filter((l) => l.id !== id));
      setSuccess("Workout log removed.");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  // Recharts: Aggregate total sets logged over the past 7 days
  const chartData = useMemo(() => {
    const dataMap = new Map<string, number>();
    
    // Create last 7 days entries
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
      dataMap.set(key, 0);
    }
    
    // Accumulate total sets
    logs.forEach((log) => {
      const key = new Date(log.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
      if (dataMap.has(key)) {
        const added = log.sets || 1;
        dataMap.set(key, dataMap.get(key)! + added);
      }
    });
    
    return Array.from(dataMap.entries()).map(([date, sets]) => ({
      date,
      Sets: sets,
    }));
  }, [logs]);

  return (
    <div className="logger-page-wrapper">
      <div>
        <h2 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>Workout Logger</h2>
        <p style={{ color: "var(--text-muted)" }}>
          Log your training volumes and evaluate your progress indicators
        </p>
      </div>

      {/* Notices */}
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

      {/* Chart Panel */}
      <div className="logger-chart-card glass-panel">
        <h3 style={{ fontSize: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <ChartIcon size={20} style={{ color: "var(--accent-pink)" }} />
          <span>Weekly Sets Volume</span>
        </h3>
        
        <div className="logger-chart-container">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis 
                  dataKey="date" 
                  stroke="var(--text-secondary)" 
                  fontSize={11} 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="var(--text-secondary)" 
                  fontSize={11} 
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: "var(--bg-secondary)", 
                    borderColor: "var(--border-light)",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--text-primary)",
                    fontSize: "0.85rem"
                  }} 
                />
                <Bar dataKey="Sets" fill="var(--accent-pink)" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === chartData.length - 1 ? "url(#purplePinkGrad)" : "var(--accent-purple)"} 
                    />
                  ))}
                </Bar>
                <defs>
                  <linearGradient id="purplePinkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.9}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Loading Chart...</div>
          )}
        </div>
      </div>

      {/* Form Split Layout */}
      <div className="logger-layout-split">
        {/* Logger Input Form */}
        <div className="logger-form-card glass-panel">
          <h3 style={{ fontSize: "1.25rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-heading)" }}>
            <Plus size={18} style={{ color: "var(--accent-purple)" }} />
            <span>Log Exercise</span>
          </h3>
          
          <form onSubmit={handleLogWorkout} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Exercise Movement</label>
              <select
                className="locator-select-field"
                style={{ width: "100%", height: "42px" }}
                value={exerciseId}
                onChange={(e) => setExerciseId(e.target.value)}
                required
              >
                <option value="">-- Choose Exercise --</option>
                {exercises.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name} ({ex.muscleGroup.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Sets</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  placeholder="e.g. 3"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Reps</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  placeholder="e.g. 10"
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Weight (kg)</label>
                <input 
                  type="number" 
                  step="any"
                  className="form-input" 
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g. 60"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Duration (mins)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={durationMins}
                  onChange={(e) => setDurationMins(e.target.value)}
                  placeholder="e.g. 10"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Date</label>
              <input 
                type="date" 
                className="form-input" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Notes / Feedback</label>
              <textarea 
                className="form-input" 
                style={{ resize: "none", height: "70px" }}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Felt strong today, increased weight in 3rd set"
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%" }}>
              {loading ? "Recording..." : "Log Workout Session"}
            </button>
          </form>
        </div>

        {/* History log column */}
        <div className="logger-history-card glass-panel">
          <h3 style={{ fontSize: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Clipboard size={18} style={{ color: "var(--accent-emerald)" }} />
            <span>Activity History</span>
          </h3>

          {logs.length === 0 ? (
            <div style={{ padding: "4rem 0", textAlign: "center", color: "var(--text-muted)" }}>
              No workout logs found. Use the panel on the left to record your activities.
            </div>
          ) : (
            <div className="logs-list">
              {logs.map((log) => {
                const exercise = exerciseMap.get(log.exerciseId);
                return (
                  <div key={log.id} className="log-item-card glass-panel">
                    <div className="log-item-meta">
                      <span className="log-item-title">
                        {exercise ? exercise.name : "Logged Activity"}
                      </span>
                      <span className="log-item-specs">
                        {log.weight !== null && <span>{log.weight} kg &bull; </span>}
                        {log.sets !== null && <span>{log.sets} sets &bull; </span>}
                        {log.reps !== null && <span>{log.reps} reps </span>}
                        {log.duration !== null && (
                          <span>&bull; {Math.round(log.duration / 60)} mins</span>
                        )}
                      </span>
                      
                      <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                        <Calendar size={12} />
                        <span>
                          {new Date(log.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      {log.notes && (
                        <p className="log-item-notes">"{log.notes}"</p>
                      )}
                    </div>

                    <button 
                      onClick={() => handleDeleteLog(log.id)}
                      style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
                      aria-label="Delete Log"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
