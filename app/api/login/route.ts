import { connect } from '@/dbconfig/dbconfig';
import Users from '@/models/users.models';
import { NextResponse,NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt"


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
    const email = requestBody?.email?.trim()?.toLowerCase();
    const password = requestBody?.password;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Please provide email and password." },
        { status: 400 }
      );
    }

    const existingUser = await Users.findOne({email : email});

    if(!existingUser){
      console.error("No such user exists");
      return NextResponse.json({message : "Failed to login."},{status : 401})
    }
    const isPasswordMatched = await bcrypt.compare(password,existingUser.password);
    
    if(!isPasswordMatched){
      console.error("Invalid password");
      return NextResponse.json({message : "Failed to login."},{status : 401})
    }

    const token = jwt.sign(
      {
        id : existingUser._id
      },
      tokenSecret,
      {
        expiresIn : '1d'
      }
    )


    const response = NextResponse.json({
      message : "Logged in successfully!!"
    },{status : 200});
    response.cookies.set("token",token,{
      httpOnly : true,
      secure : process.env.NODE_ENV === "production",
      sameSite : 'strict',
      maxAge : 60*60*24,
      path : "/"
    });
    return response;


  } catch (error: unknown) {
    console.error("Error while fetching the goal data", error);

    
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message || "Failed to login." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}