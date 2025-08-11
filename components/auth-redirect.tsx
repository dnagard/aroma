"use client";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AuthRedirect({ to }: { to: string }) {
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) window.location.replace(to);
    });
  }, [to]);
  return null;
}
