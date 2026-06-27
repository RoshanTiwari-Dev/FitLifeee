import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Lock } from "lucide-react";
import FiTLiFePlusClient from "./FiTLiFePlusClient";

export const revalidate = 0;

function getNormalizedDate(): Date {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

export default async function PlusDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  // Determine if the user is a guest (does not have an ACTIVE membership)
  const membership = await db.membership.findFirst({
    where: {
      userId: session.user.id,
      status: "ACTIVE",
    },
  });

  const isGuest = !membership;
  const targetDate = getNormalizedDate();

  let initialCalorieLog: {
    id?: string;
    caloriesConsumed: number;
    caloriesBurned: number;
    waterIntakeMl: number;
    date: string;
  } = {
    caloriesConsumed: 0,
    caloriesBurned: 0,
    waterIntakeMl: 0,
    date: targetDate.toISOString(),
  };

  let initialStepLog: {
    id?: string;
    steps: number;
    target: number;
    date: string;
  } = {
    steps: 0,
    target: 10000,
    date: targetDate.toISOString(),
  };

  let initialDietPlans: any[] = [];

  if (isGuest) {
    // Interactive mock data for Guest Mode Preview
    initialCalorieLog = {
      caloriesConsumed: 1450,
      caloriesBurned: 350,
      waterIntakeMl: 1250,
      date: targetDate.toISOString(),
    };
    initialStepLog = {
      steps: 7420,
      target: 10000,
      date: targetDate.toISOString(),
    };
    initialDietPlans = [
      {
        id: "mock-1",
        day: "MONDAY",
        mealType: "BREAKFAST",
        foodName: "Oatmeal with Honey & Berries",
        calories: 320,
        protein: 10,
        carbs: 58,
        fat: 4,
      },
      {
        id: "mock-2",
        day: "MONDAY",
        mealType: "LUNCH",
        foodName: "Grilled Chicken & Quinoa Salad",
        calories: 480,
        protein: 42,
        carbs: 35,
        fat: 14,
      },
      {
        id: "mock-3",
        day: "TUESDAY",
        mealType: "SNACK",
        foodName: "Protein Shake & Almonds",
        calories: 220,
        protein: 26,
        carbs: 8,
        fat: 10,
      },
      {
        id: "mock-4",
        day: "WEDNESDAY",
        mealType: "DINNER",
        foodName: "Baked Salmon & Broccoli",
        calories: 550,
        protein: 38,
        carbs: 12,
        fat: 22,
      },
    ];
  } else {
    // Real member tracking data
    const [calorieLog, stepLog, dietPlans] = await Promise.all([
      db.dailyCalorieLog.findUnique({
        where: {
          userId_date: {
            userId: session.user.id,
            date: targetDate,
          },
        },
      }),
      db.stepLog.findUnique({
        where: {
          userId_date: {
            userId: session.user.id,
            date: targetDate,
          },
        },
      }),
      db.dietPlan.findMany({
        where: {
          userId: session.user.id,
        },
        orderBy: {
          createdAt: "asc",
        },
      }),
    ]);

    if (calorieLog) {
      initialCalorieLog = {
        id: calorieLog.id,
        caloriesConsumed: calorieLog.caloriesConsumed,
        caloriesBurned: calorieLog.caloriesBurned,
        waterIntakeMl: calorieLog.waterIntakeMl,
        date: calorieLog.date.toISOString(),
      };
    }
    if (stepLog) {
      initialStepLog = {
        id: stepLog.id,
        steps: stepLog.steps,
        target: stepLog.target,
        date: stepLog.date.toISOString(),
      };
    }
    initialDietPlans = dietPlans.map((dp) => ({
      id: dp.id,
      day: dp.day as any,
      mealType: dp.mealType as any,
      foodName: dp.foodName,
      calories: dp.calories,
      protein: dp.protein,
      carbs: dp.carbs,
      fat: dp.fat,
    }));
  }

  return (
    <FiTLiFePlusClient 
      initialCalorieLog={initialCalorieLog}
      initialStepLog={initialStepLog}
      initialDietPlans={initialDietPlans}
      isGuest={isGuest}
    />
  );
}
