import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { verifyAdminPassword, createAdminSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    const isValid = await verifyAdminPassword(password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    await createAdminSession();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to authenticate" },
      { status: 500 }
    );
  }
}
