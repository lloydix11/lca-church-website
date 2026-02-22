import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let settings = await prisma.churchSettings.findUnique({
      where: { id: 1 },
    });

    // If settings don't exist, create default ones
    if (!settings) {
      settings = await prisma.churchSettings.create({
        data: {
          churchName: "Lighthouse Christian Assembly",
          address: "Psalm Base Talisay",
          phone: "(YOUR PHONE NUMBER)",
          email: "info@lca.church",
          sundayService: "9:30 AM",
          wednesdayService: "5:00 PM",
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch settings" },
      { status: 400 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const settings = await prisma.churchSettings.update({
      where: { id: 1 },
      data: {
        churchName: body.churchName,
        address: body.address,
        phone: body.phone,
        email: body.email,
        sundayService: body.sundayService,
        wednesdayService: body.wednesdayService,
      },
    });

    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update settings" },
      { status: 400 }
    );
  }
}
