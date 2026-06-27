import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const createLogSchema = z.object({
  exerciseId: z.string().min(1, "Exercise is required"),
  sets: z.number().int().positive().nullable().optional(),
  reps: z.number().int().positive().nullable().optional(),
  weight: z.number().positive().nullable().optional(),
  duration: z.number().int().positive().nullable().optional(), // In seconds
  notes: z.string().nullable().optional(),
  date: z.string().nullable().optional(),
});

// GET: Retrieve all logs for user
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const logs = await db.workoutLog.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("WorkoutLog GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Add a new workout log
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = createLogSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    // Verify the exercise actually exists in the database library
    const exerciseExists = await db.exercise.findUnique({
      where: { id: parsed.data.exerciseId },
    });

    if (!exerciseExists) {
      return NextResponse.json({ error: "Exercise not found in database library" }, { status: 404 });
    }

    const newLog = await db.workoutLog.create({
      data: {
        userId: session.user.id,
        exerciseId: parsed.data.exerciseId,
        sets: parsed.data.sets,
        reps: parsed.data.reps,
        weight: parsed.data.weight,
        duration: parsed.data.duration,
        notes: parsed.data.notes,
        date: parsed.data.date ? new Date(parsed.data.date) : new Date(),
      },
    });

    return NextResponse.json(newLog, { status: 201 });
  } catch (error) {
    console.error("WorkoutLog POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE: Delete a workout log entry
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Log ID is required" }, { status: 400 });
    }

    // Verify ownership
    const log = await db.workoutLog.findUnique({
      where: { id },
    });

    if (!log || log.userId !== session.user.id) {
      return NextResponse.json({ error: "Log entry not found" }, { status: 404 });
    }

    await db.workoutLog.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("WorkoutLog DELETE error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
