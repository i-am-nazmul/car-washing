import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { hasServerAuth } from "@/lib/serverAuth";

export async function POST(request: NextRequest) {
  const isAuthenticated = await hasServerAuth();
  if (!isAuthenticated) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return NextResponse.json(
      { message: "Server configuration error: Razorpay keys are missing." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const amountInPaise = Number(body?.amountInPaise);
    const planName = String(body?.planName || "Plan");

    if (!Number.isInteger(amountInPaise) || amountInPaise <= 0) {
      return NextResponse.json(
        { message: "Invalid payment amount." },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: {
        planName,
      },
    });

    return NextResponse.json(
      {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Create Razorpay order error:", error);
    return NextResponse.json(
      { message: "Unable to create payment order." },
      { status: 500 }
    );
  }
}
