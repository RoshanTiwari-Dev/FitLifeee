"use client";

import React, { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Search, Info, Dumbbell, Sparkles } from "lucide-react";
import "../workouts/workouts.css";

interface ExerciseItem {
  id: string;
  name: string;
  slug: string;
  muscleGroup: string;
  equipment: string;
  difficulty: string;
  instructions: string;
  tips: string; // JSON string
  videoUrl: string | null;
  imageUrl: string | null;
}

interface ExercisesClientProps {
  exercises: ExerciseItem[];
}

export default function ExercisesClient({ exercises }: ExercisesClientProps) {
  const [search, setSearch] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("all");
  const [selectedEquipment, setSelectedEquipment] = useState("all");

  // Dynamic filter options extraction
  const uniqueMuscles = useMemo(() => {
    return ["all", ...Array.from(new Set(exercises.map((e) => e.muscleGroup)))];
  }, [exercises]);

  const uniqueEquipments = useMemo(() => {
    return ["all", ...Array.from(new Set(exercises.map((e) => e.equipment)))];
  }, [exercises]);

  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const matchMuscle = selectedMuscle === "all" || ex.muscleGroup === selectedMuscle;
      const matchEquip = selectedEquipment === "all" || ex.equipment === selectedEquipment;
      const query = search.toLowerCase();
      const matchQuery =
        ex.name.toLowerCase().includes(query) ||
        ex.muscleGroup.toLowerCase().includes(query) ||
        ex.equipment.toLowerCase().includes(query) ||
        ex.instructions.toLowerCase().includes(query);
      return matchMuscle && matchEquip && matchQuery;
    });
  }, [exercises, search, selectedMuscle, selectedEquipment]);

  return (
    <>
      <Navbar />
      <main className="catalog-wrapper">
        <div className="container">
          <div className="catalog-header">
            <div className="hero-badge" style={{ marginBottom: "1rem" }}>
              <span>Exercises</span>
            </div>
            <h1 className="catalog-title">Exercises Library</h1>
            <p className="catalog-subtitle">
              Browse through our comprehensive library of movements. Perfect your form, target specific muscle groups, and customize your routine.
            </p>
          </div>

          {/* Navigation Tabs to toggle between Workouts & Exercises */}
          <div className="catalog-tabs">
            <Link href="/workouts" className="catalog-tab">
              Workout Plans
            </Link>
            <Link href="/exercises" className="catalog-tab active">
              Exercises Database
            </Link>
          </div>

          {/* Filter Bar */}
          <div className="catalog-filters">
            <div className="locator-search-input-wrapper">
              <Search size={18} className="locator-search-icon" />
              <input
                type="text"
                className="form-input locator-search-field"
                placeholder="Search exercises by name, instruction..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="locator-select-field"
              value={selectedMuscle}
              onChange={(e) => setSelectedMuscle(e.target.value)}
            >
              <option value="all">All Muscles</option>
              {uniqueMuscles.filter(m => m !== "all").map((m) => (
                <option key={m} value={m}>
                  {m.toUpperCase()}
                </option>
              ))}
            </select>

            <select
              className="locator-select-field"
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
            >
              <option value="all">All Equipment</option>
              {uniqueEquipments.filter(eq => eq !== "all").map((eq) => (
                <option key={eq} value={eq}>
                  {eq.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Exercises list */}
          {filteredExercises.length === 0 ? (
            <div style={{ textAlign: "center", padding: "5rem 2rem", color: "var(--text-secondary)" }}>
              <Dumbbell size={48} style={{ color: "var(--text-muted)", opacity: 0.4, margin: "0 auto 1.5rem auto" }} />
              <h3>No Exercises Found</h3>
              <p>Try modifying your filters or search term to discover other exercises.</p>
            </div>
          ) : (
            <div className="responsive-grid">
              {filteredExercises.map((ex) => {
                const instructionsList = ex.instructions.split("\n").filter(Boolean);
                const tipsList = JSON.parse(ex.tips) as string[];

                return (
                  <div key={ex.id} className="exercise-card glass-panel">
                    <div className="exercise-header-row">
                      <h3 className="exercise-card-title">{ex.name}</h3>
                      <span className={`badge badge-${ex.difficulty.toLowerCase() === "beginner" ? "success" : ex.difficulty.toLowerCase() === "intermediate" ? "gold" : "platinum"}`}>
                        {ex.difficulty}
                      </span>
                    </div>

                    <div className="exercise-badge-row">
                      <span className="badge badge-silver" style={{ textTransform: "uppercase", fontSize: "0.68rem" }}>
                        {ex.muscleGroup}
                      </span>
                      <span className="badge badge-silver" style={{ textTransform: "uppercase", fontSize: "0.68rem", opacity: 0.8 }}>
                        {ex.equipment}
                      </span>
                    </div>

                    <div style={{ flexGrow: 1 }}>
                      <h4 className="exercise-instructions-title">Instructions</h4>
                      <ol style={{ paddingLeft: "1.2rem", fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                        {instructionsList.slice(0, 3).map((step, idx) => (
                          <li key={idx} style={{ marginBottom: "0.25rem" }}>{step}</li>
                        ))}
                        {instructionsList.length > 3 && (
                          <li style={{ listStyle: "none", color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.25rem" }}>
                            +{instructionsList.length - 3} more steps...
                          </li>
                        )}
                      </ol>
                    </div>

                    {tipsList && tipsList.length > 0 && (
                      <div style={{ background: "rgba(139, 92, 246, 0.02)", border: "1px solid rgba(139, 92, 246, 0.1)", borderRadius: "var(--radius-sm)", padding: "0.75rem 1rem", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                        <Sparkles size={16} style={{ color: "var(--accent-purple)", flexShrink: 0, marginTop: "0.1rem" }} />
                        <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)", fontStyle: "italic" }}>
                          <strong>Trainer Tip:</strong> {tipsList[0]}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
