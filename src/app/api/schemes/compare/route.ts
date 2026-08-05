import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Scheme from "@/models/Scheme";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get("ids");

    if (!idsParam) {
      return NextResponse.json(
        { success: false, message: "No scheme IDs provided." },
        { status: 400 }
      );
    }

    const ids = idsParam.split(",").filter((id) => id.trim().length > 0);

    if (ids.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid scheme IDs." },
        { status: 400 }
      );
    }

    // Fetch schemes by ID list
    const schemes = await Scheme.find({ _id: { $in: ids } }).lean();

    // Map to ensure stable order matching the requested ID list order
    const orderedSchemes = ids
      .map((id) => schemes.find((s) => s._id.toString() === id))
      .filter(Boolean);

    return NextResponse.json({ success: true, data: orderedSchemes });
  } catch (error: any) {
    console.error("Failed to fetch schemes for comparison:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
