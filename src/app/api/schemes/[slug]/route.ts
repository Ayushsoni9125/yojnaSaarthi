import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { getSchemeBySlug } from "@/services/scheme.service";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  await connectDB();

  const { slug } = await params;

  const scheme = await getSchemeBySlug(slug);

  if (!scheme) {
    return NextResponse.json(
      {
        success: false,
        message: "Scheme not found",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: scheme,
  });
}