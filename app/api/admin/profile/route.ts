import { NextRequest, NextResponse } from "next/server";
import { hasServerAuth } from "@/lib/serverAuth";
import Users from "@/models/users.models";
import { connect } from "@/dbconfig/dbconfig";

export async function GET(request: NextRequest) {
  try {
    const isAuthenticated = await hasServerAuth();
    
    if (!isAuthenticated) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    await dbConnect();

    // Get authenticated user from session
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "User not found in session" },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await Users.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Check if user is admin
    if (user.role !== "admin") {
      return NextResponse.json(
        { message: "Insufficient permissions. Admin access required." },
        { status: 403 }
      );
    }

    // Return admin data
    return NextResponse.json(
      {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error in admin profile:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Note: Import getServerSession from next-auth based on your auth setup
import { getServerSession } from "next-auth/next";
