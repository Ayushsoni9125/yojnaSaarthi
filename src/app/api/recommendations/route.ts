import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { requireUser } from "@/lib/auth/requireUser";
import RecentlyViewed from "@/models/RecentlyViewed";
import Scheme from "@/models/Scheme";
import { AuthError } from "@/lib/auth/requireAdmin";

export async function GET() {
  try {
    await connectDB();

    const user = await requireUser();

    // Get recently viewed schemes
    const recent = await RecentlyViewed.find({ userId: user._id })
      .populate("schemeId", "category")
      .sort({ viewedAt: -1 })
      .limit(10)
      .lean();

    // Extract categories
    const categories = [
      ...new Set(
        recent
          .map((item: any) => item.schemeId?.category)
          .filter(Boolean)
      ),
    ];

    if (categories.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    // Recommend schemes from same categories
    const recommendations = await Scheme.find({
      category: { $in: categories },
      _id: {
        $nin: recent.map((item: any) => item.schemeId?._id),
      },
    })
      .limit(6)
      .select("title slug shortDescription category ministry status")
      .lean();

    return NextResponse.json({
      success: true,
      data: recommendations,
    });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: error.status,
        }
      );
    }

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}