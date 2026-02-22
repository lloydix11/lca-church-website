import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const registrations = await prisma.campRegistration.findMany({
      orderBy: { createdAt: "desc" },
    });

    const headers = [
      "Name",
      "Facebook URL",
      "Contact Number",
      "Emergency Contact",
      "Invited By",
      "Amount Paid",
      "Screenshot Sent",
      "Status",
      "Registration Date",
    ];

    const rows = registrations.map((reg) => [
      reg.fullName,
      reg.facebookUrl,
      reg.contactNumber,
      reg.emergencyContactNumber,
      reg.invitedBy || "",
      reg.amountPaid,
      reg.screenshotSentEmail ? "Yes" : "No",
      reg.status,
      reg.createdAt.toISOString(),
    ]);

    const csv = [
      headers.map((h) => `"${h}"`).join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition":
          'attachment; filename="camp-registrations.csv"',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}
