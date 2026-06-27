import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  Dumbbell, 
  Target, 
  CreditCard, 
  Clipboard, 
  TrendingUp,
  ChevronRight,
  Apple,
  Flame
} from "lucide-react";
import WelcomeBanner from "@/components/WelcomeBanner";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const daysOfWeek = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
  const todayName = daysOfWeek[today.getDay()];

  // Fetch metrics and info in parallel
  const [
    membership, 
    activeGoalsCount, 
    totalWorkoutsCount, 
    recentLogs,
    calorieLog,
    todayMeals
  ] = await Promise.all([
    db.membership.findFirst({
      where: {
        userId: session.user.id,
        status: "ACTIVE",
      },
      include: {
        plan: true,
      },
    }),
    db.fitnessGoal.count({
      where: {
        userId: session.user.id,
        status: "ACTIVE",
      },
    }),
    db.workoutLog.count({
      where: {
        userId: session.user.id,
      },
    }),
    db.workoutLog.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        date: "desc",
      },
      take: 5,
    }),
    db.dailyCalorieLog.findUnique({
      where: {
        userId_date: {
          userId: session.user.id,
          date: today,
        },
      },
    }),
    db.dietPlan.findMany({
      where: {
        userId: session.user.id,
        day: todayName,
      },
    }),
  ]);

  // Resolve exercise names for the logs manually because there's no direct relation defined in Prisma schema
  const exerciseIds = Array.from(new Set(recentLogs.map((log) => log.exerciseId)));
  const exercises = exerciseIds.length > 0 
    ? await db.exercise.findMany({
        where: {
          id: {
            in: exerciseIds,
          },
        },
      })
    : [];

  const exerciseMap = new Map(exercises.map((e) => [e.id, e]));

  // Calculate guest preview data vs active subscription data
  const isGuest = !membership;
  
  let caloriesConsumed = 0;
  let caloriesBurned = 0;
  let protein = 0;
  let carbs = 0;
  let fat = 0;

  const calorieTarget = 2000;
  const proteinTarget = 150;
  const carbsTarget = 250;
  const fatTarget = 70;

  if (isGuest) {
    caloriesConsumed = 1450;
    caloriesBurned = 350;
    protein = 78;
    carbs = 135;
    fat = 42;
  } else {
    const mealCalories = todayMeals.reduce((sum, meal) => sum + meal.calories, 0);
    caloriesConsumed = Math.max(calorieLog?.caloriesConsumed ?? 0, mealCalories);
    caloriesBurned = calorieLog?.caloriesBurned ?? 0;
    protein = todayMeals.reduce((sum, meal) => sum + (meal.protein ?? 0), 0);
    carbs = todayMeals.reduce((sum, meal) => sum + (meal.carbs ?? 0), 0);
    fat = todayMeals.reduce((sum, meal) => sum + (meal.fat ?? 0), 0);
  }

  const caloriePct = Math.min(100, Math.round((caloriesConsumed / calorieTarget) * 100));
  const proteinPct = Math.min(100, Math.round((protein / proteinTarget) * 100));
  const carbsPct = Math.min(100, Math.round((carbs / carbsTarget) * 100));
  const fatPct = Math.min(100, Math.round((fat / fatTarget) * 100));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Welcome Banner */}
      <WelcomeBanner userName={session.user.name || "Athlete"} />

      {/* Metrics Summary Grid */}
      <div className="summary-grid">
        <div className="summary-card glass-panel">
          <div className="summary-card-info">
            <span className="summary-card-label">Membership</span>
            <span className="summary-card-value">
              {membership ? membership.plan.name : "No Active Plan"}
            </span>
          </div>
          <div className="summary-card-icon-wrapper summary-icon-purple">
            <CreditCard size={24} />
          </div>
        </div>

        <div className="summary-card glass-panel">
          <div className="summary-card-info">
            <span className="summary-card-label">Active Goals</span>
            <span className="summary-card-value">
              {activeGoalsCount} {activeGoalsCount === 1 ? "Goal" : "Goals"}
            </span>
          </div>
          <div className="summary-card-icon-wrapper summary-icon-pink">
            <Target size={24} />
          </div>
        </div>

        <div className="summary-card glass-panel">
          <div className="summary-card-info">
            <span className="summary-card-label">Workouts Logged</span>
            <span className="summary-card-value">
              {totalWorkoutsCount} {totalWorkoutsCount === 1 ? "Session" : "Sessions"}
            </span>
          </div>
          <div className="summary-card-icon-wrapper summary-icon-emerald">
            <Dumbbell size={24} />
          </div>
        </div>
      </div>

      {/* Today's Nutrition & Calories Panel */}
      <section className="nutrition-tracker-panel glass-panel">
        <div className="nutrition-tracker-header">
          <div>
            <h3 className="dashboard-section-title" style={{ margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Apple size={22} className="nutrition-title-icon" style={{ color: "var(--accent-purple)" }} />
              <span>Today's Nutrition & Macros</span>
              {isGuest && (
                <span className="badge-guest-preview">Guest Preview</span>
              )}
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.25rem" }}>
              {isGuest 
                ? "Showing simulated premium tracker metrics. Upgrade to log your real meals." 
                : "Keep tabs on your energy intake and macro balances for today."}
            </p>
          </div>
          <Link href="/dashboard/plus" className="btn btn-secondary btn-sm" style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <span>Manage Tracker</span>
            <ChevronRight size={16} />
          </Link>
        </div>

        <div className="nutrition-tracker-body">
          {/* Circular Calorie Gauge */}
          <div className="calorie-gauge-wrapper">
            <div className="calorie-ring-container">
              <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="rgba(255, 255, 255, 0.03)"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="url(#calorieGradient)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={314.16}
                  strokeDashoffset={314.16 - (314.16 * caloriePct) / 100}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 0.5s ease" }}
                />
                <defs>
                  <linearGradient id="calorieGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--accent-purple)" />
                    <stop offset="100%" stopColor="var(--accent-pink)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="calorie-ring-label">
                <span className="calorie-ring-pct">{caloriePct}%</span>
                <span className="calorie-ring-text">Of Daily Target</span>
              </div>
            </div>
            <div className="calorie-gauge-info">
              <span className="calorie-label">Calories Eaten</span>
              <span className="calorie-val">{caloriesConsumed} <span className="unit">kcal</span></span>
              <span className="calorie-subtext">Target: {calorieTarget} kcal | {Math.max(0, calorieTarget - caloriesConsumed)} kcal remaining</span>
              {caloriesBurned > 0 && (
                <div className="calorie-burned-pill">
                  <Flame size={12} style={{ color: "var(--accent-pink)" }} />
                  <span>{caloriesBurned} kcal burned today</span>
                </div>
              )}
            </div>
          </div>

          {/* Linear Macronutrient Progress Bars */}
          <div className="macros-list-wrapper">
            {/* Protein */}
            <div className="macro-item">
              <div className="macro-header">
                <span className="macro-name">🍗 Protein</span>
                <span className="macro-values">
                  <strong>{protein}g</strong> / {proteinTarget}g
                </span>
              </div>
              <div className="macro-progress-bg">
                <div 
                  className="macro-progress-fill protein-fill"
                  style={{ width: `${proteinPct}%` }}
                ></div>
              </div>
            </div>

            {/* Carbs */}
            <div className="macro-item">
              <div className="macro-header">
                <span className="macro-name">🥑 Carbs</span>
                <span className="macro-values">
                  <strong>{carbs}g</strong> / {carbsTarget}g
                </span>
              </div>
              <div className="macro-progress-bg">
                <div 
                  className="macro-progress-fill carbs-fill"
                  style={{ width: `${carbsPct}%` }}
                ></div>
              </div>
            </div>

            {/* Fat */}
            <div className="macro-item">
              <div className="macro-header">
                <span className="macro-name">🧈 Fat</span>
                <span className="macro-values">
                  <strong>{fat}g</strong> / {fatTarget}g
                </span>
              </div>
              <div className="macro-progress-bg">
                <div 
                  className="macro-progress-fill fat-fill"
                  style={{ width: `${fatPct}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Card Grid */}
      <section className="dashboard-actions-section">
        <h3 className="dashboard-section-title">Quick Actions</h3>
        <div className="action-grid">
          <Link href="/dashboard/log" className="action-card glass-panel">
            <div className="action-card-icon">
              <Dumbbell size={20} />
            </div>
            <div>
              <h4 className="action-card-title">Log Workout</h4>
              <p className="action-card-subtitle">Record your daily training session</p>
            </div>
          </Link>

          <Link href="/dashboard/goals" className="action-card glass-panel">
            <div className="action-card-icon">
              <Target size={20} />
            </div>
            <div>
              <h4 className="action-card-title">Set a Goal</h4>
              <p className="action-card-subtitle">Create a new fitness milestone</p>
            </div>
          </Link>

          <Link href="/dashboard/progress" className="action-card glass-panel">
            <div className="action-card-icon">
              <TrendingUp size={20} />
            </div>
            <div>
              <h4 className="action-card-title">Track Progress</h4>
              <p className="action-card-subtitle">Log body measurements and stats</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Workout Timeline Logs */}
      <section className="timeline-section glass-panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div>
            <h3 className="dashboard-section-title" style={{ margin: 0 }}>Recent Workouts</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
              Your latest 5 training activities
            </p>
          </div>
          <Link 
            href="/dashboard/log" 
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "0.25rem", 
              fontSize: "0.85rem", 
              color: "var(--accent-purple)",
              fontWeight: 600
            }}
          >
            <span>View All</span>
            <ChevronRight size={16} />
          </Link>
        </div>

        {recentLogs.length === 0 ? (
          <div style={{ padding: "3rem 0", textAlign: "center", color: "var(--text-muted)" }}>
            <Clipboard size={48} style={{ margin: "0 auto 1rem auto", opacity: 0.4, display: "block" }} />
            <p style={{ marginBottom: "1rem" }}>No workouts logged yet. Start recording your fitness journey!</p>
            <Link href="/dashboard/log" className="btn btn-primary btn-sm">
              Log First Workout
            </Link>
          </div>
        ) : (
          <div className="timeline-list">
            {recentLogs.map((log) => {
              const exercise = exerciseMap.get(log.exerciseId);
              return (
                <div key={log.id} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-card">
                    <div className="timeline-header">
                      <span className="timeline-exercise-name">
                        {exercise ? exercise.name : "Logged Activity"}
                      </span>
                      <span className="timeline-date">
                        {new Date(log.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    
                    <div className="timeline-details">
                      {log.weight !== null && log.weight !== undefined && (
                        <span>
                          <strong>Weight:</strong> {log.weight} kg
                        </span>
                      )}
                      {log.sets !== null && log.sets !== undefined && (
                        <span>
                          <strong>Sets:</strong> {log.sets}
                        </span>
                      )}
                      {log.reps !== null && log.reps !== undefined && (
                        <span>
                          <strong>Reps:</strong> {log.reps}
                        </span>
                      )}
                      {log.duration !== null && log.duration !== undefined && (
                        <span>
                          <strong>Duration:</strong> {Math.round(log.duration / 60)} mins
                        </span>
                      )}
                    </div>
                    
                    {log.notes && (
                      <p className="timeline-notes">
                        "{log.notes}"
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
