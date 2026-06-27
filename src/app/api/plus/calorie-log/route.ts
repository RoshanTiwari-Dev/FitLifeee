import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const calorieLogSchema = z.object({
  date: z.string().optional().nullable(),
  caloriesConsumed: z.number().int().nonnegative().optional(),
  caloriesBurned: z.number().int().nonnegative().optional(),
  waterIntakeMl: z.number().int().nonnegative().optional(),
});

function getNormalizedDate(dateStr?: string | null): Date {
  const d = dateStr ? new Date(dateStr) : new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

// GET: Fetch calorie log for a specific date
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date");
    const targetDate = getNormalizedDate(dateParam);

    const log = await db.dailyCalorieLog.findUnique({
      where: {
        userId_date: {
          userId: session.user.id,
          date: targetDate,
        },
      },
    });

    if (!log) {
      return NextResponse.json({
        userId: session.user.id,
        date: targetDate,
        caloriesConsumed: 0,
        caloriesBurned: 0,
        waterIntakeMl: 0,
      });
    }

    return NextResponse.json(log);
  } catch (error) {
    console.error("Calorie log GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Create or update calorie log
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = calorieLogSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const targetDate = getNormalizedDate(parsed.data.date);

    const updatedLog = await db.dailyCalorieLog.upsert({
      where: {
        userId_date: {
          userId: session.user.id,
          date: targetDate,
        },
      },
      update: {
        caloriesConsumed: parsed.data.caloriesConsumed !== undefined ? parsed.data.caloriesConsumed : undefined,
        caloriesBurned: parsed.data.caloriesBurned !== undefined ? parsed.data.caloriesBurned : undefined,
        waterIntakeMl: parsed.data.waterIntakeMl !== undefined ? parsed.data.waterIntakeMl : undefined,
      },
      create: {
        userId: session.user.id,
        date: targetDate,
        caloriesConsumed: parsed.data.caloriesConsumed ?? 0,
        caloriesBurned: parsed.data.caloriesBurned ?? 0,
        waterIntakeMl: parsed.data.waterIntakeMl ?? 0,
      },
    });

    return NextResponse.json(updatedLog);
  } catch (error) {
    console.error("Calorie log POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
