import { scraperHttp } from "@/lib/scraper/http";

const BASE_URL = "https://api.myscheme.gov.in/search/v6/schemes";

const API_KEY = process.env.MYSCHEME_API_KEY!;

type FetchSchemesParams = {
  from?: number;
  size?: number;
  keyword?: string;
};

export async function fetchSchemes({
  from = 0,
  size = 10,
  keyword = "",
}: FetchSchemesParams = {}) {
  const response = await scraperHttp.get(BASE_URL, {
    params: {
      lang: "en",
      q: "[]",
      keyword,
      sort: "",
      from,
      size,
    },
    headers: {
      "x-api-key": API_KEY,
      Origin: "https://www.myscheme.gov.in",
      Referer: "https://www.myscheme.gov.in/",
    },
  });

  return response.data;
}

export async function fetchSchemeBySlug(slug: string) {
  const response = await scraperHttp.get(BASE_URL, {
    params: {
      lang: "en",
      slug,
    },
    headers: {
      "x-api-key": API_KEY,
      Origin: "https://www.myscheme.gov.in",
      Referer: "https://www.myscheme.gov.in/",
    },
  });

  return response.data;
}