import axios from "axios";
import https from "https";
import * as cheerio from "cheerio";
import { ScrapedScheme } from "@/types/scraper";
import { bulkUpsertSchemes } from "@/services/scheme.service";
import { updateScraperJob } from "@/services/scraperJob.service";
import { connectDB } from "@/lib/db/mongoose";
import ScraperJob from "@/models/ScraperJob";

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const FLAGSHIP_PORTALS = [
  {
    title: "PM-Kisan Samman Nidhi",
    slug: "pm-kisan-samman-nidhi",
    url: "https://pmkisan.gov.in/",
    category: "Agriculture",
    ministry: "Ministry of Agriculture and Farmers Welfare",
    shortDescription: "Direct financial benefit of ₹6,000 per year in three equal installments to all eligible farmer families across India.",
    tags: ["Farmers", "Direct Benefit Transfer", "Income Support", "Agriculture"],
    states: ["All"],
  },
  {
    title: "PM Vishwakarma Scheme",
    slug: "pm-vishwakarma-scheme",
    url: "https://pmvishwakarma.gov.in/",
    category: "Skill Development",
    ministry: "Ministry of Micro, Small and Medium Enterprises",
    shortDescription: "End-to-end holistic support to traditional artisans and craftspeople including PM Vishwakarma Certificate, ID card, skill upgradation, toolkit incentive, and collateral-free credit.",
    tags: ["Artisans", "Craftsmen", "Loans", "Toolkits", "Skill Upgradation"],
    states: ["All"],
  },
  {
    title: "PM SVANidhi (Street Vendor's AtmaNirbhar Nidhi)",
    slug: "pm-svanidhi",
    url: "https://pmsvanidhi.mohua.gov.in/",
    category: "Business",
    ministry: "Ministry of Housing and Urban Affairs",
    shortDescription: "Micro-credit facility for urban street vendors to resume their livelihoods with working capital loans up to ₹50,000 with interest subsidy and digital transaction cashbacks.",
    tags: ["Street Vendors", "Working Capital", "Micro Credit", "Urban"],
    states: ["All"],
  },
  {
    title: "Pradhan Mantri Jan-Dhan Yojana (PMJDY)",
    slug: "pradhan-mantri-jan-dhan-yojana-pmjdy",
    url: "https://pmjdy.gov.in/",
    category: "Finance",
    ministry: "Ministry of Finance",
    shortDescription: "National mission for financial inclusion ensuring access to financial services, banking savings and deposit accounts, remittance, credit, insurance, and pension in an affordable manner.",
    tags: ["Financial Inclusion", "Zero Balance Account", "RuPay Card", "Banking"],
    states: ["All"],
  },
  {
    title: "Pradhan Mantri Mudra Yojana (PMMY)",
    slug: "pradhan-mantri-mudra-yojana-pmmy",
    url: "https://www.mudra.org.in/",
    category: "Finance",
    ministry: "Ministry of Finance",
    shortDescription: "Loans up to ₹20 lakh to non-corporate, non-farm small/micro enterprises under Shishu, Kishore, and Tarun categories through commercial banks, RRBs, and NBFCs.",
    tags: ["Mudra Loan", "MSME", "Entrepreneurship", "Credit"],
    states: ["All"],
  },
  {
    title: "Ayushman Bharat PM-JAY",
    slug: "ayushman-bharat-pm-jay",
    url: "https://pmjay.gov.in/",
    category: "Health",
    ministry: "Ministry of Health and Family Welfare",
    shortDescription: "World's largest government-funded health assurance scheme providing health cover of ₹5 lakh per family per year for secondary and tertiary care hospitalization to over 12 crore families.",
    tags: ["Health Insurance", "Cashless Hospitalization", "Golden Card", "Healthcare"],
    states: ["All"],
  },
  {
    title: "Pradhan Mantri Awas Yojana - Urban (PMAY-U)",
    slug: "pradhan-mantri-awas-yojana-urban-pmay-u",
    url: "https://pmaymis.gov.in/",
    category: "Housing",
    ministry: "Ministry of Housing and Urban Affairs",
    shortDescription: "Housing for All mission providing pucca houses with basic amenities to all eligible urban households including slum dwellers, EWS, and LIG categories.",
    tags: ["Housing", "Urban Development", "Subsidy", "PMAY"],
    states: ["All"],
  },
  {
    title: "Atal Pension Yojana (APY)",
    slug: "atal-pension-yojana-apy",
    url: "https://www.npscra.nsdl.co.in/",
    category: "Senior Citizens",
    ministry: "Ministry of Finance",
    shortDescription: "Guaranteed monthly pension ranging from ₹1,000 to ₹5,000 to unorganized sector workers starting at age 60, managed by PFRDA.",
    tags: ["Pension", "Social Security", "Retirement", "Unorganized Sector"],
    states: ["All"],
  },
];

