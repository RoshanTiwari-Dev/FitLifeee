"use client";

import React, { useState } from "react";
import { Calculator, Sparkles, Flame, Heart, Target, ArrowRight } from "lucide-react";

export default function CalorieCalculator() {
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("175");
  const [age, setAge] = useState("25");
  const [gender, setGender] = useState("male");
  const [activity, setActivity] = useState("1.55"); // moderate active
  const [goal, setGoal] = useState("lose"); // fat loss

  const [results, setResults] = useState<{
    bmr: number;
    tdee: number;
    target: number;
  } | null>(null);

  const calculateCalorieStats = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age);

    if (!w || !h || !a) return;

    // Harris-Benedict Formula (Mifflin-St Jeor equation)
    let bmrVal = 0;
    if (gender === "male") {
      bmrVal = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmrVal = 10 * w + 6.25 * h - 5 * a - 161;
    }

    const tdeeVal = bmrVal * parseFloat(activity);

    let targetVal = tdeeVal;
    if (goal === "lose") {
      targetVal = tdeeVal - 500;
    } else if (goal === "gain") {
      targetVal = tdeeVal + 350;
    }

    setResults({
      bmr: Math.round(bmrVal),
      tdee: Math.round(tdeeVal),
      target: Math.round(targetVal),
    });
  };

  return (
    <div className="responsive-grid" style={{ alignItems: "start", marginTop: "2rem" }}>
      {/* Input Form */}
      <div className="glass-panel" style={{ padding: "2rem" }}>
        <h3 style={{ fontSize: "1.25rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-heading)" }}>
          <Calculator size={18} style={{ color: "var(--accent-pink)" }} />
          <span>Stats Calculator</span>
        </h3>
        
        <form onSubmit={calculateCalorieStats} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Weight (kg)</label>
              <input
                type="number"
                className="form-input"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Height (cm)</label>
              <input
                type="number"
                className="form-input"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Age (years)</label>
              <input
                type="number"
                className="form-input"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select
                className="locator-select-field"
                style={{ width: "100%", height: "42px" }}
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Activity Level</label>
            <select
              className="locator-select-field"
              style={{ width: "100%", height: "42px" }}
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
            >
              <option value="1.2">Sedentary (Little/no exercise)</option>
              <option value="1.375">Lightly Active (Exercise 1-3 days/wk)</option>
              <option value="1.55">Moderately Active (Exercise 3-5 days/wk)</option>
              <option value="1.725">Very Active (Hard exercise 6-7 days/wk)</option>
              <option value="1.9">Extra Active (Heavy physical job/twice daily)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Fitness Goal</label>
            <select
              className="locator-select-field"
              style={{ width: "100%", height: "42px" }}
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            >
              <option value="lose">Fat Loss (Weight Deficit)</option>
              <option value="maintain">Maintain Current Weight</option>
              <option value="gain">Gain Muscle (Weight Surplus)</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            Calculate Calorie Needs
          </button>
        </form>
      </div>

      {/* Results / Marketing Output */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", height: "100%" }}>
        {results ? (
          <div className="glass-panel" style={{ padding: "2rem", border: "1px solid var(--border-glow)", background: "rgba(139, 92, 246, 0.02)" }}>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "1rem", color: "var(--accent-purple)", fontFamily: "var(--font-heading)" }}>
              Calculation Results
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.5rem" }}>
                <span style={{ color: "var(--text-secondary)" }}>BMR (Basal Metabolism)</span>
                <span style={{ fontWeight: 700 }}>{results.bmr} kcal</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.5rem" }}>
                <span style={{ color: "var(--text-secondary)" }}>TDEE (Daily Burn)</span>
                <span style={{ fontWeight: 700 }}>{results.tdee} kcal</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "0.5rem", alignItems: "center" }}>
                <span style={{ color: "#fff", fontWeight: 600 }}>Target Daily Calories</span>
                <span style={{ fontSize: "1.45rem", fontWeight: 900, color: "var(--accent-pink)" }}>
                  {results.target} kcal/day
                </span>
              </div>
            </div>

            <div style={{ marginTop: "1.5rem", padding: "1rem", background: "rgba(255,255,255,0.015)", border: "1px dashed var(--border-light)", borderRadius: "var(--radius-sm)", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem", color: "var(--accent-purple)", fontWeight: 700 }}>
                <Sparkles size={14} />
                <span>Unlock Daily Logging</span>
              </div>
              Log these calculated targets inside the premium **FiTLiFe Plus** tracker dashboard. Map daily progress rings and design customized diet planner structures immediately with any plan!
            </div>
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: "3rem 2rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexGrow: 1 }}>
            <Calculator size={36} style={{ color: "var(--text-muted)", opacity: 0.3, marginBottom: "1rem" }} />
            <h4 style={{ color: "var(--text-secondary)", fontSize: "1.05rem" }}>Estimate Your Daily Target</h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", maxWidth: "300px", margin: "0.5rem auto 0 auto" }}>
              Input your height, weight, activity, and goals to calculate your recommended calorie targets.
            </p>
          </div>
        )}

        {/* Feature Advertising list card */}
        <div className="glass-panel" style={{ padding: "2rem" }}>
          <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Sparkles size={16} style={{ color: "var(--accent-purple)" }} />
            <span>Exclusive FiTLiFe Plus Features</span>
          </h3>

          <ul style={{ paddingLeft: "1.2rem", fontSize: "0.88rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
            <li><strong>Calorie Tracker:</strong> Monitor calories consumed, burned, and water cups daily.</li>
            <li><strong>Diet Planner:</strong> Set up meal splits (breakfast, lunch, dinner) from Monday to Sunday.</li>
            <li><strong>Step Counter:</strong> Update daily walks against a 10,000 steps objective.</li>
            <li><strong>Progress Rings:</strong> Visually tracking goals target completions.</li>
          </ul>

          <a href="#plans" className="btn btn-secondary btn-sm" style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
            <span>Unlock Plus Tools</span>
            <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
