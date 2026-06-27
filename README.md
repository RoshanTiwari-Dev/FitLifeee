# 🏋️‍♂️ AB Fitness Gym & FiTLiFe Plus Tracker

A state-of-the-art Next.js web application for a luxury gym chain combined with an all-in-one health tracker dashboard. Built using rich modern aesthetics, responsive layouts, glassmorphism UI patterns, and interactive tools.

---

## ✨ Key Features

### 1. 🌐 Landing Page & Brand Portal
* **Interactive Hero Banner:** Features modern animations, direct access options, and highlights.
* **Calorie Estimator Calculator:** Calculates custom estimated daily calorie needs based on weight, height, age, activity level, and goals.
* **Gym Locations Library (`/locations`):** Lists 25+ premium gym centers across major Indian cities (Delhi, Mumbai, Bengaluru, etc.) displaying ratings, addresses, schedules, and specific amenities (WiFi, CrossFit Area, Steam Bath, Sauna, Swimming Pool).
* **Workouts Catalog (`/workouts`):** Lists structured workout routines categorized by focus area (e.g. HIIT, Strength, Legs, Core) detailing difficulty, average duration, target calories, and sets/reps.
* **Exercises Directory (`/exercises`):** Allows searching and filtering 21+ built-in exercises by muscle group, difficulty level, and equipment, with step-by-step instructions and trainer form tips.

### 2. 🔐 Authentication & Quick Access
* **NextAuth Security:** Secure JWT session tracking with password hashing via `bcryptjs`.
* **⚡ Quick Guest Login:** A one-click bypass button on the Login page (`/login`) that dynamically creates or retrieves a guest member account (`guest@fitlifegym.in`), attaches an active premium membership, and logs them in instantly to check all features.

### 3. 📊 Member Dashboard (`/dashboard`)
* **Unified Metrics:** Displays active membership status, count of active fitness goals, and total logged workout sessions.
* **Fitness Goal Tracker (`/dashboard/goals`):** Create, track, and manage custom goals (Weight, Strength, Endurance) with targets, current progress, deadlines, and status changes.
* **Workout Journal (`/dashboard/log`):** Log and track daily workout exercises, sets, reps, weight, duration, and custom trainer notes.
* **Progress Logger (`/dashboard/progress`):** Records body weight and measurements (body fat, chest, waist, hips, biceps, thighs) displaying progress entries over time.
* **Digital Gym Card (`/dashboard/membership`):** Generates a digital gym check-in card showing membership tier, start/end dates, automatic renewals, and transaction logs.

### 4. 🍎 FiTLiFe Plus Premium Tracker (`/dashboard/plus`)
* **Calorie & Water Logger:** Track daily food calorie intake, active workout calorie burns, and water hydration levels (ml).
* **Step Counter:** Log daily step counts against custom daily goals.
* **Weekly Diet Planner:** Plan and manage meals (Breakfast, Lunch, Dinner, Snacks) with complete macro-nutrient details (protein, carbs, fats, calories).
* **Guest Preview Mode:** Automatically displays simulated, interactive sandbox metrics if a user doesn't have an active membership yet, enabling interactive testing before upgrading.

### 5. 💳 Payment Gateway Sandbox
* **Razorpay Integration:** Full payment workflow integrated.
* **Sandbox Simulator Fallback:** If Razorpay keys are not configured, it launches a custom interactive checkout simulator enabling testers to click "Simulate Success" and immediately obtain premium active membership.

---

## 🛠️ Technology Stack

* **Framework:** Next.js 16 (Turbopack) & React 19
* **Database:** SQLite
* **ORM:** Prisma ORM
* **Authentication:** NextAuth.js
* **Charts:** Recharts
* **Styling:** Vanilla CSS (Custom tokens, Glassmorphism, Responsive grids)
* **Icons:** Lucide React

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Database & Seed Data
Initialize your SQLite database and populate it with premium gym locations, plans, exercises, and workout routines:
```bash
npx prisma db push
npx prisma db seed
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or the port shown in terminal) to view the application.

---

## 📂 Project Structure

```text
src/
├── app/                  # Next.js App Router Pages
│   ├── (auth)/           # Login, registration, and guest access pages
│   ├── api/              # API endpoints (Auth, Payments, Plus trackers, Progress)
│   ├── dashboard/        # Member home, goals, logs, membership card, trackers
│   ├── exercises/        # Exercises library directory
│   ├── locations/        # Gym branch database
│   ├── workouts/         # Premade workout catalog
│   ├── layout.tsx        # Global HTML wrapping and metadata
│   └── globals.css       # Core design tokens, gradients, animations, and CSS rules
├── components/           # Reusable global React components (Navbar, Pricing, Calorie Calc)
├── lib/                  # Library configurations (Prisma db client, NextAuth, Razorpay)
└── prisma/               # Prisma Database Schema and Seed script
```
# FitLifeee
