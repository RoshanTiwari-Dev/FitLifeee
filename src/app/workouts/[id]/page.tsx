import React from "react";
import { db } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { 
  ArrowLeft, 
  Flame, 
  Clock, 
  Dumbbell, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle,
  HelpCircle
} from "lucide-react";
import "../workouts.css";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function WorkoutDetailPage({ params }: PageProps) {
  const { id } = await params;

  const plan = await db.workoutPlan.findUnique({
    where: {
      id,
    },
    include: {
      exercises: {
        orderBy: {
          order: "asc",
        },
        include: {
          exercise: true,
        },
      },
    },
  });

  if (!plan) {
    return (
      <>
        <Navbar />
        <main className="catalog-wrapper" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
          <div className="glass-panel" style={{ padding: "4rem 2rem", textAlign: "center", maxWidth: "500px" }}>
            <ShieldAlert size={48} style={{ color: "var(--accent-pink)", marginBottom: "1.5rem" }} />
            <h2 style={{ marginBottom: "1rem" }}>Workout Plan Not Found</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
              The requested workout plan does not exist or has been removed from our catalog databases.
            </p>
            <Link href="/workouts" className="btn btn-primary">
              Back to Catalog
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="workout-detail-wrapper">
        <div className="container">
          {/* Back Navigation Link */}
          <Link 
            href="/workouts" 
            style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: "0.5rem", 
              color: "var(--text-secondary)", 
              fontSize: "0.95rem",
              marginBottom: "2rem",
              fontWeight: 500
            }}
            className="navbar-link"
          >
            <ArrowLeft size={16} />
            <span>Back to Workouts</span>
          </Link>

          {/* Large Hero Banner */}
          <div className="workout-detail-hero">
            <div 
              className="workout-detail-hero-bg" 
              style={{ 
                backgroundImage: `url(${plan.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80"})` 
              }} 
            />
            <div className="workout-detail-hero-overlay" />
            
            <div className="workout-detail-hero-content">
              {plan.category && (
                <span className="badge badge-silver" style={{ marginBottom: "1rem", fontSize: "0.75rem" }}>
                  {plan.category}
                </span>
              )}
              <h1 className="workout-detail-title">{plan.name}</h1>
              <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", maxWidth: "700px", lineHeight: 1.6 }}>
                {plan.description || "Premium routines optimized by certified trainers."}
              </p>

              <div className="workout-detail-meta">
                {plan.difficulty && (
                  <div className="workout-detail-meta-item">
                    <span className={`badge badge-${plan.difficulty.toLowerCase() === "beginner" ? "success" : plan.difficulty.toLowerCase() === "intermediate" ? "gold" : "platinum"}`} style={{ fontSize: "0.7rem" }}>
                      {plan.difficulty}
                    </span>
                  </div>
                )}
                
                {plan.duration && (
                  <div className="workout-detail-meta-item">
                    <Clock size={16} style={{ color: "var(--accent-purple)" }} />
                    <span><strong>Duration:</strong> {plan.duration} mins</span>
                  </div>
                )}

                {plan.calories && (
                  <div className="workout-detail-meta-item">
                    <Flame size={16} style={{ color: "var(--accent-pink)" }} />
                    <span><strong>Est. Burn:</strong> {plan.calories} kcal</span>
                  </div>
                )}

                <div className="workout-detail-meta-item">
                  <Dumbbell size={16} style={{ color: "var(--accent-emerald)" }} />
                  <span><strong>Movements:</strong> {plan.exercises.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Layout Split */}
          <div className="workout-detail-layout">
            
            {/* Exercises Column */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <h2 style={{ fontSize: "1.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Dumbbell size={22} style={{ color: "var(--accent-pink)" }} />
                <span>Routine Breakdown</span>
              </h2>

              <div className="workout-exercises-list">
                {plan.exercises.map((we, index) => {
                  const stepList = we.exercise.instructions.split("\n").filter(Boolean);
                  const tipsList = JSON.parse(we.exercise.tips) as string[];

                  return (
                    <div key={we.id} className="workout-exercise-item glass-panel">
                      <div className="workout-exercise-header">
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <span style={{ 
                            width: "28px", 
                            height: "28px", 
                            borderRadius: "50%", 
                            background: "var(--accent-purple-glow)", 
                            border: "1px solid rgba(139, 92, 246, 0.3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.85rem",
                            fontWeight: 700,
                            color: "#fff"
                          }}>
                            {index + 1}
                          </span>
                          <h3 className="workout-exercise-name">{we.exercise.name}</h3>
                        </div>
                        <div className="workout-exercise-presc">
                          {we.sets} Sets &times; {we.reps} Reps
                        </div>
                      </div>

                      {/* Details row badges */}
                      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                        <span><strong>Rest:</strong> {we.restSeconds} sec</span>
                        <span>&bull;</span>
                        <span style={{ textTransform: "uppercase" }}><strong>Target:</strong> {we.exercise.muscleGroup}</span>
                        <span>&bull;</span>
                        <span style={{ textTransform: "uppercase" }}><strong>Gear:</strong> {we.exercise.equipment}</span>
                      </div>

                      {/* Step by step details */}
                      <div>
                        <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                          Step-by-Step Execution
                        </h4>
                        <ol style={{ paddingLeft: "1.2rem" }}>
                          {stepList.map((step, idx) => (
                            <li key={idx} className="instruction-step">
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Tips */}
                      {tipsList && tipsList.length > 0 && (
                        <div style={{ background: "rgba(16, 185, 129, 0.02)", border: "1px solid rgba(16, 185, 129, 0.1)", borderRadius: "var(--radius-sm)", padding: "1rem", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                          <Sparkles size={16} style={{ color: "var(--accent-emerald)", flexShrink: 0, marginTop: "0.1rem" }} />
                          <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                            <strong>Trainer Tip:</strong> {tipsList[0]}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sidebar Guidelines Column */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <div className="glass-panel" style={{ padding: "2rem" }}>
                <h3 style={{ fontSize: "1.25rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <CheckCircle size={18} style={{ color: "var(--accent-emerald)" }} />
                  <span>Before You Start</span>
                </h3>
                
                <ul style={{ paddingLeft: "1.2rem", fontSize: "0.88rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
                  <li><strong>Warm-up:</strong> Spend 5-10 minutes doing light cardio and dynamic stretches before starting.</li>
                  <li><strong>Hydration:</strong> Keep water handy and stay hydrated throughout your lift intervals.</li>
                  <li><strong>Form First:</strong> Never sacrifice form for heavier weights. Control the eccentric phase.</li>
                  <li><strong>Log It:</strong> Track the weights you lift to guarantee progressive overload over time.</li>
                </ul>

                <Link 
                  href="/dashboard/log" 
                  className="btn btn-primary"
                  style={{ display: "flex", width: "100%", justifyContent: "center" }}
                >
                  <span>Open Workout Logger</span>
                </Link>
              </div>

              <div className="glass-panel" style={{ padding: "2rem" }}>
                <h3 style={{ fontSize: "1.25rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <HelpCircle size={18} style={{ color: "var(--accent-amber)" }} />
                  <span>Need Advice?</span>
                </h3>
                <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "1rem" }}>
                  Unsure about form? Scan our exercises database or ask one of the floor trainers on-site at any franchise gym location.
                </p>
                <Link 
                  href="/tips" 
                  className="btn btn-secondary btn-sm"
                  style={{ display: "flex", width: "100%", justifyContent: "center" }}
                >
                  <span>Read Fitness Tips</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
