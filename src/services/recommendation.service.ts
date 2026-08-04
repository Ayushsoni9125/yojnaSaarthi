import Scheme from "@/models/Scheme";

type RecommendationInput = {
  state?: string;
  gender?: string;
  age?: string;
  occupation?: string;
  income?: string;
  category?: string;
  disability?: string;
  maritalStatus?: string;
};

export async function recommendSchemes(
  input: RecommendationInput
) {
  const query: any = {};

  // Filter by state
  if (input.state) {
    query.states = {
      $in: [input.state, "All"],
    };
  }

  const schemes = await Scheme.find(query).lean();

  const scoredSchemes = schemes
    .map((scheme) => {
      let score = 0;

      const tags = scheme.tags || [];

      if (
        input.gender &&
        tags.includes(input.gender)
      )
        score += 3;

      if (
        input.occupation &&
        tags.includes(input.occupation)
      )
        score += 3;

      if (
        input.category &&
        input.category !== "General" &&
        tags.includes(input.category)
      )
        score += 3;

      if (
        input.disability === "Yes" &&
        tags.includes("Disability")
      )
        score += 4;

      return {
        ...scheme,
        score,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);

  return scoredSchemes;
}