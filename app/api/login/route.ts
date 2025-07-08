import { auth } from "@/util/auth";
import { verifyCaptcha } from "@/util/captcha";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, token } = body;

    if (!email || !password || !token) {
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

    const isCaptchaValid = await verifyCaptcha(token);
    if (!isCaptchaValid) {
      return NextResponse.json(
        { error: "Invalid captcha" },
        { status: 400 }
      );
    }

    const signInResponse = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    if (!signInResponse) {
      return NextResponse.json(
        { error: "Failed to sign in" },
        { status: 500 }
      );
    }

    if ('error' in signInResponse) {
      const errorMessage = signInResponse.error && typeof signInResponse.error === 'object' && 'message' in signInResponse.error
        ? String(signInResponse.error.message)
        : "Invalid credentials";
      return NextResponse.json(
        { error: errorMessage },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Signed in successfully",
      user: signInResponse.user,
    });

  } catch (error: unknown) {
    console.error("Login error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
