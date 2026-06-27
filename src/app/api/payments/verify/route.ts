import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateCardNumber } from "@/lib/razorpay";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { orderId, paymentId, signature } = body;

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json({ error: "Missing verification parameters." }, { status: 400 });
    }

    // Look up the pending payment record
    const payment = await db.payment.findFirst({
      where: { 
        razorpayOrderId: orderId,
        status: "PENDING"
      },
    });

    if (!payment) {
      return NextResponse.json({ error: "Pending transaction not found." }, { status: 404 });
    }

    // Verify signature
    let isValid = false;
    if (orderId.startsWith("order_mock_")) {
      isValid = signature === "mock_signature";
    } else {
      const secret = process.env.RAZORPAY_KEY_SECRET || "your_secret_here";
      const hmac = crypto.createHmac("sha256", secret);
      hmac.update(`${orderId}|${paymentId}`);
      const generatedSignature = hmac.digest("hex");
      isValid = generatedSignature === signature;
    }

    if (!isValid) {
      // Mark transaction as failed
      await db.payment.update({
        where: { id: payment.id },
        data: { status: "FAILED" },
      });
      return NextResponse.json({ error: "Payment verification failed. Invalid signature." }, { status: 400 });
    }

    // Find the subscription plan matching the payment amount
    const plan = await db.plan.findFirst({
      where: { price: payment.amount },
    });

    if (!plan) {
      return NextResponse.json({ error: "Subscription plan matching transaction amount not found." }, { status: 404 });
    }

    // Calculate start and end dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + plan.duration);

    // Generate unique card number using count of total memberships
    const count = await db.membership.count();
    const cardNumber = generateCardNumber(count + 1);

    // Check if user already has an ACTIVE membership to extend it
    const activeMembership = await db.membership.findFirst({
      where: {
        userId: payment.userId,
        status: "ACTIVE"
      }
    });

    let membership;
    if (activeMembership) {
      // Extend existing membership duration
      const extendedEndDate = new Date(activeMembership.endDate);
      extendedEndDate.setMonth(extendedEndDate.getMonth() + plan.duration);

      membership = await db.membership.update({
        where: { id: activeMembership.id },
        data: {
          endDate: extendedEndDate,
          planId: plan.id, // Update plan if upgraded
        }
      });
    } else {
      // Create new ACTIVE membership
      membership = await db.membership.create({
        data: {
          userId: payment.userId,
          planId: plan.id,
          status: "ACTIVE",
          cardNumber,
          startDate,
          endDate,
          autoRenew: false,
        }
      });
    }

    // Mark payment as SUCCESS and link to the membership
    await db.payment.update({
      where: { id: payment.id },
      data: {
        status: "SUCCESS",
        razorpayPaymentId: paymentId,
        razorpaySignature: signature,
        membershipId: membership.id,
      }
    });

    return NextResponse.json({
      message: "Payment verified successfully.",
      membershipId: membership.id,
      cardNumber: membership.cardNumber,
    });
  } catch (error) {
    console.error("Payment verification endpoint error:", error);
    return NextResponse.json(
      { error: "Internal server error during verification." },
      { status: 500 }
    );
  }
}
