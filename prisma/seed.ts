import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.campRegistration.deleteMany();
  await prisma.event.deleteMany();
  await prisma.sermon.deleteMany();
  await prisma.churchSettings.deleteMany();

  // Create sample sermons
  const sermon1 = await prisma.sermon.create({
    data: {
      title: "Faith in Action",
      preacher: "Ptr. Edwin Gumadan",
      date: new Date("2026-02-15"),
      description:
        "A powerful message about how faith shapes our daily actions and decisions.",
      youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      coverImageUrl: null,
    },
  });

  const sermon2 = await prisma.sermon.create({
    data: {
      title: "Grace and Mercy",
      preacher: "Ptr. Andrew Jehiel Gumadan",
      date: new Date("2026-02-08"),
      description:
        "Understanding God's boundless grace and the mercy we receive through Christ.",
      youtubeUrl: null,
      coverImageUrl: null,
    },
  });

  // Create sample events
  const event1 = await prisma.event.create({
    data: {
      title: "Sunday Worship Service",
      date: new Date("2026-02-22T10:00:00"),
      location: "Psalm Base Talisay",
      description: "Join us for our weekly Sunday worship service.",
      posterImageUrl: null,
    },
  });

  const event2 = await prisma.event.create({
    data: {
      title: "Bible Study Fellowship",
      date: new Date("2026-02-25T19:00:00"),
      location: "Psalm Base Talisay",
      description: "Weekly Bible study on the Gospel of John.",
      posterImageUrl: null,
    },
  });

  const event3 = await prisma.event.create({
    data: {
      title: "Youth Summer Camp",
      date: new Date("2026-05-21"),
      location: "TBA",
      description: "Join us for an unforgettable spiritual experience! This is our annual youth summer camp (May 21-23, 2026) featuring worship, games, and fellowship opportunities. Registration fee: ₱1,000",
      posterImageUrl: null,
    },
  });

  // Create sample camp registration
  const registration = await prisma.campRegistration.create({
    data: {
      fullName: "Sample Registration",
      facebookUrl: "https://facebook.com/sample",
      contactNumber: "09123456789",
      emergencyContactNumber: "09111111111",
      amountPaid: 1000,
      screenshotSentEmail: true,
      status: "Confirmed",
    },
  });

  // Create church settings
  await prisma.churchSettings.create({
    data: {
      churchName: "Lighthouse Christian Assembly",
      address: "Psalm Base Talisay",
      phone: "(YOUR PHONE NUMBER)",
      email: "info@lca.church",
      sundayService: "9:30 AM",
      wednesdayService: "5:00 PM",
    },
  });

  console.log("✓ Database seeded successfully!");
  console.log("Sample sermons, events, and registration created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
