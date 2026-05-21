import { connect } from '@/dbconfig/dbconfig';
import Users from '@/models/users.models';
import UserInfo from '@/models/userinfo.models';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getToken } from 'next-auth/jwt';

interface DecodedToken {
    id: string; 
    iat: number; 
    exp: number; 
}

export async function GET(request: NextRequest) {
  await connect();

  try {
    const authSecret = process.env.NEXTAUTH_SECRET || process.env.TOKEN_SECRET;
    const secureCookie = request.nextUrl.protocol === "https:";
    let sessionToken = await getToken({ req: request, secret: authSecret, secureCookie });

    if (!sessionToken) {
      sessionToken = await getToken({
        req: request,
        secret: authSecret,
        secureCookie: !secureCookie,
      });
    }
    if (sessionToken?.email) {
      const nextAuthUser = await Users.findOne({ email: String(sessionToken.email).toLowerCase() }).select("username email role avatar plan");

      if (!nextAuthUser) {
        return NextResponse.json(
          {
            username: sessionToken.name || String(sessionToken.email).split("@")[0],
            email: String(sessionToken.email),
            role: "user",
            avatar: null,
            phoneNumber: null,
            plan: [],
          },
          { status: 200 }
        );
      }

      let userInfo = await UserInfo.findOne({ userId: nextAuthUser._id }).select("phoneNumber address vehicles");
      if (!userInfo) {
        userInfo = await UserInfo.create({
          userId: nextAuthUser._id,
          email: nextAuthUser.email,
        });
      }

      return NextResponse.json(
        {
          username: nextAuthUser.username,
          email: nextAuthUser.email,
          role: nextAuthUser.role,
          avatar: nextAuthUser.avatar,
          phoneNumber: userInfo?.phoneNumber || null,
          address: userInfo?.address || "",
          vehicles: userInfo?.vehicles || [],
          plan: nextAuthUser.plan || [],
        },
        { status: 200 }
      );
    }

    const tokenSecret = process.env.TOKEN_SECRET;
    if (!tokenSecret) {
      return NextResponse.json(
        { message: "Server configuration error: TOKEN_SECRET is missing." },
        { status: 500 }
      );
    }
    
    const token = request.cookies.get("token")?.value;

    if (!token) {
      console.error("Unauthorised");
      return NextResponse.json({ message: "Failed" }, { status: 401 });
    }

    
    const decodedToken = jwt.verify(token, tokenSecret) as DecodedToken;

    
    const user = await Users.findById(decodedToken.id).select("username email role avatar plan");

    if (!user) {
      console.error("No such user exists");
      return NextResponse.json({ message: "Failed" }, { status: 404 });
    }

    
    let userInfo = await UserInfo.findOne({ userId: user._id }).select("phoneNumber address vehicles");
    if (!userInfo) {
      userInfo = await UserInfo.create({
        userId: user._id,
        email: user.email,
      });
    }

    return NextResponse.json({
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phoneNumber: userInfo?.phoneNumber || null,
      address: userInfo?.address || "",
      vehicles: userInfo?.vehicles || [],
      plan: user.plan || [],
    },{status:200});

  } catch (error: unknown) {
    console.error("Invalid or expired token. Please login.", error);
    return NextResponse.json({ message: "Invalid or expired token." }, { status: 401 });
  }
}