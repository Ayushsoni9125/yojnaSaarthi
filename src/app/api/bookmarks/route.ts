import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Bookmark from "@/models/Bookmark";
import "@/models/Scheme";
import "@/models/User";
import { requireUser } from "@/lib/auth/requireUser";
import { AuthError } from "@/lib/auth/requireAdmin";

export async function GET() {
  try {
    await connectDB();
    const user = await requireUser();

    const rawBookmarks = await Bookmark.find({ userId: user._id })
      .populate("schemeId", "title slug shortDescription category ministry status")
      .sort({ createdAt: -1 })
      .lean();

    const bookmarks = rawBookmarks.filter((b: any) => b.schemeId != null);

    return Response.json({ success: true, data: bookmarks });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return Response.json({ success: false, message: error.message }, { status: error.status });
    }
    console.error("GET bookmarks error:", error);
    return Response.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

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
    if (error instanceof AuthError) {
      return Response.json(
        {
          success: false,
          message: error.message,
        },
        { status: error.status }
      );
    }

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

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const user = await requireUser();

    const { searchParams } = new URL(req.url);
    let schemeId = searchParams.get("schemeId");

    if (!schemeId) {
      try {
        const body = await req.json();
        schemeId = body?.schemeId;
      } catch {
        // body may be empty
      }
    }

    if (!schemeId) {
      return Response.json(
        { success: false, message: "Scheme ID is required." },
        { status: 400 }
      );
    }

    const bookmark = await Bookmark.findOneAndDelete({
      userId: user._id,
      schemeId,
    });

    if (!bookmark) {
      return Response.json(
        { success: false, message: "Bookmark not found." },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Bookmark removed.",
    });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return Response.json(
        { success: false, message: error.message },
        { status: error.status }
      );
    }
    console.error("DELETE bookmark error:", error);
    return Response.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}