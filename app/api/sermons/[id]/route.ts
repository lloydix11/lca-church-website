import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { SermonSchema } from "@/lib/validators";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sermon = await prisma.sermon.findUnique({
      where: { id: parseInt(id) },
    });

    if (!sermon) {
      return NextResponse.json({ error: "Sermon not found" }, { status: 404 });
    }

    return NextResponse.json(sermon);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch sermon" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();
    const validated = SermonSchema.parse(data);

    const sermon = await prisma.sermon.update({
      where: { id: parseInt(id) },
      data: validated,
    });

    return NextResponse.json(sermon);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update sermon" },
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
    await prisma.sermon.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete sermon" },
      { status: 500 }
    );
  }
}
