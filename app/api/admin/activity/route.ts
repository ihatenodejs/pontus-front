import { db } from "@/db";
import { serviceRequests, user, userServices, services } from "@/db/schema";
import { auth } from "@/util/auth";
import { eq, gte, desc, sql } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session || session.user.role !== 'admin') {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const period = url.searchParams.get('period') || '7';
    const daysAgo = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    const requestActivity = await db.select({
      date: sql<string>`DATE(${serviceRequests.createdAt})`,
      count: sql<number>`COUNT(*)`,
      status: serviceRequests.status
    })
    .from(serviceRequests)
    .where(gte(serviceRequests.createdAt, startDate))
    .groupBy(sql`DATE(${serviceRequests.createdAt})`, serviceRequests.status)
    .orderBy(sql`DATE(${serviceRequests.createdAt})`);

    const userActivity = await db.select({
      date: sql<string>`DATE(${user.createdAt})`,
      count: sql<number>`COUNT(*)`
    })
    .from(user)
    .where(gte(user.createdAt, startDate))
    .groupBy(sql`DATE(${user.createdAt})`)
    .orderBy(sql`DATE(${user.createdAt})`);

    const accessActivity = await db.select({
      date: sql<string>`DATE(${userServices.grantedAt})`,
      count: sql<number>`COUNT(*)`
    })
    .from(userServices)
    .where(gte(userServices.grantedAt, startDate))
    .groupBy(sql`DATE(${userServices.grantedAt})`)
    .orderBy(sql`DATE(${userServices.grantedAt})`);

    const recentActivity = await db.select({
      id: serviceRequests.id,
      type: sql<string>`'request'`,
      description: sql<string>`CONCAT(${user.name}, ' requested access to ', ${services.name})`,
      status: serviceRequests.status,
      createdAt: serviceRequests.createdAt,
      userName: user.name,
      serviceName: services.name
    })
    .from(serviceRequests)
    .innerJoin(user, eq(serviceRequests.userId, user.id))
    .innerJoin(services, eq(serviceRequests.serviceId, services.id))
    .where(gte(serviceRequests.createdAt, startDate))
    .orderBy(desc(serviceRequests.createdAt))
    .limit(20);

    const servicePopularity = await db.select({
      serviceName: services.name,
      requestCount: sql<number>`COUNT(${serviceRequests.id})`,
      approvedCount: sql<number>`COUNT(CASE WHEN ${serviceRequests.status} = 'approved' THEN 1 END)`
    })
    .from(services)
    .leftJoin(serviceRequests, eq(services.id, serviceRequests.serviceId))
    .where(gte(serviceRequests.createdAt, startDate))
    .groupBy(services.id, services.name)
    .orderBy(sql`COUNT(${serviceRequests.id}) DESC`)
    .limit(10);

    const totals = await db.select({
      totalRequests: sql<number>`COUNT(DISTINCT ${serviceRequests.id})`,
      totalUsers: sql<number>`COUNT(DISTINCT ${user.id})`,
      totalAccess: sql<number>`COUNT(DISTINCT ${userServices.id})`
    })
    .from(serviceRequests)
    .fullJoin(user, gte(user.createdAt, startDate))
    .fullJoin(userServices, gte(userServices.grantedAt, startDate))
    .where(gte(serviceRequests.createdAt, startDate));

    return Response.json({
      requestActivity,
      userActivity,
      accessActivity,
      recentActivity,
      servicePopularity,
      totals: totals[0] || { totalRequests: 0, totalUsers: 0, totalAccess: 0 },
      period: daysAgo
    });

  } catch (error) {
    console.error("Error fetching activity data:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
