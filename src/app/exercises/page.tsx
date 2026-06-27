import React from "react";
import { db } from "@/lib/db";
import ExercisesClient from "./ExercisesClient";

export const revalidate = 0;

export default async function ExercisesPage() {
  const exercises = await db.exercise.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return <ExercisesClient exercises={exercises} />;
}
