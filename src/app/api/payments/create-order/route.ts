import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { razorpay } from "@/lib/razorpay";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { planId } = body;

    if (!planId) {
      return NextResponse.json({ error: "Plan ID is required." }, { status: 400 });
    }

    // Fetch the target subscription plan
    const plan = await db.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found." }, { status: 404 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Detect if keys are placeholder defaults
    const isMock = 
      !keyId || 
      keyId === "rzp_test_yourkeyhere" || 
      !keySecret || 
      keySecret === "your_secret_here";

    let orderId: string;
    const amountInPaise = Math.round(plan.price * 100);

    if (isMock) {
      orderId = `order_mock_${Math.random().toString(36).substring(2, 14)}`;
    } else {
      // Create a real Razorpay order
      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `rcpt_${plan.slug}_${Date.now()}`,
      });
      orderId = order.id;
    }

    // Insert a PENDING Payment record in the database
    await db.payment.create({
      data: {
        userId: session.user.id,
        amount: plan.price,
        currency: "INR",
        status: "PENDING",
        razorpayOrderId: orderId,
        description: `Plan Subscription: ${plan.name}`,
      },
    });

    return NextResponse.json({
      orderId,
      amount: amountInPaise,
      currency: "INR",
      isMock,
      keyId: isMock ? "rzp_test_yourkeyhere" : keyId,
    });
  } catch (error) {
    console.error("Create order payment error:", error);
    return NextResponse.json(
      { error: "Internal server error while creating payment order." },
      { status: 500 }
    );
  }
}
