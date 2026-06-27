import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const createProgressSchema = z.object({
  weight: z.number().positive().nullable().optional(),
  bodyFat: z.number().positive().nullable().optional(),
  chest: z.number().positive().nullable().optional(),
  waist: z.number().positive().nullable().optional(),
  hips: z.number().positive().nullable().optional(),
  biceps: z.number().positive().nullable().optional(),
  thighs: z.number().positive().nullable().optional(),
  notes: z.string().nullable().optional(),
  date: z.string().nullable().optional(),
});

// GET: Retrieve all progress logs for user
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const logs = await db.progressEntry.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("ProgressEntry GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Add a new progress log
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = createProgressSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const newEntry = await db.progressEntry.create({
      data: {
        userId: session.user.id,
        weight: parsed.data.weight,
        bodyFat: parsed.data.bodyFat,
        chest: parsed.data.chest,
        waist: parsed.data.waist,
        hips: parsed.data.hips,
        biceps: parsed.data.biceps,
        thighs: parsed.data.thighs,
        notes: parsed.data.notes,
        date: parsed.data.date ? new Date(parsed.data.date) : new Date(),
      },
    });

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    console.error("ProgressEntry POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE: Delete a progress log entry
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Entry ID is required" }, { status: 400 });
    }

    // Verify ownership
    const entry = await db.progressEntry.findUnique({
      where: { id },
    });

    if (!entry || entry.userId !== session.user.id) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    await db.progressEntry.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ProgressEntry DELETE error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
