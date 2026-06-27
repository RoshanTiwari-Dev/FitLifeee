import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import ProgressTrackerClient from "./ProgressTrackerClient";

export const revalidate = 0;

export default async function ProgressTrackerPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  // Fetch initial logs sorted chronologically
  const entries = await db.progressEntry.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      date: "desc",
    },
  });

  return <ProgressTrackerClient initialEntries={entries} />;
}
