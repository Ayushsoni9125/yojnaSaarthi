import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";

export async function GET() {
  try {
    await connectDB();

    return NextResponse.json({
      success: true,
      message: "Database Connected Successfully 🚀",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Database Connection Failed",
      },
      { status: 500 }
    );
  }
}