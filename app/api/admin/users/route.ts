import { db } from "@/db";
import { user } from "@/db/schema";
import { auth } from "@/util/auth";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session || session.user.role !== 'admin') {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allUsers = await db.select({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    })
    .from(user)
    .orderBy(user.createdAt);

    return Response.json({ users: allUsers });
  } catch (error) {
    console.error("Error fetching users:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session || session.user.role !== 'admin') {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, role } = await request.json();

    if (!userId || !role) {
      return Response.json({ error: "User ID and role are required" }, { status: 400 });
    }

    if (!['user', 'admin'].includes(role)) {
      return Response.json({ error: "Invalid role" }, { status: 400 });
    }

    await db.update(user)
      .set({
        role,
        updatedAt: new Date()
      })
      .where(eq(user.id, userId));

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error updating user:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
