import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const dietPlanSchema = z.object({
  day: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]),
  mealType: z.enum(["BREAKFAST", "LUNCH", "DINNER", "SNACK"]),
  foodName: z.string().min(1, "Food name is required"),
  calories: z.number().int().nonnegative("Calories must be 0 or more"),
  protein: z.number().nonnegative("Protein must be 0 or more").nullable().optional(),
  carbs: z.number().nonnegative("Carbs must be 0 or more").nullable().optional(),
  fat: z.number().nonnegative("Fat must be 0 or more").nullable().optional(),
});

// GET: Retrieve all diet entries for the member
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const entries = await db.dietPlan.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(entries);
  } catch (error) {
    console.error("Diet plan GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Add a new meal entry to the weekly plan
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = dietPlanSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const newMeal = await db.dietPlan.create({
      data: {
        userId: session.user.id,
        day: parsed.data.day,
        mealType: parsed.data.mealType,
        foodName: parsed.data.foodName,
        calories: parsed.data.calories,
        protein: parsed.data.protein,
        carbs: parsed.data.carbs,
        fat: parsed.data.fat,
      },
    });

    return NextResponse.json(newMeal, { status: 201 });
  } catch (error) {
    console.error("Diet plan POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE: Remove a meal entry
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Meal ID is required" }, { status: 400 });
    }

    // Verify ownership
    const meal = await db.dietPlan.findUnique({
      where: { id },
    });

    if (!meal || meal.userId !== session.user.id) {
      return NextResponse.json({ error: "Meal entry not found" }, { status: 404 });
    }

    await db.dietPlan.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Diet plan DELETE error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
