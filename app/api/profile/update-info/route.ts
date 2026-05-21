import { connect } from "@/dbconfig/dbconfig";
import Users from "@/models/users.models";
import UserInfo from "@/models/userinfo.models";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type UpdateInfoPayload = {
  phoneNumber?: string;
  address?: string;
  vehicles?: string[];
};

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

    const requestBody = (await request.json()) as UpdateInfoPayload;
    const rawPhone = requestBody?.phoneNumber?.toString().trim() || "";
    const address = requestBody?.address?.toString().trim() || "";
    const vehicles = Array.isArray(requestBody?.vehicles)
      ? requestBody.vehicles.map((vehicle) => vehicle.toString().trim()).filter(Boolean)
      : [];

    if (rawPhone) {
      const phoneDigitsOnly = rawPhone.replace(/\D/g, "");
      const phoneRegex = /^\d{10,15}$/;
      if (!phoneRegex.test(phoneDigitsOnly)) {
        return NextResponse.json(
          { message: "Please provide a valid phone number (10-15 digits)." },
          { status: 400 }
        );
      }
    }

    const email = String(session.user.email).trim().toLowerCase();
    const user = await Users.findOne({ email }).select("_id email");

    if (!user) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    const phoneNumber = rawPhone ? rawPhone.replace(/\D/g, "") : "";

    await UserInfo.findOneAndUpdate(
      { userId: user._id },
      {
        email: user.email,
        phoneNumber: phoneNumber || null,
        address,
        vehicles,
      },
      { new: true, upsert: true }
    );

    return NextResponse.json(
      { message: "Profile updated successfully!" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Update profile info error:", error);

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
