import { db } from "@/db";
import { services, userServices, user } from "@/db/schema";
import { auth } from "@/util/auth";
import { eq, and } from "drizzle-orm";
import { NextRequest } from "next/server";
import { nanoid } from "nanoid";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session || session.user.role !== 'admin') {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allServices = await db.select({
      id: services.id,
      name: services.name,
      description: services.description,
      priceStatus: services.priceStatus,
      joinLink: services.joinLink,
      enabled: services.enabled,
      createdAt: services.createdAt,
      updatedAt: services.updatedAt
    })
    .from(services)
    .orderBy(services.name);

    const serviceAssignments = await db.select({
      serviceId: userServices.serviceId,
      userId: userServices.userId,
      userName: user.name,
      userEmail: user.email,
      grantedAt: userServices.grantedAt
    })
    .from(userServices)
    .innerJoin(user, eq(userServices.userId, user.id))
    .orderBy(user.name);

    const servicesWithUsers = allServices.map(service => ({
      ...service,
      users: serviceAssignments.filter(assignment => assignment.serviceId === service.id)
    }));

    return Response.json({ services: servicesWithUsers });
  } catch (error) {
    console.error("Error fetching services:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session || session.user.role !== 'admin') {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, userId, serviceId } = await request.json();

    if (!action || !userId || !serviceId) {
      return Response.json({ error: "Action, user ID, and service ID are required" }, { status: 400 });
    }

    if (action === 'grant') {
      const existingAccess = await db.select()
        .from(userServices)
        .where(and(
          eq(userServices.userId, userId),
          eq(userServices.serviceId, serviceId)
        ))
        .limit(1);

      if (existingAccess.length > 0) {
        return Response.json({ error: "User already has access to this service" }, { status: 400 });
      }

      await db.insert(userServices).values({
        id: nanoid(),
        userId,
        serviceId,
        grantedBy: session.user.id,
        grantedAt: new Date(),
        createdAt: new Date()
      });

      return Response.json({ success: true, message: "Access granted" });

    } else if (action === 'revoke') {
      await db.delete(userServices)
        .where(and(
          eq(userServices.userId, userId),
          eq(userServices.serviceId, serviceId)
        ));

      return Response.json({ success: true, message: "Access revoked" });

    } else {
      return Response.json({ error: "Invalid action. Use 'grant' or 'revoke'" }, { status: 400 });
    }

  } catch (error) {
    console.error("Error managing service access:", error);
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

    const { serviceId, enabled, priceStatus, description, joinLink } = await request.json();

    if (!serviceId) {
      return Response.json({ error: "Service ID is required" }, { status: 400 });
    }

    const updates: {
      updatedAt: Date;
      enabled?: boolean;
      priceStatus?: string;
      description?: string;
      joinLink?: string | null;
    } = {
      updatedAt: new Date()
    };

    if (typeof enabled === 'boolean') {
      updates.enabled = enabled;
    }

    if (priceStatus && ['open', 'invite-only', 'by-request'].includes(priceStatus)) {
      updates.priceStatus = priceStatus;
    }

    if (description !== undefined) {
      updates.description = description;
    }

    if (joinLink !== undefined) {
      updates.joinLink = joinLink || null;
    }

    await db.update(services)
      .set(updates)
      .where(eq(services.id, serviceId));

    return Response.json({ success: true, message: "Service updated successfully" });

  } catch (error) {
    console.error("Error updating service:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
