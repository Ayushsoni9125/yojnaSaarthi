import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Bookmark from "@/models/Bookmark";
import { requireUser } from "@/lib/auth/requireUser";
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const user = await requireUser();

    const { schemeId } = await req.json();

    if (!schemeId) {
      return Response.json(
        {
          success: false,
          message: "Scheme ID is required.",
        },
        { status: 400 }
      );
    }

    const bookmark = await Bookmark.create({
      userId: user._id,
      schemeId,
    });

    return Response.json({
      success: true,
      data: bookmark,
      message: "Scheme bookmarked successfully.",
    });
  } catch (error: any) {
    // Duplicate bookmark
    if (error.code === 11000) {
      return Response.json(
        {
          success: false,
          message: "Scheme already bookmarked.",
        },
        { status: 409 }
      );
    }

    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}