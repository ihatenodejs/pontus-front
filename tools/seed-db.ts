import { db } from "../db";
import { services } from "../db/schema";
import { services as serviceConfig } from "../config/services";
import { nanoid } from "nanoid";

async function seedDatabase() {
  try {
    console.log("Seeding database...");
    await db.delete(services);
    for (const service of serviceConfig) {
      await db.insert(services).values({
        id: nanoid(),
        name: service.name,
        description: service.description,
        priceStatus: service.priceStatus,
        joinLink: service.joinLink || null,
        enabled: true
      });
      console.log(`✓ Added service: ${service.name}`);
    }
    console.log("Database seeded!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();