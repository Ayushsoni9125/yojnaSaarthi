import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { recommendSchemes } from "@/services/recommendation.service";

export async function POST(req: NextRequest) {
  await connectDB();

  const body = await req.json();

  const schemes = await recommendSchemes(body);

  return Response.json({
    success: true,
    data: schemes,
  });
}