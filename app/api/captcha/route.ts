import { createChallenge } from "altcha-lib";
import { NextResponse } from "next/server";

const hmacKey = process.env.ALTCHA_SECRET;

async function getChallenge() {
  if (!hmacKey) {
    console.error("ALTCHA_SECRET is not set")
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }

  const challenge = await createChallenge({
    hmacKey,
    maxNumber: 1400000,
  })

  return NextResponse.json(challenge)
}

export async function GET() {
  return getChallenge()
}