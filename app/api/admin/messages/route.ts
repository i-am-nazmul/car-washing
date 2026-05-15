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

    // Get filter from query params
    const url = new URL(request.url);
    const unreadOnly = url.searchParams.get("unread") === "true";

    const filter = unreadOnly ? { read: false } : {};

    const messages = await CustomerMessage.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await CustomerMessage.countDocuments({ read: false });

    return NextResponse.json(
      {
        messages,
        unreadCount,
        total: messages.length,
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
