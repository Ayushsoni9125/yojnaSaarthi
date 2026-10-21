# 🇮🇳 YojanaSaarthi (योजना सारथी)

> **AI-Powered Citizen Assistance & Government Welfare Scheme Aggregator**  
> *Bridging Indian Citizens with Central & State Welfare Programs in Multiple Languages.*

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Deployment](https://img.shields.io/badge/Deployed-Vercel-black?style=flat&logo=vercel)](https://yojna-saarthi.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

**Live Portal:** [https://yojna-saarthi.vercel.app](https://yojna-saarthi.vercel.app)

---

## 🌟 Key Features

### 🔍 1. Massive Multi-Source Scheme Directory (4,750+ Schemes)
* **Comprehensive Coverage:** Aggregates and continuously synchronizes **4,750+ verified government welfare programs** from **9 official government portals**:
  * **MyScheme National Portal:** Aggregates schemes across all 28 States, 8 Union Territories, and Central Ministries.
  * **8 Direct Central Ministry Flagship Portals:**
    * **PM-Kisan Samman Nidhi** (`pmkisan.gov.in`) – Ministry of Agriculture & Farmers Welfare
    * **PM Vishwakarma** (`pmvishwakarma.gov.in`) – Ministry of MSME
    * **PM SVANidhi** (`pmsvanidhi.mohua.gov.in`) – Ministry of Housing & Urban Affairs
    * **PM Jan-Dhan Yojana (PMJDY)** (`pmjdy.gov.in`) – Ministry of Finance
    * **PM MUDRA Yojana (PMMY)** (`mudra.org.in`) – Ministry of Finance
    * **Ayushman Bharat PM-JAY** (`pmjay.gov.in`) – National Health Authority / MoHFW
    * **PM Awas Yojana - Urban (PMAY-U)** (`pmay-urban.gov.in`) – Ministry of Housing & Urban Affairs
    * **Atal Pension Yojana (APY)** (`npscra.nsdl.co.in`) – PFRDA
* **Multi-Factor Filtering:** Filter effortlessly by Category (Agriculture, Health, Education, Housing, Finance, etc.), State/UT, Ministry, and Status.
* **Instant Search:** Full-text search across titles, descriptions, and eligibility criteria with search query escaping.

---

### 🌐 2. Multi-Language Indian Government Portal Support
* **Native Language Switcher:** Integrated in the navbar across desktop and mobile phone views.
* **12 Supported Official Indian Languages:**
  * **English**, **हिन्दी** (Hindi), **मराठी** (Marathi), **বাংলা** (Bengali), **தமிழ்** (Tamil), **తెలుగు** (Telugu), **ગુજરાતી** (Gujarati), **ಕನ್ನಡ** (Kannada), **ਪੰਜਾਬੀ** (Punjabi), **മലയാളം** (Malayalam), **ଓଡ଼ିଆ** (Odia), and **اردو** (Urdu).
* **Complete Real-Time Translation:** Translates scheme details, criteria, forms, and recommendations dynamically without layout disruption.

---

### 🤖 3. AI Virtual Scheme Assistant
* **Demographic Matching Questionnaire:** Evaluates age, gender, state of residence, occupation, annual income, social category, specially-abled status, and marital status (*Unmarried*, *Married*, *Widowed*, *Divorced*).
* **Intelligent Scoring Algorithm:** Weighs target tags, eligibility prerequisites, and benefits to provide a tailored list of schemes a citizen can directly apply for.

---

### ⚖️ 4. Side-by-Side Scheme Comparison Matrix
* **Multi-Scheme Evaluator:** Compare up to 3 government schemes side-by-side.
* **Granular Attribute Breakdown:** Compare benefits, eligibility rules, target demographic tags, and required documentation side-by-side.

---

### 📌 5. Instagram-Style Heart Bookmarking & User Dashboard
* **Dynamic Bookmark Toggle:** Clean outline heart icon before bookmarking; clicking instantly turns it into a vibrant filled red heart with smooth pop micro-animations.
* **Optimistic Local Synchronization:** Real-time state updates across all cards, listings, and the dashboard without lag.
* **Personalized Dashboard:** Track saved bookmarks, recently inspected schemes, notification alerts, and quick profile management.

---

### 👑 6. Real-Time Scraper & Admin Management Center
* **Multi-Source Selector:** Admin dropdown to run synchronizations by source:
  * *MyScheme Portal* (4,770+ Central & State Schemes)
  * *National Flagship Portals* (Direct Ministry Sites)
  * *All Sources* (Combined synchronization)
* **Instant Scraper Stop Button:** Abort long-running scraper jobs safely with a single click.
* **Automatic Scheme Reconciliation:** Automatically detects and purges obsolete or discontinued schemes from MongoDB at the end of each scrape.
* **Indian Standard Time (IST):** Formatted timestamps in `Asia/Kolkata` across the entire administrative dashboard.
* **Administrative Audit Logs:** Activity auditing and role-based user management.

---

### 🛡️ 7. Enterprise Security & Rate Limiting
* **Arcjet Token Bucket Rate Limiting:** 100 token capacity with refill rate to shield APIs from abuse.
* **Bot & Injection Defense:** Proactive defense against malicious scrapers, SQL/NoSQL injection, and XSS attacks.
* **SSL Resiliency:** Custom HTTPS agents handling Indian PKI certificates for NIC/Gov servers.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Dynamic Routes) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (Strict Mode) |
| **UI & Styling** | [React 19](https://react.dev/), [TailwindCSS v4](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/), React Toastify |
| **Authentication** | [NextAuth.js v5](https://next-auth.js.org/) (Google OAuth & Credentials Provider) |
| **Database** | [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) |
| **Rate Limiting & Security** | [Arcjet Security](https://arcjet.com/) |
| **Web Scraping** | Axios, Cheerio, Custom HTTPS Agent with Indian PKI validation handling |
| **Localization** | Google Website Translator Engine with persistent language cookies |
| **CI/CD & Automation** | GitHub Actions (`.github/workflows/scraper.yml`), Vercel Deployment |

---

## 🚀 Getting Started

### Prerequisites

* **Node.js** (v18.17.0 or higher)
* **npm**, **pnpm**, or **yarn**
* **MongoDB** connection string (Local instance or MongoDB Atlas cluster)

---

### Environment Setup

1. Copy `.env.example` into `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in the required environment variables:
   ```env
   # Database Connection
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/yojanasaarthi?retryWrites=true&w=majority

   # NextAuth Authentication
   NEXTAUTH_SECRET=your_super_secret_nextauth_key
   NEXTAUTH_URL=http://localhost:3000

   # Google OAuth (Optional - for Google One-Tap Sign In)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret

   # Arcjet Security & Rate Limiting
   ARCJET_KEY=ajkey_your_arcjet_key_here
   ARCJET_ENV=development

   # Daily Automated Scraper Cron Token
   CRON_SECRET=your_cron_secret_token_here
   ```

---

### Installation & Execution

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Ayushsoni9125/yojnaSaarthi.git
   cd yojnaSaarthi/yojana-saarthi
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the Development Server**:
   ```bash
   npm run dev
   ```

4. **Visit the Web App**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Architecture

```
yojana-saarthi/
├── .github/
│   └── workflows/
│       └── scraper.yml              # Daily Automated Scraper Cron
├── src/
│   ├── app/
│   │   ├── admin/                   # Admin Panel (Dashboard, Schemes, Users, Scraper, Activity)
│   │   ├── api/                     # API Endpoints (Auth, Schemes, Bookmarks, Assistant, Scraper)
│   │   ├── assistant/               # AI Scheme Assistant Questionnaire & Results
│   │   ├── compare/                 # Scheme Comparison Tool
│   │   ├── dashboard/               # Citizen Dashboard (Saved Bookmarks, Quick Actions)
│   │   ├── profile/                 # Profile Settings & Editing
│   │   ├── schemes/                 # Directory Catalog & Detailed Scheme View
│   │   ├── globals.css              # TailwindCSS & Portal Styles
│   │   └── layout.tsx               # Root Layout, Providers & Analytics
│   ├── components/
│   │   ├── admin/                   # Admin Scraper Controls & Tables
│   │   ├── assistant/               # AI Assistant Form Steps
│   │   ├── home/                    # Hero Search, Categories, Step Guides, CTAs
│   │   ├── layout/                  # Header, Footer, LanguageSelector
│   │   └── schemes/                 # SchemeCard, SchemeDetailsClient, Filters
│   ├── lib/
│   │   ├── bookmarks.ts             # Client-side Bookmark Sync & Cache Utility
│   │   ├── arcjet.ts                # Arcjet Security Rules & Rate Limiter
│   │   ├── auth/                    # Route Guards (requireUser, requireAdmin)
│   │   └── db/                      # Mongoose Singleton Connection
│   ├── models/                      # MongoDB Schemas (User, Scheme, Bookmark, Activity, ScraperJob)
│   ├── services/
│   │   ├── scrapers/
│   │   │   ├── myscheme/            # MyScheme National Portal Scraper & Reconciliation Engine
│   │   │   └── flagship/            # 8 Central Flagship Ministry Portals Scraper
│   │   ├── scheme.service.ts        # Scheme CRUD & Deduplicated Bulk Upsert
│   │   └── recommendation.service.ts# AI Demographic Eligibility Scorer
│   └── utils/                       # Search Sanitization & Query Builders
├── public/                          # Static Assets & Icons
├── package.json                     # NPM Dependencies & Scripts
└── README.md                        # Documentation
```

---

## 📜 Available NPM Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server with Turbopack |
| `npm run build` | Compiles an optimized production build |
| `npm run start` | Boots the compiled production server |
| `npm run dev:clean` | Purges `.next` cache and launches the dev server |
| `npm run clean` | Deletes `.next` build artifacts |
| `npm run lint` | Runs ESLint validation across the codebase |

---

## 📄 License

This project is open-source and released under the **[MIT License](LICENSE)**.

---

<p align="center">
  <b>🇮🇳 Built for Citizen Empowerment, Digital Inclusion & Welfare Awareness 🇮🇳</b>
</p>