/**
 * Scrapes and enriches National Flagship Schemes directly from official government portals
 */
export async function runFlagshipScraperLoop(jobId: string) {
  console.log(`[Scraper] Starting National Flagship Portals scrape for job ${jobId}`);

  try {
    await connectDB();

    const total = FLAGSHIP_PORTALS.length;

    await updateScraperJob(jobId, {
      totalSchemes: total,
      importedSchemes: 0,
      currentOffset: 0,
    });

    // Check if stopped before starting
    const initialCheck = await ScraperJob.findById(jobId).select("status").lean();
    if (initialCheck?.status === "Stopped") {
      console.log(`[Scraper] Flagship scraper job ${jobId} was stopped before starting.`);
      return;
    }

    // Process all flagship portals concurrently in parallel
    const schemes: ScrapedScheme[] = await Promise.all(
      FLAGSHIP_PORTALS.map(async (portal) => {
        let liveTitle = portal.title;
        let liveDescription = portal.shortDescription;

        try {
          const response = await axios.get(portal.url, {
            httpsAgent,
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
              Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            },
            timeout: 4000,
          });

          const $ = cheerio.load(response.data);
          const pageTitle = $("title").text().trim();
          const metaDesc =
            $('meta[name="description"]').attr("content")?.trim() ||
            $('meta[property="og:description"]').attr("content")?.trim();

          if (pageTitle && pageTitle.length > 5 && pageTitle.length < 120) {
            liveTitle = pageTitle.replace(/\s+/g, " ");
          }
          if (metaDesc && metaDesc.length > 20) {
            liveDescription = metaDesc.slice(0, 250);
          }
        } catch {
          // fallback to curated official metadata
        }

        return {
          title: liveTitle,
          slug: portal.slug,
          shortDescription: liveDescription,
          description: `${portal.shortDescription}\n\nOfficial Portal: ${portal.url}`,
          category: portal.category,
          ministry: portal.ministry,
          benefits: ["Direct financial or welfare assistance as per Central Government scheme guidelines."],
          documents: ["Aadhaar Card", "Bank Account Details", "Income/Category Certificate (if applicable)"],
          tags: portal.tags,
          states: portal.states,
          officialUrl: portal.url,
          source: "NationalFlagship",
          sourceUrl: portal.url,
        };
      })
    );

    // Check if stopped during processing
    const midCheck = await ScraperJob.findById(jobId).select("status").lean();
    if (midCheck?.status === "Stopped") {
      return;
    }

    if (schemes.length > 0) {
      await bulkUpsertSchemes(schemes);
    }

    await updateScraperJob(jobId, {
      importedSchemes: schemes.length,
      currentOffset: schemes.length,
      status: "Completed",
      finishedAt: new Date(),
    });

    console.log(`[Scraper] Completed Flagship job ${jobId}: ${schemes.length}/${total} schemes`);
  } catch (err: any) {
    console.error(`[Scraper] Flagship scraper failed:`, err);
    const finalJob = await ScraperJob.findById(jobId).select("status").lean();
    if (finalJob?.status === "Stopped") {
      return;
    }
    await updateScraperJob(jobId, {
      status: "Failed",
      finishedAt: new Date(),
      error: err?.message ?? "Unknown error",
    });
    throw err;
  }
}
