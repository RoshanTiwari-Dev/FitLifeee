import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const createGoalSchema = z.object({
  type: z.string().min(1, "Goal type is required"),
  title: z.string().min(1, "Goal title is required"),
  target: z.number().positive("Target must be positive"),
  current: z.number().nonnegative("Current must be 0 or more"),
  unit: z.string().min(1, "Unit is required"),
  deadline: z.string().optional().nullable(),
});

const updateGoalSchema = z.object({
  id: z.string().min(1, "Goal ID is required"),
  current: z.number().nonnegative("Progress must be 0 or more").optional(),
  status: z.enum(["ACTIVE", "COMPLETED", "ABANDONED"]).optional(),
});

// GET: Retrieve all goals for authenticated member
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const goals = await db.fitnessGoal.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(goals);
  } catch (error) {
    console.error("Goals GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Create a new fitness goal
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = createGoalSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const newGoal = await db.fitnessGoal.create({
      data: {
        userId: session.user.id,
        type: parsed.data.type,
        title: parsed.data.title,
        target: parsed.data.target,
        current: parsed.data.current,
        unit: parsed.data.unit,
        deadline: parsed.data.deadline ? new Date(parsed.data.deadline) : null,
        status: "ACTIVE",
      },
    });

    return NextResponse.json(newGoal, { status: 201 });
  } catch (error) {
    console.error("Goals POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH: Update current value / status of a goal
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = updateGoalSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    // Verify ownership
    const goal = await db.fitnessGoal.findUnique({
      where: { id: parsed.data.id },
    });

    if (!goal || goal.userId !== session.user.id) {
      return NextResponse.json({ error: "Goal not found" }, { status: 444 });
    }

    // Auto complete status if current >= target
    let updateStatus = parsed.data.status;
    if (parsed.data.current !== undefined) {
      if (parsed.data.current >= goal.target) {
        updateStatus = "COMPLETED";
      } else if (goal.status === "COMPLETED" && parsed.data.current < goal.target) {
        // Revert to active if user updates current back below target
        updateStatus = "ACTIVE";
      }
    }

    const updatedGoal = await db.fitnessGoal.update({
      where: { id: parsed.data.id },
      data: {
        current: parsed.data.current !== undefined ? parsed.data.current : undefined,
        status: updateStatus,
      },
    });

    return NextResponse.json(updatedGoal);
  } catch (error) {
    console.error("Goals PATCH error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE: Delete a fitness goal
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Goal ID is required" }, { status: 400 });
    }

    // Verify ownership
    const goal = await db.fitnessGoal.findUnique({
      where: { id },
    });

    if (!goal || goal.userId !== session.user.id) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    await db.fitnessGoal.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Goals DELETE error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
