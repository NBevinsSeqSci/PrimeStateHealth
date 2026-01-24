import { db } from "../server/db";
import { clinicians } from "../shared/schema";
import bcrypt from "bcrypt";

async function seed() {
  console.log("🌱 Seeding database...");
  
  // Create default clinician account
  const hashedPassword = await bcrypt.hash("Tiffy7676", 10);
  
  try {
    await db.insert(clinicians).values({
      email: "bevins.nick@gmail.com",
      password: hashedPassword,
      name: "Dr. Bevins"
    });
    console.log("✅ Created default clinician: bevins.nick@gmail.com");
  } catch (error: any) {
    if (error.code === '23505') {
      console.log("ℹ️  Clinician already exists");
    } else {
      console.error("❌ Error creating clinician:", error);
    }
  }
  
  console.log("✅ Seeding complete!");
  process.exit(0);
}

seed();
