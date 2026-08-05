import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { requireUser } from "@/lib/auth/requireUser";
import Notification from "@/models/Notification";
import { AuthError } from "@/lib/auth/requireAdmin";

export async function GET() {
  try {
    await connectDB();

    const user = await requireUser();

    const notifications = await Notification.find({
      userId: user._id,
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: notifications,
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

export async function PUT() {
  try {
    await connectDB();
    const user = await requireUser();

    await Notification.updateMany(
      { userId: user._id, isRead: false },
      { isRead: true }
    );

    return NextResponse.json({
      success: true,
      message: "All notifications marked as read.",
    });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.status }
      );
    }
    console.error("Failed to mark notifications as read:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}