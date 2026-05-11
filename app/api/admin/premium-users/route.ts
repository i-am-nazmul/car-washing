import { connect } from "@/dbconfig/dbconfig";
import Users from "@/models/users.models";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  await connect();

  try {
    const session = await getServerSession(authOptions);

    // Check if user is admin
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const adminEmail = String(session.user.email).toLowerCase();
    const adminUser = await Users.findOne({ email: adminEmail }).select("role");

    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json(
        { message: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    // Fetch all users with non-empty plans
    const premiumUsers = await Users.find({
      plan: { $exists: true, $ne: [] }
    }).select("username email plan phoneNumber createdAt");

    return NextResponse.json(
      { premiumUsers },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Fetch premium users error:", error);

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
