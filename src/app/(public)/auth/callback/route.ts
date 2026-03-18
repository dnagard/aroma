import { type NextRequest, NextResponse } from "next/server"
import { createServerClient, type CookieOptions } from "@supabase/ssr"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.redirect(new URL("/auth/login?error=OAuth+failed", request.url))
  }

  // Collect cookies to set — applied to the final response below
  const cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }> = []

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookies) {
          cookiesToSet.push(...cookies)
        },
      },
    },
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  const destination = error
    ? new URL(`/auth/login?error=${encodeURIComponent(error.message)}`, request.url)
    : new URL("/dashboard", request.url)

  const response = NextResponse.redirect(destination)
  cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
  return response
}
