# Artha Finance (अर्थா) — Intelligent Personal Finance & Wealth Platform

> **A production-grade, international-standard full-stack personal finance and wealth management platform built with the MERN stack.**  
> Crafted by **Krish Verma**.

[![Platform](https://img.shields.io/badge/Platform-Web-059669.svg)]()
[![Stack](https://img.shields.io/badge/Stack-MERN%20+%20TailwindCSS-10b981.svg)]()
[![Languages](https://img.shields.io/badge/i18n-5%20Indian%20Languages-6366f1.svg)]()
[![Themes](https://img.shields.io/badge/Themes-Light%20%7C%20Dark%20%7C%20System-amber-500.svg)]()
[![Security](https://img.shields.io/badge/Security-HTTP--Only%20Cookies%20%7C%20JWT%20%7C%20Bcrypt-rose-500.svg)]()

---

## 1. Product Overview

**Artha Finance** is an institutional-grade personal wealth and expense management system engineered to provide consumers, professionals, and freelancers with complete transparency into their cash flows, savings runways, and category spending velocities.

Instead of a generic CRUD prototype, Artha is architected like an international fintech SaaS product:
- **Zero-Friction Startup**: Features full MongoDB/Mongoose schemas with an embedded resilient database fallback that works out-of-the-box in local environments even without external database daemons running.
- **Audited Tri-Mode Theming**: Pixel-perfect **Light Mode**, **Dark Mode** (deep obsidian surfaces with WCAG AA+ contrast), and **System Auto Mode**.
- **Pan-Indian Localization (i18n)**: Seamless instant switching between **English**, **Hindi (हिन्दी)**, **Kannada (ಕನ್ನಡ)**, **Tamil (தமிழ்)**, and **Telugu (తెలుగు)**.
- **Genuine Financial Intelligence**: Dynamic algorithms calculate month-over-month spending acceleration, largest expense drivers, and deficit warnings strictly from real user transactions.
- **Bank-Grade Security**: Strict authorization scoping on every query, SHA-256 OTP hashing with 5-minute expirations, bcrypt password hashing (12 rounds), and HttpOnly cookie session isolation.

---

## 2. Core Technology Stack

### Frontend Architecture
- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 + Vanilla CSS Design Tokens (High-Contrast Theme Engine)
- **Routing**: React Router v7
- **Data Visualization**: Recharts (Customized Area charts with gradients, Donut charts with category color tokens)
- **Iconography**: Lucide React Icons
- **State & Providers**: React Context API (`AuthContext`, `ThemeContext`, `I18nContext`, `ToastContext`)
- **HTTP Client**: Axios with `withCredentials: true`

### Backend Architecture
- **Runtime**: Node.js v24 (ES Modules)
- **Server Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM + Resilient Local Embedded Fallback Adapter
- **Security & Headers**: Helmet, CORS with credentials whitelist, Express Rate Limiter
- **Authentication**: JWT (JSON Web Tokens) in `HttpOnly` Secure Cookies, bcryptjs (12 salt rounds), SHA-256 OTP hashing

---

## 3. High-Level System Architecture

```
                               ┌──────────────────────────────────────────────────────────┐
                               │           ARTHA WEB CLIENT (React 19 + Vite 8)           │
                               │  - ThemeContext (Light / Dark / System Auto)             │
                               │  - I18nContext (en, hi, kn, ta, te)                      │
                               │  - AuthContext (JWT HttpOnly Session + Memory Hydration) │
                               │  - ToastContext & Realtime Financial Calculation Engine  │
                               └────────────────────────────┬─────────────────────────────┘
                                                            │ REST (withCredentials: true)
                                                            ▼
                               ┌──────────────────────────────────────────────────────────┐
                               │             EXPRESS.JS REST API (Port 5000)              │
                               │  - Security: Helmet, CORS Whitelist, Cookie Parser       │
                               │  - Rate Limiters: authLimiter, otpLimiter                │
                               │  - Middlewares: protect (JWT verify), Centralized Errors │
                               ├────────────────────────────┬─────────────────────────────┤
                               │ Controllers:               │ Analytics & Insights:       │
                               │  - authController          │  - insightEngine.js         │
                               │  - transactionController   │  - dashboardController      │
                               │  - budgetController        │  - seedService.js           │
                               └────────────────────────────┬─────────────────────────────┘
                                                            │ Mongoose Schemas & Adapters
                                                            ▼
                               ┌──────────────────────────────────────────────────────────┐
                               │           PERSISTENCE LAYER (User-Scoped Isolation)      │
                               │  - Users (Credentials, Locale, Theme, Preferences)       │
                               │  - Transactions (User, Type, Cat, Amount, Date, Notes)   │
                               │  - Budgets (User, Cat, Limit Amount, Month, Year)        │
                               │  - Otps (Hashed code, Expiry, Attempts)                  │
                               └──────────────────────────────────────────────────────────┘
```

---

## 4. Key Feature Suite

### 1. Splash / Intro Experience
- **Session-Guarded Motion**: Elegant 3-second animated reveal displaying the Artha geometric emblem, "Welcome to Artha Finance", and "Made by Krish Verma".
- Guarded by `sessionStorage` (`artha_splash_seen`) so it triggers once per fresh session and **never** re-runs on route changes or internal interactions.
- Includes a smooth "Skip intro" control for immediate access.

### 2. Tri-Mode Visual Design System
- **Light Mode**: Crisp neutral background (`#f8fafc`), clean surface cards, and dark legible typography (`#0f172a`).
- **Dark Mode**: Deep obsidian fintech background (`#090d16`), layered elevated surfaces (`#0f172a`, `#1e293b`), high-contrast borders, and vivid readable chart legends.
- **System Mode**: Dynamically follows your operating system's dark/light preference via `prefers-color-scheme` listeners.

### 3. Multi-Lingual Internationalization (i18n)
Full localization across 5 Indian regional languages:
1. **English (en)**
2. **Hindi (hi - हिन्दी)**
3. **Kannada (kn - ಕನ್ನಡ)**
4. **Tamil (ta - தமிழ்)**
5. **Telugu (te - తెలుగు)**

Translations cover every interactive string: Navigation, KPIs, Transaction table, Budget progress, Smart Insights, Settings, Validation messages, and Empty states.

### 4. Financial Dashboard
- **Period Filter**: Dynamically filter between *This Week*, *This Month*, *Last Month*, *Last 3 Months*, and *This Year*.
- **4 Key Financial Metric Cards**:
  1. **Total Balance**: Live net portfolio liquidity.
  2. **Period Income**: Inflow with growth indicator.
  3. **Period Expenses**: Total recorded expenditure outflow.
  4. **Net Savings**: Difference between income and expenses, paired with real-time **Savings Rate %**.
- **Interactive Visualizations**:
  - **Income vs. Expense Trend**: Area chart with dual gradient fills and custom formatted financial tooltips.
  - **Expense Category Distribution**: Interactive Donut chart with category colors (Amber for Food, Indigo for Housing, Sky for Transport, Violet for Utilities, Emerald for Investments).
- **Recent Activity Ledger**: Quick-access transaction list with one-click Add Transaction.
- **Smart Insights Widget**: Live highlights of current spending pace.

### 5. Transaction Management
- **Complete CRUD**: Record, view, edit, and delete transactions.
- **Search & Multi-Filter**: Real-time search across description, merchant, or notes; filter by Type (`Income` / `Expense`), Category, Date Range, and Amount.
- **Sorting**: Newest first, Oldest first, Highest amount, Lowest amount.
- **Desktop vs. Mobile Responsive Views**:
  - Desktop: Professional financial data table with category badges, directional arrows, and action buttons.
  - Mobile: Adaptive touch-friendly cards.
- **CSV Export Engine**: Exports filtered transactions directly to downloadable `.csv` spreadsheet files with formatted date, description, category, and INR amounts.

### 6. Category Budgets & Over-Budget Alerts
- Configure monthly spending caps for individual categories (Food & Dining, Transport, Housing, Shopping, Utilities, Entertainment, etc.).
- Real-time aggregation of actual monthly consumption against allocated limits.
- Color-coded progress bars and status badges:
  - `Within budget` (Green, <80%)
  - `Near limit` (Amber, 80% – 99%)
  - `Over budget` (Rose Red, ≥100%)

### 7. Algorithmic Smart Insights
- Rule-based algorithmic analysis computed strictly from real user transactions:
  - **Month-over-Month Velocity**: Detects spending acceleration or deceleration vs. previous month.
  - **Expense Drivers**: Highlights the single category consuming the largest share of total cash flow.
  - **Deficit & Runway Alerts**: Identifies when outflow exceeds income and quantifies the deficit in ₹.
  - **Budget Warnings**: Flags categories nearing or breaching limits.

### 8. Settings & 1-Click Demo Evaluation
- Switch themes and languages on the fly.
- Currency selection (`₹ INR` default, with `$` USD, `€` EUR, `£` GBP support).
- Profile update and password change.
- **1-Click Sample History Seeder**: Instantly populates 20+ realistic transactions (Salary, Indiranagar Rent, Parag Parikh SIP, Swiggy, Uber, Electricity bill) and monthly category budgets so reviewers can explore immediately.

---

## 5. Security Architecture

1. **HttpOnly Cookies**: Session JWT tokens are stored in `HttpOnly`, `SameSite=Lax`, and `Secure` (in production) cookies, mitigating XSS token theft.
2. **Password Hashing**: Passwords hashed with `bcryptjs` using 12 salt rounds.
3. **Cryptographic OTP**: 6-digit codes generated using Node.js crypto, hashed with SHA-256 before storage, with strict 5-minute expiry and 3-attempt lockouts.
4. **Data Ownership Isolation**: Every transaction, budget, and insight query is scoped strictly by `req.userId` derived from the verified token. No user can read or modify another user's financial data.
5. **Rate Limiting**: Sensitive endpoints protected against brute force (`authLimiter` and `otpLimiter`).
6. **Input Sanitization**: Numbers strictly validated against zero or negative exploits, and text input trimmed and sanitized.

---

## 6. API Reference

### Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user with name, email, password | No |
| `POST` | `/api/auth/login` | Sign in with email & password (sets cookie) | No |
| `POST` | `/api/auth/logout` | Clears authentication cookie | No |
| `POST` | `/api/auth/send-otp` | Generate and dispatch 6-digit mobile OTP | No (Rate Limited) |
| `POST` | `/api/auth/verify-otp` | Verify OTP and authenticate/create user | No (Rate Limited) |
| `POST` | `/api/auth/google` | Authenticate via Google OAuth payload | No |
| `GET` | `/api/auth/me` | Fetch currently authenticated user profile | **Yes** |
| `PUT` | `/api/auth/profile` | Update profile preferences, locale, theme | **Yes** |
| `PUT` | `/api/auth/change-password` | Update account password | **Yes** |
| `POST` | `/api/auth/seed-demo` | Seed realistic demo transactions & budgets | **Yes** |

### Transaction Endpoints (`/api/transactions`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/transactions` | Query transactions with search, filter, sort & pagination | **Yes** |
| `POST` | `/api/transactions` | Record new income or expense transaction | **Yes** |
| `GET` | `/api/transactions/export` | Download filtered transactions as CSV | **Yes** |
| `GET` | `/api/transactions/:id` | Fetch specific transaction details | **Yes** |
| `PUT` | `/api/transactions/:id` | Update transaction record | **Yes** |
| `DELETE` | `/api/transactions/:id` | Delete transaction record | **Yes** |

### Budget Endpoints (`/api/budgets`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/budgets` | Fetch budgets with live calculated monthly spending | **Yes** |
| `POST` | `/api/budgets` | Create category monthly spending limit | **Yes** |
| `PUT` | `/api/budgets/:id` | Update budget amount or category | **Yes** |
| `DELETE` | `/api/budgets/:id` | Remove budget cap | **Yes** |

### Dashboard & Analytics Endpoints
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/dashboard/summary` | Consolidated KPIs, trends, donut distribution | **Yes** |
| `GET` | `/api/insights` | Dynamic algorithmic financial insights | **Yes** |
| `GET` | `/api/health` | Service uptime, database mode & version | No |

---

## 7. Installation & Local Development

### Prerequisites
- **Node.js**: v18 or higher (tested on Node v24)
- **npm**: v9 or higher

### Quick Start (All-in-One)

1. **Clone or enter the project directory**:
   ```bash
   cd "Personal Finance Project"
   ```

2. **Install all dependencies**:
   ```bash
   npm install
   npm --prefix server install
   npm --prefix client install
   ```

3. **Start both backend and frontend concurrently**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   - **Frontend Web Client**: [http://localhost:5173](http://localhost:5173)
   - **Backend REST API**: [http://localhost:5000](http://localhost:5000)
   - **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 8. Environment Configuration (`.env`)

Backend `.env` file (`server/.env`):

```ini
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MongoDB Connection String (e.g. local or MongoDB Atlas)
# In development, if no external MongoDB daemon is active, Artha automatically uses its resilient embedded fallback!
MONGODB_URI=mongodb://localhost:27017/artha_finance

# JWT Configuration
JWT_SECRET=artha_finance_super_secure_jwt_secret_key_2026_production
JWT_EXPIRES_IN=7d

# Mobile OTP Expiration
OTP_EXPIRY_MINUTES=5
```

---

## 9. Production Build

To build the client for production:
```bash
npm run build
```
The optimized bundle will be generated in `client/dist/`.

---

## 10. Credits & Attribution

Designed, architected, and developed with high-level fintech craftsmanship by:

**Krish Verma**  
*Creator & Full-Stack Engineer*
