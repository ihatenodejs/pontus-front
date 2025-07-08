import { db } from "@/db";
import { services } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const publicServices = await db.select({
      id: services.id,
      name: services.name,
      description: services.description,
      priceStatus: services.priceStatus,
      joinLink: services.joinLink,
      enabled: services.enabled
    })
    .from(services)
    .where(eq(services.enabled, true))
    .orderBy(services.name);

    return Response.json({ services: publicServices });
  } catch (error) {
    console.error("Error fetching public services:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
