import { db } from "../db";
import { user } from "../db/schema";
import { eq } from "drizzle-orm";

async function setUserAsAdmin(email: string) {
  try {
    const existingUser = await db.select().from(user).where(eq(user.email, email));
    if (existingUser.length === 0) {
      console.error(`❌ "${email}" not found`);
      process.exit(1);
    }
    if (existingUser[0].role === 'admin') {
      console.log(`✓ "${email}" is already an admin`);
      return;
    }

    await db.update(user)
      .set({
        role: 'admin',
        updatedAt: new Date()
      })
      .where(eq(user.email, email));

    console.log(`✓ Successfully set user "${email}" as admin`);
    console.log(`  Email: ${existingUser[0].email}`);
    console.log(`  ID: ${existingUser[0].id}`);
  } catch (error) {
    console.error("Error setting user as admin:", error);
    process.exit(1);
  }
}

const email = process.argv[2];

if (!email) {
  console.error("Usage: bun tools/set-admin.ts <email>");
  console.error("Example: bun tools/set-admin.ts example@example.com");
  process.exit(1);
}

setUserAsAdmin(email);
