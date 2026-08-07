# 🇮🇳 YojanaSaarthi (योजना सारथी)

> **AI-Powered Citizen Assistance & Government Welfare Scheme Aggregator**

YojanaSaarthi is a modern, full-stack web application designed to bridge the gap between Indian citizens and government welfare programs. It empowers users to discover, filter, compare, and get AI-tailored recommendations across hundreds of Central and State government schemes.

---

## 🌟 Key Features

### 🔍 Comprehensive Scheme Directory
- **Multi-Factor Filtering**: Filter schemes by Category (Agriculture, Health, Education, Business, etc.), State/UT, Ministry, and Status (Active, Upcoming, Expired).
- **Instant Search**: Search by scheme title, keywords, ministry, or specific benefits with crash-proof query handling.

### 🤖 AI Virtual Scheme Assistant
- **Smart Demographic Questionnaire**: Answers 6 key questions regarding age, gender, state, occupation, income, and category.
- **Tailored Recommendations**: Uses intelligent matching algorithms to recommend the exact schemes the citizen is eligible for.

### ⚖️ Side-by-Side Scheme Comparison Matrix
- Compare up to 4 schemes simultaneously on key metrics: Benefits, Prerequisites, Target Audience, and Required Documents.
- Interactive search popover for adding schemes directly to the comparison view.

### 📌 User Dashboard & Profile Management
- **Bookmarking System**: Save schemes to personal bookmarks for quick access.
- **Recently Viewed Tracker**: Automatically logs recently inspected schemes.
- **Customizable Profile**: Update full name and avatar image (URL or Google OAuth picture).
- **Notifications**: Stay informed about new scheme additions and deadline alerts.

### 👑 Comprehensive Admin Management Portal
- **Dashboard Metrics**: View total users, active schemes, bookmarks count, and scraper stats.
- **Scheme CRUD**: Add, edit, preview, and delete government schemes with validation.
- **User Management**: View registered users, roles (Admin/User), and update privileges.
- **Scraper Control Center**: Run web scrapers manually or view automated scraping logs.
- **Activity Auditing**: Detailed activity logs tracking all admin actions.

### 🛡️ Arcjet Rate Limiter & Bot Security
- Protected with Arcjet Token Bucket rate-limiting (100 token capacity, 60 tokens/min refill).
- Shield defense against SQL injection, XSS attacks, and malicious bot traffic.

### ⚡ Automated Daily Web Scraping
- **GitHub Actions Workflow**: Runs a daily scheduled cron at **2:00 AM IST (8:30 PM UTC)**.
- Scrapes official government portals (such as MyScheme) to maintain accurate scheme data.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Proxy Middleware) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Frontend UI** | [React 19](https://react.dev/), [TailwindCSS v4](https://tailwindcss.com/), Lucide Icons, React Toastify |
| **Authentication** | [NextAuth.js v5](https://next-auth.js.org/) (Google OAuth & Credentials Provider) |
| **Database** | [MongoDB](https://www.mongodb.com/) with [Mongoose ORM](https://mongoosejs.com/) |
| **Security & Rate Limiting** | [Arcjet Security](https://arcjet.com/) |
| **Web Scraping** | Axios, Cheerio |
| **Automation** | GitHub Actions (`.github/workflows/scraper.yml`) |

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:
- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn** / **pnpm** / **bun**
- **MongoDB Database** (Local instance or MongoDB Atlas cluster URI)

---

### Environment Setup

Create a `.env` file in the root of the project by copying `.env.example`:

```bash
cp .env.example .env
```

Configure the required environment variables inside `.env`:

```env
# Database Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/yojanasaarthi?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_key_here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth Credentials (Optional for Google Sign-In)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Arcjet Rate Limiter Key
ARCJET_KEY=ajkey_your_arcjet_key_here
ARCJET_ENV=development

# Daily Cron Scraper Secret Token
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

   *If you experience any Turbopack dev cache lock issue, run:*
   ```bash
   npm run dev:clean
   ```

4. **Open in Browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to view YojanaSaarthi.

---

## 📂 Project Structure

```
yojana-saarthi/
├── .github/
│   └── workflows/
│       └── scraper.yml              # GitHub Actions Daily Scraper Cron Workflow
├── src/
│   ├── app/
│   │   ├── admin/                   # Admin Portal Pages (Dashboard, Schemes, Users, Scraper, Activity)
│   │   ├── api/                     # REST API Endpoints (Auth, Schemes, Bookmarks, Assistant, Cron)
│   │   ├── assistant/               # AI Assistant Questionnaire & Results
│   │   ├── compare/                 # Side-by-Side Scheme Comparison Matrix
│   │   ├── dashboard/               # User Dashboard (Saved Bookmarks, Stats, Profile)
│   │   ├── login/                   # Sign-in Page
│   │   ├── profile/                 # Profile Edit Page
│   │   ├── register/                # Registration Page
│   │   ├── schemes/                 # Scheme Directory & Scheme Detail Views
│   │   └── layout.tsx               # Root Layout & Session Providers
│   ├── components/
│   │   ├── admin/                   # Admin UI Components & Sidebars
│   │   ├── assistant/               # AI Assistant Questionnaire Components
│   │   ├── home/                    # Home Page Hero & Category Grids
│   │   ├── layout/                  # Header, Footer, and Navigation Bar
│   │   └── schemes/                 # Scheme Cards, Directory Filters, and Details View
│   ├── constants/                   # Categories, States, and Status Enums
│   ├── lib/
│   │   ├── apiClient.ts             # Client API Fetch Wrapper with Rate-Limit Toast Interceptor
│   │   ├── arcjet.ts                # Arcjet Security & Rate Limiter Config
│   │   ├── auth/                    # Role-based RequireUser & RequireAdmin Guards
│   │   └── db/                      # Mongoose Database Connection Singleton
│   ├── models/                      # MongoDB Schemas (User, Scheme, Bookmark, Activity, Notification)
│   ├── scrapers/                    # Web Scraping Service Modules (MyScheme, Government Portals)
│   ├── services/                    # Business Logic Layer (Scheme, User, Activity, Scraper Services)
│   ├── proxy.ts                     # Next.js 16 Security & Rate-Limiting Proxy Handler
│   └── utils/                       # Regex Escaping and Query Building Utilities
├── public/                          # Static Assets & Icons
├── .env.example                     # Environment Variables Template
├── package.json                     # Project Manifest & NPM Scripts
└── README.md                        # Documentation
```

---

## 📜 Available NPM Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js 16 development server with Turbopack |
| `npm run dev:clean` | Clears `.next` cache and starts the dev server cleanly |
| `npm run clean` | Removes `.next` build and cache directory |
| `npm run build` | Compiles the production build |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs ESLint check across all source files |

---

## 📄 License

This project is licensed under the **MIT License** – feel free to use, modify, and distribute for citizen welfare applications.

---

<p align="center">
  <b>Built for Citizen Welfare & Empowerment 🇮🇳</b>
</p>
