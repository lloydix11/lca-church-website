import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    const updated = await prisma.event.updateMany({
      where: { title: "Youth Summer Camp" },
      data: {
        date: new Date("2026-05-21"),
        description:
          "Join us for an unforgettable spiritual experience! This is our annual youth summer camp (May 21-23, 2026) featuring worship, games, and fellowship opportunities. Registration fee: ₱1,000",
      },
    });

    console.log("✓ Youth Summer Camp date updated!");
    console.log("Updated records:", updated.count);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
