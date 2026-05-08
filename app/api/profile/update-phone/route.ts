import { connect } from '@/dbconfig/dbconfig';
import Users from '@/models/users.models';
import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth';

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
    const phoneNumber = requestBody?.phoneNumber?.toString().trim();

    if (!phoneNumber) {
      return NextResponse.json(
        { message: "Please provide a phone number." },
        { status: 400 }
      );
    }

    // Validate phone number format (10-15 digits)
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return NextResponse.json(
        { message: "Please provide a valid phone number (10-15 digits)." },
        { status: 400 }
      );
    }

    const email = String(session.user.email).trim().toLowerCase();
    const user = await Users.findOneAndUpdate(
      { email },
      { phoneNumber },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Phone number updated successfully!" },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error("Update phone error:", error);

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
