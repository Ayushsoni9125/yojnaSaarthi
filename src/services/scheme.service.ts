import Scheme from "@/models/Scheme";
import { SchemeInput } from "@/validations/scheme";

export async function createScheme(data: SchemeInput) {
  const scheme = await Scheme.create(data);
  return scheme;
}

export async function getAllSchemes() {
  return await Scheme.find().sort({
    createdAt: -1,
  });
}

export async function getSchemeBySlug(slug: string) {
  return await Scheme.findOne({
    slug,
  });
}

export async function deleteScheme(id: string) {
  return await Scheme.findByIdAndDelete(id);
}