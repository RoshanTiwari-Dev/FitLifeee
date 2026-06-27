import React from "react";
import { db } from "@/lib/db";
import GymLocatorClient from "./GymLocatorClient";

// Ensure fresh fetch of seeded gym branches on every load
export const revalidate = 0;

export default async function GymLocationsPage() {
  const branches = await db.gymLocation.findMany({
    where: {
      active: true,
    },
    orderBy: {
      city: "asc",
    },
  });

  return <GymLocatorClient locations={branches} />;
}
