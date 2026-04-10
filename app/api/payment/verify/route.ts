import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { hasServerAuth } from "@/lib/serverAuth";

export async function POST(request: NextRequest) {
  const isAuthenticated = await hasServerAuth();
  if (!isAuthenticated) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return NextResponse.json(
      { message: "Server configuration error: Razorpay secret is missing." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const razorpayOrderId = String(body?.razorpay_order_id || "");
    const razorpayPaymentId = String(body?.razorpay_payment_id || "");
    const razorpaySignature = String(body?.razorpay_signature || "");

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { message: "Invalid payment payload." },
        { status: 400 }
      );
    }

    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return NextResponse.json(
        { message: "Payment signature verification failed." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Payment verified successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify Razorpay payment error:", error);
    return NextResponse.json(
      { message: "Unable to verify payment." },
      { status: 500 }
    );
  }
}
