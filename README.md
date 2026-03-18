# Aroma

Aroma is a coffee journaling web app for home brewers and roasters. Log your brew sessions, track bags of coffee, record roast sessions, and explore coffee origins and processing methods — all in one place. Whether you're dialing in your pour-over technique or documenting a home roast from green to cup, Aroma gives you a clean, focused space to build your coffee knowledge over time.

---

![Screenshot placeholder](docs/screenshot.png)

---

## Tech Stack

- **[Next.js 15](https://nextjs.org/)** — App Router, React 19, TypeScript
- **[Supabase](https://supabase.com/)** — PostgreSQL database and authentication
- **[shadcn/ui](https://ui.shadcn.com/)** — Radix-based component library
- **[Tailwind CSS v4](https://tailwindcss.com/)** — Utility-first styling
- **[Vercel](https://vercel.com/)** — Deployment and hosting

## Features

- **Bag tracking** — Log bags of coffee with origin, roaster, process, roast level, varietals, flavor notes, and ratings
- **Brew sessions** — Record brews with dose, yield, water, temperature, grind size, brew time, and tasting notes
- **Roast sessions** — Document home roasts with charge/drop weights, temperatures, first crack, and roast level; completed roasts automatically generate a linked bag
- **Tasting helper** — SCA flavor wheel to guide flavor note selection
- **Learn** — Static reference pages covering coffee origins and processing methods
- **Export** — Download your data as Markdown or CSV
- **Dashboard** — Overview of your brewing and roasting activity
- **Google OAuth** — Sign in with Google or email and password
- **Theme switcher** — Choose from multiple preset color themes

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com/) project

### Local development

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/aroma.git
   cd aroma
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the project root:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

   Find these values in your Supabase project under **Settings → API**.

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

## Live App

[https://myaroma.vercel.app](https://myaroma.vercel.app)
