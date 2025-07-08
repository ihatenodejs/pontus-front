import { db } from "@/db";
import { serviceRequests, services, userServices } from "@/db/schema";
import { auth } from "@/util/auth";
import { verifyCaptcha } from "@/util/captcha";
import { eq, and } from "drizzle-orm";
import { NextRequest } from "next/server";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { serviceId, reason, captchaToken } = await request.json();

    if (!serviceId || !reason) {
      return Response.json({ error: "Service ID and reason are required" }, { status: 400 });
    }

    const isValidCaptcha = await verifyCaptcha(captchaToken);
    if (!isValidCaptcha) {
      return Response.json({ error: "Invalid captcha" }, { status: 400 });
    }

    const service = await db.select().from(services).where(eq(services.name, serviceId)).limit(1);
    if (service.length === 0) {
      return Response.json({ error: "Service not found" }, { status: 404 });
    }

    if (!service[0].enabled) {
      return Response.json({ error: "This service is currently unavailable" }, { status: 400 });
    }

    const existingAccess = await db.select()
      .from(userServices)
      .where(and(
        eq(userServices.userId, session.user.id),
        eq(userServices.serviceId, service[0].id)
      ))
      .limit(1);

    if (existingAccess.length > 0) {
      return Response.json({ error: "You already have access to this service" }, { status: 400 });
    }

    const existingRequest = await db.select()
      .from(serviceRequests)
      .where(and(
        eq(serviceRequests.userId, session.user.id),
        eq(serviceRequests.serviceId, service[0].id),
        eq(serviceRequests.status, 'pending')
      ))
      .limit(1);

    if (existingRequest.length > 0) {
      return Response.json({ error: "You already have a pending request for this service" }, { status: 400 });
    }

    const requestId = nanoid();
    await db.insert(serviceRequests).values({
      id: requestId,
      userId: session.user.id,
      serviceId: service[0].id,
      reason,
      status: 'pending'
    });

    return Response.json({ success: true, requestId });
  } catch (error) {
    console.error("Error creating service request:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRequests = await db.select({
      id: serviceRequests.id,
      reason: serviceRequests.reason,
      status: serviceRequests.status,
      adminNotes: serviceRequests.adminNotes,
      reviewedAt: serviceRequests.reviewedAt,
      createdAt: serviceRequests.createdAt,
      serviceName: services.name,
      serviceDescription: services.description
    })
    .from(serviceRequests)
    .innerJoin(services, eq(serviceRequests.serviceId, services.id))
    .where(eq(serviceRequests.userId, session.user.id))
    .orderBy(serviceRequests.createdAt);

    return Response.json({ requests: userRequests });
  } catch (error) {
    console.error("Error fetching service requests:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
