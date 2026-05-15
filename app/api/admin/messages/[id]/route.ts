import { connect } from "@/dbconfig/dbconfig";
import CustomerMessage from "@/models/customerMessage.models";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const messageId = id;

    const deletedMessage = await CustomerMessage.findByIdAndDelete(messageId);

    if (!deletedMessage) {
      return NextResponse.json(
        { message: "Message not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Message deleted successfully",
        data: deletedMessage,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Delete message error:", error);
    return NextResponse.json(
      { message: "Failed to delete message" },
      { status: 500 }
    );
  }
}
