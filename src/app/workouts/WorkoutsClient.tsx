"use client";

import React, { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Search, Flame, Clock, Dumbbell, Award, ArrowRight } from "lucide-react";
import "./workouts.css";

interface WorkoutExerciseItem {
  id: string;
}

interface WorkoutPlanItem {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  difficulty: string | null;
  duration: number | null;
  calories: number | null;
  description: string | null;
  imageUrl: string | null;
  featured: boolean;
  exercises: WorkoutExerciseItem[];
}

interface WorkoutsClientProps {
  workoutPlans: WorkoutPlanItem[];
}

export default function WorkoutsClient({ workoutPlans }: WorkoutsClientProps) {
  const [search, setSearch] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Extract unique categories dynamically
  const uniqueCategories = useMemo(() => {
    const categories = workoutPlans.map((wp) => wp.category).filter(Boolean) as string[];
    return ["all", ...Array.from(new Set(categories))];
  }, [workoutPlans]);

  const filteredPlans = useMemo(() => {
    return workoutPlans.filter((wp) => {
      const matchDifficulty =
        selectedDifficulty === "all" ||
        wp.difficulty?.toLowerCase() === selectedDifficulty.toLowerCase();
      const matchCategory =
        selectedCategory === "all" ||
        wp.category?.toLowerCase() === selectedCategory.toLowerCase();
      const query = search.toLowerCase();
      const matchQuery =
        wp.name.toLowerCase().includes(query) ||
        (wp.category && wp.category.toLowerCase().includes(query)) ||
        (wp.description && wp.description.toLowerCase().includes(query));
      return matchDifficulty && matchCategory && matchQuery;
    });
  }, [workoutPlans, search, selectedDifficulty, selectedCategory]);

  return (
    <>
      <Navbar />
      <main className="catalog-wrapper">
        <div className="container">
          <div className="catalog-header">
            <div className="hero-badge" style={{ marginBottom: "1rem" }}>
              <span>Workouts</span>
            </div>
            <h1 className="catalog-title">Workout Templates</h1>
            <p className="catalog-subtitle">
              Ready-to-go, professionally designed training plans for every fitness goal and level. Follow step-by-step or use them for routine inspiration.
            </p>
          </div>

          {/* Navigation Tabs to toggle between Workouts & Exercises */}
          <div className="catalog-tabs">
            <Link href="/workouts" className="catalog-tab active">
              Workout Plans
            </Link>
            <Link href="/exercises" className="catalog-tab">
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
                placeholder="Search workouts by title, goal..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="locator-select-field"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              <option value="all">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <select
              className="locator-select-field"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {uniqueCategories.filter(c => c !== "all").map((cat) => (
                <option key={cat} value={cat.toLowerCase()}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Workouts Grid */}
          {filteredPlans.length === 0 ? (
            <div style={{ textAlign: "center", padding: "5rem 2rem", color: "var(--text-secondary)" }}>
              <Award size={48} style={{ color: "var(--text-muted)", opacity: 0.4, margin: "0 auto 1.5rem auto" }} />
              <h3>No Workouts Found</h3>
              <p>We couldn't find any workout routines matching your filters. Try search adjustments.</p>
            </div>
          ) : (
            <div className="workouts-grid">
              {filteredPlans.map((wp) => (
                <div key={wp.id} className="workout-card glass-panel">
                  <div className="workout-card-img-wrapper">
                    <div 
                      className="workout-card-img"
                      style={{
                        width: "100%",
                        height: "100%",
                        backgroundImage: `linear-gradient(to bottom, transparent, rgba(10, 9, 13, 0.95)), url(${wp.imageUrl || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                      }}
                    />
                    <div className="workout-card-overlay">
                      {wp.difficulty && (
                        <span className={`badge badge-${wp.difficulty.toLowerCase() === "beginner" ? "success" : wp.difficulty.toLowerCase() === "intermediate" ? "gold" : "platinum"}`}>
                          {wp.difficulty}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="workout-card-content">
                    {wp.category && (
                      <span className="badge badge-silver" style={{ alignSelf: "flex-start", fontSize: "0.68rem" }}>
                        {wp.category}
                      </span>
                    )}
                    <h3 className="workout-plan-name">{wp.name}</h3>
                    <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5, flexGrow: 1 }}>
                      {wp.description || "Start your target training routine today."}
                    </p>

                    <div className="workout-meta-grid">
                      <div>
                        <div className="workout-meta-label">Duration</div>
                        <div className="workout-meta-val">
                          {wp.duration ? `${wp.duration}m` : "--"}
                        </div>
                      </div>
                      <div>
                        <div className="workout-meta-label">Calories</div>
                        <div className="workout-meta-val">
                          {wp.calories ? `${wp.calories} kcal` : "--"}
                        </div>
                      </div>
                      <div>
                        <div className="workout-meta-label">Exercises</div>
                        <div className="workout-meta-val">
                          {wp.exercises.length}
                        </div>
                      </div>
                    </div>

                    <Link 
                      href={`/workouts/${wp.id}`} 
                      className="btn btn-secondary btn-sm"
                      style={{ display: "flex", width: "100%", justifyContent: "center", gap: "0.5rem" }}
                    >
                      <span>Start Workout</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
