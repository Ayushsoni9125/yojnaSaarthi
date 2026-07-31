import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Scheme from "@/models/Scheme";

export async function GET() {
  return NextResponse.json({
    message: "Schemes API is working 🚀",
  });
}

export async function POST() {
  try {
    await connectDB();

    const scheme = await Scheme.create({
      title: "Pradhan Mantri Kisan Samman Nidhi",
      slug: "pm-kisan-samman-nidhi",
      shortDescription: "Income support scheme for eligible farmers.",
      description:
        "Provides financial assistance of ₹6000 per year in three installments.",
      category: "Agriculture",
      ministry: "Ministry of Agriculture",
      officialUrl: "https://pmkisan.gov.in",
      status: "Active",
    });

    return NextResponse.json(
      {
        success: true,
        data: scheme,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create scheme",
      },
      { status: 500 }
    );
  }
}