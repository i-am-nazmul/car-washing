import { connect } from "@/dbconfig/dbconfig";
import CustomerMessage from "@/models/customerMessage.models";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  await connect();

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify admin role
    const Users = (await import("@/models/users.models")).default;
    const user = await Users.findOne({ email: session.user.email });
    
    if (user?.role !== "admin") {
      return NextResponse.json(
        { message: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const messages = await CustomerMessage.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .populate({ path: "customerId", select: "username email phoneNumber" });

    const normalizedMessages = messages.map((message) => {
      const customer = message.customerId as {
        _id?: string;
        username?: string;
        email?: string;
        phoneNumber?: string | null;
      } | null;

      return {
        _id: message._id,
        message: message.message,
        createdAt: message.createdAt,
        customerId: customer?._id,
        customerName: customer?.username || "Unknown",
        customerEmail: customer?.email || "N/A",
        customerPhone: customer?.phoneNumber || "N/A",
      };
    });

    return NextResponse.json(
      {
        messages: normalizedMessages,
        total: normalizedMessages.length,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Fetch messages error:", error);
    return NextResponse.json(
      { message: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
