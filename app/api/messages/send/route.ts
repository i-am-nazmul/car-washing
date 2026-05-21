import { connect } from "@/dbconfig/dbconfig";
import CustomerMessage from "@/models/customerMessage.models";
import Users from "@/models/users.models";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  await connect();

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized. Please login first." },
        { status: 401 }
      );
    }

    const requestBody = await request.json();
    const message = requestBody?.message?.trim();

    if (!message) {
      return NextResponse.json(
        { message: "Please enter a message." },
        { status: 400 }
      );
    }

    if (message.length < 5 || message.length > 1000) {
      return NextResponse.json(
        { message: "Message must be between 5 and 1000 characters." },
        { status: 400 }
      );
    }

    // Fetch user from database to get the actual ID
    const customerEmail = String(session.user.email).toLowerCase();
    const user = await Users.findOne({ email: customerEmail });

    if (!user) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    const newMessage = await CustomerMessage.create({
      customerId: user._id,
      message,
    });

    return NextResponse.json(
      {
        message: "Message sent successfully!",
        data: newMessage,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Send message error:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message || "Internal error occurred" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Unexpected error occurred" },
      { status: 500 }
    );
  }
}
