import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Scheme from "@/models/Scheme";

export async function POST(req: NextRequest) {
  await connectDB();

  const body = await req.json();

  const {
    state,
    category,
    gender,
    occupation,
    income,
  } = body;

  const query: any = {};

  // State
  if (state && state !== "All") {
    query.$or = [
      { states: state },
      { states: "All" },
    ];
  }

  // Category
  if (category) {
    query.category = category;
  }

  // Tags
  const tags: string[] = [];

  if (gender) tags.push(gender);
  if (occupation) tags.push(occupation);

  if (income === "Low") tags.push("BPL");

  if (tags.length) {
    query.tags = {
      $in: tags,
    };
  }

  const schemes = await Scheme.find(query)
    .limit(10)
    .lean();

  return Response.json({
    success: true,
    data: schemes,
  });
}