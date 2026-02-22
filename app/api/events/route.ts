import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { EventSchema } from "@/lib/validators";

export async function GET(req: NextRequest) {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: "asc" },
    });
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const validated = EventSchema.parse(data);

    const event = await prisma.event.create({
      data: validated,
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create event" },
      { status: 400 }
    );
  }
}
