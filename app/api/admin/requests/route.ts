import { db } from "@/db";
import { serviceRequests, services, user, userServices } from "@/db/schema";
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

    const allRequests = await db.select({
      id: serviceRequests.id,
      reason: serviceRequests.reason,
      status: serviceRequests.status,
      adminNotes: serviceRequests.adminNotes,
      reviewedAt: serviceRequests.reviewedAt,
      createdAt: serviceRequests.createdAt,
      updatedAt: serviceRequests.updatedAt,
      userId: serviceRequests.userId,
      userName: user.name,
      userEmail: user.email,
      serviceName: services.name,
      serviceDescription: services.description
    })
    .from(serviceRequests)
    .innerJoin(services, eq(serviceRequests.serviceId, services.id))
    .innerJoin(user, eq(serviceRequests.userId, user.id))
    .orderBy(serviceRequests.createdAt);

    return Response.json({ requests: allRequests });
  } catch (error) {
    console.error("Error fetching admin requests:", error);
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

    const { requestId, status, adminNotes } = await request.json();

    if (!requestId || !status) {
      return Response.json({ error: "Request ID and status are required" }, { status: 400 });
    }

    if (!['pending', 'approved', 'denied'].includes(status)) {
      return Response.json({ error: "Invalid status" }, { status: 400 });
    }

    const serviceRequest = await db.select({
      userId: serviceRequests.userId,
      serviceId: serviceRequests.serviceId,
      currentStatus: serviceRequests.status
    })
    .from(serviceRequests)
    .where(eq(serviceRequests.id, requestId))
    .limit(1);

    if (serviceRequest.length === 0) {
      return Response.json({ error: "Request not found" }, { status: 404 });
    }

    await db.update(serviceRequests)
      .set({
        status,
        adminNotes,
        reviewedBy: session.user.id,
        reviewedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(serviceRequests.id, requestId));

    if (status === 'approved' && serviceRequest[0].currentStatus !== 'approved') {
      const existingAccess = await db.select()
        .from(userServices)
        .where(and(
          eq(userServices.userId, serviceRequest[0].userId),
          eq(userServices.serviceId, serviceRequest[0].serviceId)
        ))
        .limit(1);

      if (existingAccess.length === 0) {
        await db.insert(userServices).values({
          id: nanoid(),
          userId: serviceRequest[0].userId,
          serviceId: serviceRequest[0].serviceId,
          grantedBy: session.user.id,
          grantedAt: new Date(),
          createdAt: new Date()
        });
      }
    }

    if (status === 'denied' && serviceRequest[0].currentStatus === 'approved') {
      await db.delete(userServices)
        .where(and(
          eq(userServices.userId, serviceRequest[0].userId),
          eq(userServices.serviceId, serviceRequest[0].serviceId)
        ));
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error updating request:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
