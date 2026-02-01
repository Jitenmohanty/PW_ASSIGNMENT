# ZenIdea - AI-Powered Personal Knowledge Base

ZenIdea is a high-performance, AI-driven personal knowledge base built with **Next.js 16**. It simplifies idea capture and organization through automated AI tagging and summarization.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase Account
- Clerk Account
- Gemini API Key

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env`:
   ```bash
   DATABASE_URL="..."
   DIRECT_URL="..."
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="..."
   CLERK_SECRET_KEY="..."
   GEMINI_API_KEY="..."
   ```
4. Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## 🛠️ Technology Stack
- **Framework**: Next.js 16 (Turbopack)
- **Auth**: Clerk
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **AI**: Google Gemini Pro
- **Styling**: Tailwind CSS v4, Framer Motion

## ✨ Key Features
- **AI Smart Tagging**: Automatically generates tags from idea content.
- **AI Summaries**: Provides one-sentence summaries of long notes.
- **Premium UI**: Dark-themed, glassmorphic design.
- **Full CRUD**: Robust management of personal ideas.

## 🛡️ Security & Scalability
- **Zod Validation**: Strict schema enforcement for all data.
- **Edge Auth**: Clerk middleware for low-latency security.
- **DB Pooling**: Optimized for high-concurrency connections.

## 👤 Developer
- **Name**: Jitendra Kumar
- **GitHub**: [jiten](https://github.com/jiten)
- **LinkedIn**: [Jitendra Kumar](https://linkedin.com/in/jiten)
