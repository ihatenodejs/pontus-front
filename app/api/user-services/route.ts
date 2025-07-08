import { db } from "@/db";
import { userServices, services } from "@/db/schema";
import { auth } from "@/util/auth";
import { eq, sql } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const grantedServices = await db.select({
      serviceId: services.id,
      serviceName: services.name,
      serviceDescription: services.description,
      priceStatus: services.priceStatus,
      joinLink: services.joinLink,
      grantedAt: userServices.grantedAt,
      isOpen: sql<boolean>`false`
    })
    .from(userServices)
    .innerJoin(services, eq(userServices.serviceId, services.id))
    .where(eq(userServices.userId, session.user.id));

    const openServices = await db.select({
      serviceId: services.id,
      serviceName: services.name,
      serviceDescription: services.description,
      priceStatus: services.priceStatus,
      joinLink: services.joinLink,
      grantedAt: sql<Date | null>`null`,
      isOpen: sql<boolean>`true`
    })
    .from(services)
    .where(eq(services.priceStatus, "open"));

    const grantedServiceIds = new Set(grantedServices.map(s => s.serviceId));
    const uniqueOpenServices = openServices.filter(s => !grantedServiceIds.has(s.serviceId));

    const allAccessibleServices = [...grantedServices, ...uniqueOpenServices];

    return Response.json({ services: allAccessibleServices });
  } catch (error) {
    console.error("Error fetching user services:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
