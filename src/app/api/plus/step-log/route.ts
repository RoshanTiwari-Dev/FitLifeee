import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const stepLogSchema = z.object({
  date: z.string().optional().nullable(),
  steps: z.number().int().nonnegative(),
  target: z.number().int().positive().optional(),
});

function getNormalizedDate(dateStr?: string | null): Date {
  const d = dateStr ? new Date(dateStr) : new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

// GET: Fetch steps log for a specific date
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date");
    const targetDate = getNormalizedDate(dateParam);

    const log = await db.stepLog.findUnique({
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
        steps: 0,
        target: 10000,
      });
    }

    return NextResponse.json(log);
  } catch (error) {
    console.error("Steps log GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Create or update steps log
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = stepLogSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const targetDate = getNormalizedDate(parsed.data.date);

    const updatedLog = await db.stepLog.upsert({
      where: {
        userId_date: {
          userId: session.user.id,
          date: targetDate,
        },
      },
      update: {
        steps: parsed.data.steps,
        target: parsed.data.target !== undefined ? parsed.data.target : undefined,
      },
      create: {
        userId: session.user.id,
        date: targetDate,
        steps: parsed.data.steps,
        target: parsed.data.target ?? 10000,
      },
    });

    return NextResponse.json(updatedLog);
  } catch (error) {
    console.error("Steps log POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
