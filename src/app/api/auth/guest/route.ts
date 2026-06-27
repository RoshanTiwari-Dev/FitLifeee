import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST() {
  try {
    const email = "guest@fitlifegym.in";
    const password = "guest123";

    // 1. Check if user already exists
    let guestUser = await db.user.findUnique({
      where: { email },
    });

    if (!guestUser) {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create guest user
      guestUser = await db.user.create({
        data: {
          name: "Guest Athlete",
          email,
          password: hashedPassword,
          phone: "+91 9999999999",
          city: "Mumbai",
          role: "MEMBER",
        },
      });
    }

    // 2. Fetch the first active plan from database to attach a membership
    const plan = await db.plan.findFirst({
      where: { active: true },
    });

    if (plan) {
      // Check if user already has an active membership
      const activeMembership = await db.membership.findFirst({
        where: {
          userId: guestUser.id,
          status: "ACTIVE",
        },
      });

      if (!activeMembership) {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(startDate.getMonth() + 1); // 1 month duration

        // Create membership
        await db.membership.create({
          data: {
            userId: guestUser.id,
            planId: plan.id,
            status: "ACTIVE",
            cardNumber: "CARD-GUEST-" + Math.floor(100000 + Math.random() * 900000),
            startDate,
            endDate,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      email,
      password,
    });
  } catch (error) {
    console.error("Guest provision error:", error);
    return NextResponse.json(
      { error: "Failed to provision guest user." },
      { status: 500 }
    );
  }
}
