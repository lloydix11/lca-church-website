import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const registration = await prisma.campRegistration.findUnique({
      where: { id: parseInt(id) },
    });

    if (!registration) {
      return NextResponse.json(
        { error: "Registration not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(registration);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch registration" },
      { status: 400 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    
    // Allow updating any of these fields
    const allowedFields = {
      fullName: body.fullName,
      facebookUrl: body.facebookUrl,
      contactNumber: body.contactNumber,
      emergencyContactNumber: body.emergencyContactNumber,
      invitedBy: body.invitedBy,
      amountPaid: body.amountPaid,
      screenshotSentEmail: body.screenshotSentEmail,
      status: body.status,
    };
    
    // Filter out undefined fields
    const updateData = Object.fromEntries(
      Object.entries(allowedFields).filter(([, v]) => v !== undefined)
    );

    const registration = await prisma.campRegistration.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return NextResponse.json(registration);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update registration" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.campRegistration.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Registration deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete registration" },
      { status: 400 }
    );
  }
}
