"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  TrendingUp, 
  Plus, 
  Trash2, 
  Calendar,
  Activity,
  Ruler
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";
import "./progress.css";

interface ProgressEntry {
  id: string;
  weight: number | null;
  bodyFat: number | null;
  chest: number | null;
  waist: number | null;
  hips: number | null;
  biceps: number | null;
  thighs: number | null;
  notes: string | null;
  date: string;
}

interface ProgressTrackerClientProps {
  initialEntries: any[];
}

export default function ProgressTrackerClient({ initialEntries }: ProgressTrackerClientProps) {
  const [entries, setEntries] = useState<ProgressEntry[]>(initialEntries);
  const [mounted, setMounted] = useState(false);

  // Form State
  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [chest, setChest] = useState("");
  const [waist, setWaist] = useState("");
  const [hips, setHips] = useState("");
  const [biceps, setBiceps] = useState("");
  const [thighs, setThighs] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!weight && !bodyFat && !chest && !waist && !hips && !biceps && !thighs) {
      setError("Please log at least one physical metric.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weight: weight ? parseFloat(weight) : null,
          bodyFat: bodyFat ? parseFloat(bodyFat) : null,
          chest: chest ? parseFloat(chest) : null,
          waist: waist ? parseFloat(waist) : null,
          hips: hips ? parseFloat(hips) : null,
          biceps: biceps ? parseFloat(biceps) : null,
          thighs: thighs ? parseFloat(thighs) : null,
          notes: notes || null,
          date: date || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save entry");

      setEntries([data, ...entries]);
      setSuccess("Physical progress log logged!");
      
      // Reset form
      setWeight("");
      setBodyFat("");
      setChest("");
      setWaist("");
      setHips("");
      setBiceps("");
      setThighs("");
      setNotes("");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this metrics entry?")) return;
    setError("");
    try {
      const res = await fetch(`/api/progress?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete entry");

      setEntries(entries.filter((e) => e.id !== id));
      setSuccess("Progress entry removed.");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  // Recharts: Sort entries chronologically for line charts (oldest to newest)
  const chartData = useMemo(() => {
    return [...entries]
      .reverse()
      .map((entry) => ({
        date: new Date(entry.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
        weight: entry.weight,
        bodyFat: entry.bodyFat,
      }))
      .filter((item) => item.weight !== null || item.bodyFat !== null);
  }, [entries]);

  return (
    <div className="progress-page-wrapper">
      <div>
        <h2 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>Body Progress Tracker</h2>
        <p style={{ color: "var(--text-muted)" }}>
          Log weight, body fat %, and tape dimensions to trace composition curves
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

      {/* Recharts Chart Panel */}
      <div className="progress-chart-card glass-panel">
        <h3 style={{ fontSize: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <TrendingUp size={20} style={{ color: "var(--accent-purple)" }} />
          <span>Composition Curve Trends</span>
        </h3>

        <div className="progress-chart-container">
          {mounted ? (
            chartData.length === 0 ? (
              <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Add measurements below to generate trend curves.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="var(--text-secondary)" 
                    fontSize={11}
                    tickLine={false}
                  />
                  {/* Left YAxis: Weight (kg) */}
                  <YAxis 
                    yAxisId="left"
                    stroke="var(--accent-purple)"
                    fontSize={11}
                    tickLine={false}
                    label={{ value: "Weight (kg)", angle: -90, position: "insideLeft", fill: "var(--accent-purple)", style: { fontSize: 10 } }}
                  />
                  {/* Right YAxis: Body Fat (%) */}
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    stroke="var(--accent-pink)"
                    fontSize={11}
                    tickLine={false}
                    label={{ value: "Body Fat (%)", angle: 90, position: "insideRight", fill: "var(--accent-pink)", style: { fontSize: 10 } }}
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
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="weight" 
                    name="Weight (kg)"
                    stroke="var(--accent-purple)" 
                    strokeWidth={2}
                    activeDot={{ r: 6 }} 
                    connectNulls
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="bodyFat" 
                    name="Body Fat (%)"
                    stroke="var(--accent-pink)" 
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                    connectNulls
                  />
                </LineChart>
              </ResponsiveContainer>
            )
          ) : (
            <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Loading Chart...</div>
          )}
        </div>
      </div>

      {/* Form Split Layout */}
      <div className="progress-layout-split">
        {/* Progress Input Form */}
        <div className="progress-form-card glass-panel">
          <h3 style={{ fontSize: "1.25rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-heading)" }}>
            <Plus size={18} style={{ color: "var(--accent-purple)" }} />
            <span>Log Measurements</span>
          </h3>

          <form onSubmit={handleAddEntry} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Weight (kg)</label>
                <input 
                  type="number" 
                  step="any"
                  className="form-input" 
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g. 74.5"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Body Fat (%)</label>
                <input 
                  type="number" 
                  step="any"
                  className="form-input" 
                  value={bodyFat}
                  onChange={(e) => setBodyFat(e.target.value)}
                  placeholder="e.g. 15.4"
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Chest (cm)</label>
                <input 
                  type="number" 
                  step="any"
                  className="form-input" 
                  value={chest}
                  onChange={(e) => setChest(e.target.value)}
                  placeholder="Chest"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Waist (cm)</label>
                <input 
                  type="number" 
                  step="any"
                  className="form-input" 
                  value={waist}
                  onChange={(e) => setWaist(e.target.value)}
                  placeholder="Waist"
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: "0.8rem" }}>Hips (cm)</label>
                <input 
                  type="number" 
                  step="any"
                  className="form-input" 
                  value={hips}
                  onChange={(e) => setHips(e.target.value)}
                  placeholder="Hips"
                />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: "0.8rem" }}>Biceps (cm)</label>
                <input 
                  type="number" 
                  step="any"
                  className="form-input" 
                  value={biceps}
                  onChange={(e) => setBiceps(e.target.value)}
                  placeholder="Biceps"
                />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: "0.8rem" }}>Thighs (cm)</label>
                <input 
                  type="number" 
                  step="any"
                  className="form-input" 
                  value={thighs}
                  onChange={(e) => setThighs(e.target.value)}
                  placeholder="Thighs"
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
              <label className="form-label">Notes / Logs</label>
              <textarea 
                className="form-input" 
                style={{ resize: "none", height: "60px" }}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Weigh-in morning empty stomach"
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%" }}>
              {loading ? "Saving..." : "Save Progress Metrics"}
            </button>
          </form>
        </div>

        {/* History Details Table */}
        <div className="progress-history-section">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Ruler size={18} style={{ color: "var(--accent-emerald)" }} />
            <h3 style={{ fontSize: "1.25rem", margin: 0 }}>Metrics Logs</h3>
          </div>

          {entries.length === 0 ? (
            <div className="glass-panel" style={{ padding: "4rem 0", textAlign: "center", color: "var(--text-muted)" }}>
              No measurements logged yet. Use the panel on the left to start tracking.
            </div>
          ) : (
            <div className="payment-history-table-wrapper glass-panel">
              <table className="payment-history-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Weight</th>
                    <th>Body Fat</th>
                    <th>Waist</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry.id}>
                      <td>
                        {new Date(entry.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </td>
                      <td style={{ fontWeight: 600 }}>{entry.weight ? `${entry.weight} kg` : "--"}</td>
                      <td>{entry.bodyFat ? `${entry.bodyFat}%` : "--"}</td>
                      <td>{entry.waist ? `${entry.waist} cm` : "--"}</td>
                      <td>
                        <button 
                          onClick={() => handleDeleteEntry(entry.id)}
                          style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
                          aria-label="Delete Entry"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
