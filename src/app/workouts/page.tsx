import React from "react";
import { db } from "@/lib/db";
import WorkoutsClient from "./WorkoutsClient";

export const revalidate = 0;

export default async function WorkoutsPage() {
  const plans = await db.workoutPlan.findMany({
    include: {
      exercises: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return <WorkoutsClient workoutPlans={plans} />;
}
