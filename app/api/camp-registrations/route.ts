import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CampRegistrationSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const registrations = await prisma.campRegistration.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(registrations);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch registrations" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const validated = CampRegistrationSchema.parse(data);

    const registration = await prisma.campRegistration.create({
      data: validated,
    });

    return NextResponse.json(registration, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create registration" },
      { status: 400 }
    );
  }
}
