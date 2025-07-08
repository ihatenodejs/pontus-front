import { auth } from "@/util/auth";
import { verifyCaptcha } from "@/util/captcha";
import { db } from "@/db";
import { user } from "@/db/schema";
import { sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, confirmPassword, token, name } = body;

    if (!email || !password || !confirmPassword || !token) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    const isCaptchaValid = await verifyCaptcha(token);
    if (!isCaptchaValid) {
      return NextResponse.json(
        { error: "Invalid captcha" },
        { status: 400 }
      );
    }

    const userCount = await db.select({ count: sql<number>`count(*)` }).from(user);
    const isFirstUser = userCount[0]?.count === 0;

    const signUpResponse = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: name || email.split('@')[0],
        role: isFirstUser ? 'admin' : 'user',
      },
    });

    if (!signUpResponse) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }

    if ('error' in signUpResponse) {
      const errorMessage = signUpResponse.error && typeof signUpResponse.error === 'object' && 'message' in signUpResponse.error 
        ? String(signUpResponse.error.message)
        : "Failed to create user";
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      user: signUpResponse.user,
      isFirstUser,
    });

  } catch (error: unknown) {
    console.error("Signup error:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('duplicate key') || errorMessage.includes('already exists')) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
