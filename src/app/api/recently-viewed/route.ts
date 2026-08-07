import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { requireUser } from "@/lib/auth/requireUser";
import RecentlyViewed from "@/models/RecentlyViewed";
import { AuthError } from "@/lib/auth/requireAdmin";

export async function GET() {
  try {
    await connectDB();
    const user = await requireUser();

    // Fetch the 10 most recently viewed schemes, populated with scheme details
    const recent = await RecentlyViewed.find({ userId: user._id })
      .sort({ viewedAt: -1 })
      .limit(10)
      .populate("schemeId", "title slug shortDescription category ministry status")
      .lean();

    // Format to match the expected scheme format in frontend
    const formatted = recent
      .map((item: any) => {
        if (!item.schemeId) return null;
        return {
          ...item.schemeId,
          _id: item.schemeId._id.toString(),
          viewedAt: item.viewedAt,
        };
      })
      .filter(Boolean);

    return NextResponse.json({ success: true, data: formatted });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.status }
      );
    }
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await requireUser();

    const body = await req.json();
    const { schemeId } = body;

    if (!schemeId) {
      return NextResponse.json(
        { success: false, message: "Scheme ID is required." },
        { status: 400 }
      );
    }

    // Upsert view record to update viewedAt timestamp or create new one
    const record = await RecentlyViewed.findOneAndUpdate(
      { userId: user._id, schemeId },
      { viewedAt: new Date() },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    );

    return NextResponse.json({
      success: true,
      message: "Recently viewed saved.",
      data: record,
    });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.status }
      );
    }
    console.error("Failed to save recently viewed:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
