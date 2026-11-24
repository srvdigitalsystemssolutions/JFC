# 🍽️ Johnson Food Court (JFC) - Integrated Restaurant & Food Court Management System

A comprehensive, full-stack Restaurant & Food Court Management System custom-tailored for **Johnson Food Court (JFC)** located along **Arni Road, Pennathur, near Bagayam, Vellore, Tamil Nadu – 632011**.

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Prisma ORM with SQLite**.

---

## 📍 Establishment Details
- **Restaurant Name**: Johnson Food Court (JFC)
- **Tagline**: Multi-Cuisine Food Court & Open-Air Garden Dining
- **Location**: Sherwood, Bagayam, Arni Road, Pennathur, Vellore, Tamil Nadu – 632011
- **Contact Phone**: +91 99652 78872
- **Email**: contact@johnsonfoodcourt.com
- **Operating Hours**:
  - Monday – Saturday: 10:30 AM – 11:30 PM
  - Sunday: 12:30 PM – 11:30 PM
- **Verified Directory Links**:
  - **Google Maps**: [https://maps.app.goo.gl/VubJq18cKDMrij7w5](https://maps.app.goo.gl/VubJq18cKDMrij7w5)
  - **Justdial Listing**: [https://www.justdial.com/Vellore/Jhonson-Food-Court-Jfc-Bagayam-Pennathur/9999PX416-X416-240319224157-K4W3_BZDET](https://www.justdial.com/Vellore/Jhonson-Food-Court-Jfc-Bagayam-Pennathur/9999PX416-X416-240319224157-K4W3_BZDET)

---

## 🌟 Modules & Features

### 1. Customer Public Website (`/`)
- **Yaa Mohaideen Inspired Hero Banner**: High-contrast typography, gold flourish dividers, and cycling calligraphic typewriter animations using Google Font *Dancing Script*.
- **Live Menu Card Showcase**: Multi-cuisine dishes across Shawarma, BBQ Grills, Starters (Honey Chilli Chicken), Dum Biryani, Indo-Chinese Wok, Malabar Parottas, and Mocktails/Faloodas.
- **Advance Table Reservation**: Online booking widget for highway travelers, CMC visitors, and weekend family get-togethers.
- **Open-Air Ambience Gallery**: Showcase of evening festoon garden lighting, live charcoal BBQ, and food court counters.
- **Customer Reviews**: Testimonials from Pennathur and Vellore diners.

### 2. POS & Billing Workstation (`/billing`)
- **Dine-In Table Management**: Floor view of all 8 tables, order inspection, GST calculation, discounts, and instant thermal receipt printing.
- **Online Platform Order Placement**: Place Zomato, Swiggy, and direct delivery orders directly from the counter.
- **Live Chef Sync**: Automatic notification banner when Chef marks food as prepared & ready for rider handover.

### 3. Kitchen Display System - KDS (`/chef`)
- Real-time order tickets separated by Dine-In and Online Delivery (Zomato / Swiggy).
- Cooking lifecycle: `Start Cooking` → `Food Prepared & Packed` (auto-notifies waiter and billing).

### 4. Floor Waiter Station (`/waiter`)
- Interactive 8-table layout with live status toggles (`Available`, `Occupied`, `Reserved`, `Cleaning`).
- Categorized menu catalog with instant debounced search bar.
- Digital KOT kitchen ticket dispatcher.

### 5. Super Admin Controller (`/admin`)
- **2-Step Email Verification**: Simulated 6-digit OTP verification code required on login for enhanced administrative security.
- **Top View Switcher**: Jump seamlessly between Super Admin, Kitchen Display, Billing Workstation, and Waiter views.
- **Management Modules**: Revenue analytics, menu items, categories, staff provisioning, RBAC matrix, and system settings.

---

## 🔑 Workstation Access & Default Credentials

| Workstation Portal | Direct URL | Default Login ID | Password |
|---|---|---|---|
| **Public Customer Website** | `http://localhost:3000/` | *Public Access* | *None* |
| **Head Chef Kitchen (KDS)** | `http://localhost:3000/chef` | `chef@johnsonfoodcourt.com` *(or `chef@royalspice.com`)* | `chef123` |
| **POS & Billing Counter** | `http://localhost:3000/billing` | `pos@johnsonfoodcourt.com` *(or `pos@royalspice.com`)* | `pos123` |
| **Floor Waiter Station** | `http://localhost:3000/waiter` | `waiter@johnsonfoodcourt.com` *(or `waiter@royalspice.com`)* | `waiter123` |
| **Super Admin Portal** | `http://localhost:3000/admin` | `admin@johnsonfoodcourt.com` *(or `admin@royalspice.com`)* | `admin123` *(triggers 2FA OTP)* |

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

3. **Initialize Database & Seed JFC Data**:
   ```bash
   npm run db:push
   npm run db:seed
   ```

4. **Production Build & Start**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🛠️ Tech Stack
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database ORM**: [Prisma](https://www.prisma.io/) with SQLite
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts & Data Visualization**: [Recharts](https://recharts.org/)
- **Security & Auth**: JWT (`jsonwebtoken`) & `bcryptjs`
