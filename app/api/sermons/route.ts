import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SermonSchema } from "@/lib/validators";

export async function GET(req: NextRequest) {
  try {
    const sermons = await prisma.sermon.findMany({
      orderBy: { date: "desc" },
    });
    return NextResponse.json(sermons);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch sermons" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const validated = SermonSchema.parse(data);

    const sermon = await prisma.sermon.create({
      data: validated,
    });

    return NextResponse.json(sermon, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create sermon" },
      { status: 400 }
    );
  }
}
