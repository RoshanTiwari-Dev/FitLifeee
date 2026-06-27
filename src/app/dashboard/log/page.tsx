import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import WorkoutLoggerClient from "./WorkoutLoggerClient";

export const revalidate = 0;

export default async function WorkoutLogPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  // Load exercises list and initial user workout logs
  const [exercises, logs] = await Promise.all([
    db.exercise.findMany({
      orderBy: {
        name: "asc",
      },
    }),
    db.workoutLog.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        date: "desc",
      },
    }),
  ]);

  return <WorkoutLoggerClient initialExercises={exercises} initialLogs={logs} />;
}
