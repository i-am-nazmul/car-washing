import { connect } from '@/dbconfig/dbconfig';
import Users from '@/models/users.models';
import { NextResponse,NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


export async function POST(request:NextRequest) {
  await connect();

  try {    
    const tokenSecret = process.env.TOKEN_SECRET;
    if (!tokenSecret) {
      return NextResponse.json(
        { message: "Server configuration error: TOKEN_SECRET is missing." },
        { status: 500 }
      );
    }

    const requestBody = await request.json();
    const username = requestBody?.username?.trim();
    const email = requestBody?.email?.trim()?.toLowerCase();
    const password = requestBody?.password;
    const phoneNumber = requestBody?.phoneNumber?.trim();

    if (!username || !email || !password || !phoneNumber) {
      return NextResponse.json(
        { message: "Please provide username, email, password, and phone number." },
        { status: 400 }
      );
    }

    // Validate phone number format (10-15 digits)
    const phoneDigitsOnly = phoneNumber.replace(/\D/g, '');
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(phoneDigitsOnly)) {
      return NextResponse.json(
        { message: "Please provide a valid phone number (10-15 digits)." },
        { status: 400 }
      );
    }

    const existingUser = await Users.findOne({ email });
    if(existingUser){
      return NextResponse.json(
        { message : "Email already registered. Please login instead." },
        { status : 409 }
      )
    }
    const hashedPassword = await bcrypt.hash(password,10);

    const user = await Users.create({
      username,
      email,
      password : hashedPassword,
      phoneNumber: phoneDigitsOnly,
      authProviders: ["credentials"],
      isEmailVerified: false,
    });

    const token = jwt.sign(
      {
        id : user._id
      },
      tokenSecret,
      {
        expiresIn : '1d'
      }
    )


    const response = NextResponse.json({
      message : "Signed up successfully!!"
    },{status : 201});
    response.cookies.set("token",token,{
      httpOnly : true,
      secure : process.env.NODE_ENV === "production",
      sameSite : 'strict',
      maxAge : 60*60*24,
      path : "/"


    });
    return response;


  } catch (error: unknown) {
    console.error("Signup error:", error);

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