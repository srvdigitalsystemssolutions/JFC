# 🍽️ Royal Spice - Integrated Restaurant Management System (RMS & POS)

A comprehensive, full-stack Restaurant Management System built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Prisma ORM with SQLite**.

---

## 🌟 Modules & Features

### 1. Super Admin Panel
- **Real-Time Dashboard**: Total orders, revenue metrics, customer counter, active dining tables, pending/completed ticket queues, sales charts & hourly revenue analysis.
- **Analytics & Reporting**: Daily, weekly, monthly, and yearly revenue reports with popular dishes, category breakdowns, and order volume statistics.
- **Menu Management**: Full CRUD operations for menu items with vegetarian/non-vegetarian indicators, dish pricing, preparation time, availability toggles, and photo upload support.
- **Menu Master & Category Hierarchy**: Category organization, item counters, and table QR code generation for digital menu scanning.
- **Dining Table Management**: Visual floor zones (Main Dining, Terrace & Courtyard, Private Dining Lounge), seating capacity tracking, dynamic table occupancy, and table-specific QR access.
- **Billing Management**: Comprehensive ledger of paid and unpaid orders, payment method tracking (Cash, UPI, Card, Split), tax breakdown (GST), and printable receipt invoices.
- **Media Gallery Moderation**: Photo showcase management across food, interior, ambience, and events for website publication.
- **Customer Testimonials & Reviews**: Review moderation system with star ratings and featured status toggles.
- **Customer Inquiries & Banquet Leads**: Contact form submissions, status tracking (`UNREAD`, `READ`, `REPLIED`), and direct communication details.
- **Role-Based Access Control (RBAC)**: Fine-grained permissions per role (`SUPER_ADMIN`, `CHEF`, `BILLING_STAFF`, `CUSTOMER`) across modules.
- **User & Staff Provisioning**: Staff profile creation, role assignment, credential reset, and instant account activation/deactivation.
- **Unified Global Search**: Multi-category debounced search engine searching across Core Management, Content & Inquiries, and Administration & Staff.
- **System Settings**: Restaurant branding, address, operating hours, tax rates, currency, and social links.

### 2. Upcoming Integrated Modules
- **Customer Website**: Public homepage, digital QR menu, reservation bookings, customer reviews, photo gallery, and contact forms.
- **Chef Panel (KDS - Kitchen Display System)**: Live order queue, preparation workflow pipeline (`Pending` → `Preparing` → `Ready` → `Completed`), and kitchen ticket management.
- **Billing POS Counter**: Floor table map, touch order cart, GST computation, split payments, and thermal invoice printing.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18.17+ or v20+)
- npm or pnpm

### Installation

1. **Clone repository**:
   ```bash
   git clone https://github.com/srvdigitalsystemssolutions/JFC.git
   cd JFC
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   ```bash
   cp .env.example .env
   ```

4. **Initialize Database & Seed Sample Data**:
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

6. **Production Build & Start**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🔑 Default Seed Credentials

| Role | Email | Password |
|---|---|---|
| **Super Admin** | `admin@royalspice.com` | `Admin@123` |
| **Head Chef** | `chef@royalspice.com` | `Chef@123` |
| **POS Cashier** | `pos@royalspice.com` | `Pos@123` |
| **Customer** | `john@example.com` | `Customer@123` |

---

## 🛠️ Tech Stack
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database ORM**: [Prisma](https://www.prisma.io/) with SQLite
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts & Data Visualization**: [Recharts](https://recharts.org/)
- **Security & Auth**: JWT (`jsonwebtoken`) & `bcryptjs`
- **QR Code Engine**: `qrcode`
