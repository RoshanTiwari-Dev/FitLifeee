"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Dumbbell, 
  Flame, 
  Droplet, 
  Plus, 
  Trash2, 
  Ruler, 
  Coffee,
  CheckCircle,
  X,
  Target,
  TrendingUp,
  Lock
} from "lucide-react";
import "./plus.css";

interface CalorieLog {
  id?: string;
  caloriesConsumed: number;
  caloriesBurned: number;
  waterIntakeMl: number;
  date: string;
}

interface StepLog {
  id?: string;
  steps: number;
  target: number;
  date: string;
}

interface DietPlanItem {
  id: string;
  day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
  mealType: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";
  foodName: string;
  calories: number;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
}

interface FiTLiFePlusClientProps {
  initialCalorieLog: CalorieLog;
  initialStepLog: StepLog;
  initialDietPlans: DietPlanItem[];
  isGuest?: boolean;
}

export default function FiTLiFePlusClient({
  initialCalorieLog,
  initialStepLog,
  initialDietPlans,
  isGuest = false,
}: FiTLiFePlusClientProps) {
  const [activeTab, setActiveTab] = useState<"DAILY" | "DIET">("DAILY");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  // Calorie & Steps Logs State
  const [calorieLog, setCalorieLog] = useState<CalorieLog>(initialCalorieLog);
  const [stepLog, setStepLog] = useState<StepLog>(initialStepLog);
  const [dietPlans, setDietPlans] = useState<DietPlanItem[]>(initialDietPlans);

  // Quick log states
  const [addCalories, setAddCalories] = useState("");
  const [addBurned, setAddBurned] = useState("");
  const [stepInput, setStepInput] = useState(initialStepLog.steps.toString());
  const [stepTargetInput, setStepTargetInput] = useState(initialStepLog.target.toString());

  // Meal Modal Form State
  const [showMealModal, setShowMealModal] = useState(false);
  const [targetMealDay, setTargetMealDay] = useState<DietPlanItem["day"]>("MONDAY");
  const [mealType, setMealType] = useState<DietPlanItem["mealType"]>("BREAKFAST");
  const [foodName, setFoodName] = useState("");
  const [foodCalories, setFoodCalories] = useState("");
  const [foodProtein, setFoodProtein] = useState("");
  const [foodCarbs, setFoodCarbs] = useState("");
  const [foodFat, setFoodFat] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Targets (Standard/User defined)
  const calorieTarget = 2000; // base target

  const handleUpdateCalories = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (isGuest) {
      setShowUpgradeModal(true);
      return;
    }
    const newConsumed = calorieLog.caloriesConsumed + (addCalories ? parseInt(addCalories) : 0);
    const newBurned = calorieLog.caloriesBurned + (addBurned ? parseInt(addBurned) : 0);

    try {
      const res = await fetch("/api/plus/calorie-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caloriesConsumed: newConsumed,
          caloriesBurned: newBurned,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update calorie logs");
      setCalorieLog(data);
      setAddCalories("");
      setAddBurned("");
      setSuccess("Daily calories updated!");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  const handleAddWater = async (amountMl: number) => {
    setError("");
    if (isGuest) {
      setShowUpgradeModal(true);
      return;
    }
    const newWater = Math.max(0, calorieLog.waterIntakeMl + amountMl);
    try {
      const res = await fetch("/api/plus/calorie-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          waterIntakeMl: newWater,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update water intake");
      setCalorieLog(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdateSteps = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (isGuest) {
      setShowUpgradeModal(true);
      return;
    }
    try {
      const res = await fetch("/api/plus/step-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          steps: parseInt(stepInput) || 0,
          target: parseInt(stepTargetInput) || 10000,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to log steps");
      setStepLog(data);
      setSuccess("Daily step logs saved!");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!foodName || !foodCalories) {
      setError("Food name and calories are required.");
      return;
    }
    if (isGuest) {
      setShowMealModal(false);
      setShowUpgradeModal(true);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/plus/diet-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          day: targetMealDay,
          mealType,
          foodName,
          calories: parseInt(foodCalories),
          protein: foodProtein ? parseFloat(foodProtein) : null,
          carbs: foodCarbs ? parseFloat(foodCarbs) : null,
          fat: foodFat ? parseFloat(foodFat) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add meal");

      setDietPlans([...dietPlans, data]);
      setSuccess(`Meal added to ${targetMealDay}!`);
      setShowMealModal(false);

      // Reset fields
      setFoodName("");
      setFoodCalories("");
      setFoodProtein("");
      setFoodCarbs("");
      setFoodFat("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMeal = async (id: string) => {
    if (isGuest) {
      setShowUpgradeModal(true);
      return;
    }
    if (!confirm("Are you sure you want to remove this meal item?")) return;
    setError("");
    try {
      const res = await fetch(`/api/plus/diet-plan?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete meal");
      setDietPlans(dietPlans.filter((item) => item.id !== id));
      setSuccess("Meal item removed.");
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Group diet plan items by day
  const dietByDay = useMemo(() => {
    const days: Record<DietPlanItem["day"], DietPlanItem[]> = {
      MONDAY: [],
      TUESDAY: [],
      WEDNESDAY: [],
      THURSDAY: [],
      FRIDAY: [],
      SATURDAY: [],
      SUNDAY: [],
    };
    dietPlans.forEach((item) => {
      if (days[item.day]) {
        days[item.day].push(item);
      }
    });
    return days;
  }, [dietPlans]);

  // Compute daily totals
  const dayCalorieTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    Object.keys(dietByDay).forEach((dayKey) => {
      totals[dayKey] = dietByDay[dayKey as DietPlanItem["day"]].reduce((sum, item) => sum + item.calories, 0);
    });
    return totals;
  }, [dietByDay]);

  // SVG Gauge helpers
  const getCircleOffset = (value: number, max: number) => {
    const radius = 40;
    const circ = 2 * Math.PI * radius;
    const pct = Math.min(100, Math.max(0, Math.round((value / max) * 100)));
    return circ - (pct / 100) * circ;
  };

  return (
    <div className="plus-wrapper">
      {isGuest && (
        <div className="glass-panel" style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between", 
          padding: "1.25rem 2rem", 
          background: "linear-gradient(135deg, rgba(138, 43, 226, 0.1) 0%, rgba(255, 20, 147, 0.1) 100%)",
          borderColor: "rgba(138, 43, 226, 0.3)",
          borderRadius: "var(--radius-md)",
          marginBottom: "0.5rem",
          gap: "1rem",
          flexWrap: "wrap",
          boxShadow: "var(--shadow-purple-glow)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Sparkles size={20} style={{ color: "var(--accent-purple)", flexShrink: 0 }} />
            <div>
              <strong style={{ display: "block", fontSize: "0.95rem", color: "var(--text-primary)" }}>✨ Guest Mode Preview</strong>
              <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                Explore tracking meters, steps wheels, and weekly diet planners. Upgrade to save your inputs!
              </span>
            </div>
          </div>
          <button onClick={() => setShowUpgradeModal(true)} className="btn btn-primary btn-sm">
            Upgrade to Plus
          </button>
        </div>
      )}

      <div className="plus-unlocked-header">
        <div>
          <h2 style={{ fontSize: "1.75rem", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Sparkles size={24} style={{ color: "var(--accent-purple)" }} />
            <span>FiTLiFe Plus Workspaces</span>
          </h2>
          <p style={{ color: "var(--text-muted)" }}>
            Unlock daily nutrition calorie meters, custom meal plans, and step trackers
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="catalog-tabs" style={{ justifyContent: "flex-start", marginBottom: "1.5rem" }}>
        <button 
          onClick={() => setActiveTab("DAILY")} 
          className={`catalog-tab ${activeTab === "DAILY" ? "active" : ""}`}
          style={{ background: "none", border: "none" }}
        >
          Daily Log (Calories & Steps)
        </button>
        <button 
          onClick={() => setActiveTab("DIET")} 
          className={`catalog-tab ${activeTab === "DIET" ? "active" : ""}`}
          style={{ background: "none", border: "none" }}
        >
          Weekly Diet Planner
        </button>
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

      {/* TAB 1: DAILY TRACKER */}
      {activeTab === "DAILY" && (
        <div className="plus-dashboard-grid">
          
          {/* Progress gauges */}
          <div className="plus-tracking-card glass-panel">
            <h3 style={{ fontSize: "1.25rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.75rem", fontFamily: "var(--font-heading)" }}>
              Daily Progress
            </h3>

            <div className="plus-circular-indicators">
              {/* Calories Ring */}
              <div className="plus-indicator-item">
                <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="100" height="100" className="goal-ring-svg">
                    <circle className="goal-ring-circle-bg" strokeWidth="6" r="40" cx="50" cy="50" />
                    <circle 
                      className="goal-ring-circle-progress type-weight" 
                      strokeWidth="6" 
                      r="40" 
                      cx="50" 
                      cy="50" 
                      strokeDasharray={`${2*Math.PI*40}`}
                      strokeDashoffset={getCircleOffset(calorieLog.caloriesConsumed, calorieTarget)}
                    />
                  </svg>
                  <div style={{ position: "absolute", fontSize: "0.95rem", fontWeight: 700 }}>
                    {Math.round((calorieLog.caloriesConsumed / calorieTarget) * 100)}%
                  </div>
                </div>
                <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Nutrition Calories</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {calorieLog.caloriesConsumed} / {calorieTarget} kcal
                </span>
              </div>

              {/* Steps Ring */}
              <div className="plus-indicator-item">
                <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="100" height="100" className="goal-ring-svg">
                    <circle className="goal-ring-circle-bg" strokeWidth="6" r="40" cx="50" cy="50" />
                    <circle 
                      className="goal-ring-circle-progress type-endurance" 
                      strokeWidth="6" 
                      r="40" 
                      cx="50" 
                      cy="50" 
                      strokeDasharray={`${2*Math.PI*40}`}
                      strokeDashoffset={getCircleOffset(stepLog.steps, stepLog.target)}
                    />
                  </svg>
                  <div style={{ position: "absolute", fontSize: "0.95rem", fontWeight: 700 }}>
                    {Math.round((stepLog.steps / stepLog.target) * 100)}%
                  </div>
                </div>
                <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Steps Counted</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {stepLog.steps} / {stepLog.target}
                </span>
              </div>
            </div>

            {/* Burned calories meta */}
            <div style={{ display: "flex", justifyContent: "space-between", background: "rgba(255,255,255,0.015)", border: "1px solid var(--border-light)", padding: "1rem", borderRadius: "var(--radius-sm)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Flame size={16} style={{ color: "var(--accent-pink)" }} />
                <span style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>Net Calories Burned:</span>
              </div>
              <span style={{ fontWeight: 700, color: "var(--accent-pink)" }}>{calorieLog.caloriesBurned} kcal</span>
            </div>

            {/* Water logger */}
            <div className="plus-water-tracker">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h4 style={{ fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Droplet size={16} style={{ color: "var(--accent-emerald)" }} />
                  <span>Water Intake Tracker</span>
                </h4>
                <span className="plus-water-value">{calorieLog.waterIntakeMl} ml</span>
              </div>
              <div className="plus-water-controls">
                <button onClick={() => handleAddWater(250)} className="btn btn-secondary btn-sm" style={{ flexGrow: 1 }}>+ Cup (250ml)</button>
                <button onClick={() => handleAddWater(1000)} className="btn btn-secondary btn-sm" style={{ flexGrow: 1 }}>+ Bottle (1L)</button>
                <button onClick={() => handleAddWater(-250)} className="btn btn-secondary btn-sm" style={{ color: "var(--text-muted)" }}>-</button>
              </div>
            </div>
          </div>

          {/* Quick Logs Forms Card */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {/* Log Calories */}
            <div className="glass-panel" style={{ padding: "2rem" }}>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-heading)" }}>
                <Coffee size={18} style={{ color: "var(--accent-purple)" }} />
                <span>Log Calories & Workouts</span>
              </h3>
              <form onSubmit={handleUpdateCalories} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className="form-group">
                    <label className="form-label">Add Consumed Calories</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      placeholder="e.g., 350 kcal"
                      value={addCalories}
                      onChange={(e) => setAddCalories(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Add Burned Calories</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      placeholder="e.g., 200 kcal"
                      value={addBurned}
                      onChange={(e) => setAddBurned(e.target.value)}
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-sm">Add Logs</button>
              </form>
            </div>

            {/* Log Steps */}
            <div className="glass-panel" style={{ padding: "2rem" }}>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-heading)" }}>
                <TrendingUp size={18} style={{ color: "var(--accent-emerald)" }} />
                <span>Update Steps Target</span>
              </h3>
              <form onSubmit={handleUpdateSteps} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className="form-group">
                    <label className="form-label">Steps Walked Today</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      placeholder="e.g., 8500"
                      value={stepInput}
                      onChange={(e) => setStepInput(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Daily Goal Target</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      placeholder="e.g., 10000"
                      value={stepTargetInput}
                      onChange={(e) => setStepTargetInput(e.target.value)}
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-secondary btn-sm">Save Steps</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WEEKLY DIET PLANNER */}
      {activeTab === "DIET" && (
        <div className="plus-diet-grid">
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "1.35rem", margin: 0, fontFamily: "var(--font-heading)" }}>Weekly Meal Splits</h3>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Target Base Intake: {calorieTarget} kcal / Day</span>
          </div>

          {Object.keys(dietByDay).map((dayKey) => {
            const meals = dietByDay[dayKey as DietPlanItem["day"]];
            const dailySum = dayCalorieTotals[dayKey];

            return (
              <div key={dayKey} className="plus-diet-day-card glass-panel">
                <div className="plus-diet-day-header">
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span className="plus-diet-day-name">{dayKey.slice(0, 3)}</span>
                    <span>&bull;</span>
                    <span className="plus-diet-day-calories">{dailySum} kcal / {calorieTarget} kcal</span>
                  </div>
                  <button 
                    onClick={() => {
                      setTargetMealDay(dayKey as DietPlanItem["day"]);
                      setShowMealModal(true);
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: "0.3rem 0.75rem", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "3px" }}
                  >
                    <Plus size={12} />
                    <span>Add Meal</span>
                  </button>
                </div>

                {meals.length === 0 ? (
                  <div style={{ color: "var(--text-muted)", fontSize: "0.88rem", padding: "0.5rem 0" }}>
                    No meals logged for this day yet. Plan ahead!
                  </div>
                ) : (
                  <div className="plus-meals-list">
                    {meals.map((meal) => (
                      <div key={meal.id} className="plus-meal-item">
                        <div className="plus-meal-meta">
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <span className={`plus-meal-type-tag tag-${meal.mealType.toLowerCase()}`}>
                              {meal.mealType}
                            </span>
                            <span className="plus-meal-title">{meal.foodName}</span>
                          </div>
                          
                          {/* Macros metrics summary */}
                          {(meal.protein || meal.carbs || meal.fat) && (
                            <div className="plus-macros-bar">
                              {meal.protein !== null && <span className="plus-macro-indicator">P: {meal.protein}g</span>}
                              {meal.carbs !== null && <span className="plus-macro-indicator">C: {meal.carbs}g</span>}
                              {meal.fat !== null && <span className="plus-macro-indicator">F: {meal.fat}g</span>}
                            </div>
                          )}
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                          <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--accent-pink)" }}>
                            {meal.calories} kcal
                          </span>
                          <button 
                            onClick={() => handleDeleteMeal(meal.id)}
                            style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
                            aria-label="Remove Meal"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Dialog Form to Log Meal */}
      {showMealModal && (
        <div className="plus-modal-overlay">
          <div className="plus-modal-card glass-panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.25rem", margin: 0, fontFamily: "var(--font-heading)" }}>Log Meal to {targetMealDay}</h3>
              <button 
                onClick={() => setShowMealModal(false)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddMeal} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Meal Split Type</label>
                <select
                  className="locator-select-field"
                  style={{ width: "100%", height: "42px" }}
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value as DietPlanItem["mealType"])}
                  required
                >
                  <option value="BREAKFAST">Breakfast</option>
                  <option value="LUNCH">Lunch</option>
                  <option value="DINNER">Dinner</option>
                  <option value="SNACK">Snack</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Food / Meal Item Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Scrambled eggs, Protein shake" 
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Calories (kcal)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  placeholder="Calories" 
                  value={foodCalories}
                  onChange={(e) => setFoodCalories(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: "0.8rem" }}>Protein (g)</label>
                  <input 
                    type="number" 
                    step="any"
                    className="form-input" 
                    placeholder="g" 
                    value={foodProtein}
                    onChange={(e) => setFoodProtein(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: "0.8rem" }}>Carbs (g)</label>
                  <input 
                    type="number" 
                    step="any"
                    className="form-input" 
                    placeholder="g" 
                    value={foodCarbs}
                    onChange={(e) => setFoodCarbs(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: "0.8rem" }}>Fat (g)</label>
                  <input 
                    type="number" 
                    step="any"
                    className="form-input" 
                    placeholder="g" 
                    value={foodFat}
                    onChange={(e) => setFoodFat(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%", marginTop: "1rem" }}>
                {loading ? "Adding..." : "Log Meal"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Premium Upgrade Modal */}
      {showUpgradeModal && (
        <div className="plus-modal-overlay" onClick={() => setShowUpgradeModal(false)}>
          <div className="plus-modal-card glass-panel animate-scaleUp" onClick={(e) => e.stopPropagation()} style={{ textAlign: "center", padding: "2.5rem 2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <div style={{ alignSelf: "flex-end", margin: "-1rem -0.5rem 0 0" }}>
              <button 
                onClick={() => setShowUpgradeModal(false)} 
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="plus-locked-icon-wrapper animate-float" style={{ margin: "0 auto", background: "linear-gradient(135deg, var(--accent-purple), var(--accent-pink))", width: "60px", height: "60px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", boxShadow: "var(--shadow-purple-glow)", border: "none" }}>
              <Lock size={24} />
            </div>

            <h3 style={{ fontSize: "1.5rem", fontWeight: 800, textAlign: "center", fontFamily: "var(--font-heading)" }}>
              Upgrade to FiTLiFe Plus
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6, textAlign: "center", marginBottom: "0.75rem" }}>
              Unlock the ability to track daily calories consumed, log step count objectives, monitor water intake, and save weekly diet schedules.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%" }}>
              <Link 
                href="/#plans" 
                className="btn btn-primary" 
                style={{ width: "100%", textDecoration: "none", display: "block", textAlign: "center" }}
                onClick={() => setShowUpgradeModal(false)}
              >
                View Premium Plans
              </Link>
              <button 
                onClick={() => setShowUpgradeModal(false)} 
                className="btn btn-secondary" 
                style={{ width: "100%" }}
              >
                Keep Exploring
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
