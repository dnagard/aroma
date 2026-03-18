'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

function parseBrewTime(val: unknown): number | null {
  if (val === '' || val === null || val === undefined) return null
  const str = String(val)
  if (str.includes(':')) {
    const [min, sec] = str.split(':').map(Number)
    if (isNaN(min) || isNaN(sec)) return null
    return min * 60 + sec
  }
  const n = Number(str)
  return isNaN(n) ? null : Math.round(n)
}

const createBrewSchema = z.object({
  bag_id: z.string().uuid('Please select a bag'),
  method: z.enum([
    'espresso', 'v60', 'pour_over', 'aeropress', 'french_press',
    'chemex', 'moka_pot', 'cold_brew', 'siphon', 'kalita', 'other',
  ] as const),
  brewed_at: z.string().optional().transform(val => val === '' ? undefined : val),
  dose_grams: z.preprocess(
    val => val === '' ? null : val,
    z.coerce.number().positive().nullable().optional()
  ),
  out_grams: z.preprocess(
    val => val === '' ? null : val,
    z.coerce.number().positive().nullable().optional()
  ),
  water_grams: z.preprocess(
    val => val === '' ? null : val,
    z.coerce.number().positive().nullable().optional()
  ),
  brew_temp_c: z.preprocess(
    val => val === '' ? null : val,
    z.coerce.number().positive().nullable().optional()
  ),
  brew_time_s: z.preprocess(parseBrewTime, z.number().int().positive().nullable().optional()),
  grind_size: z.string().optional().transform(val => val === '' ? null : val),
  rating: z.preprocess(
    val => val === '' ? null : val,
    z.coerce.number().min(1).max(10).nullable().optional()
  ),
  notes: z.string().optional().transform(val => val === '' ? null : val),
})

export type CreateBrewState = {
  error?: string
} | null

export async function createBrewAction(
  _prevState: CreateBrewState,
  formData: FormData
): Promise<CreateBrewState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const raw = Object.fromEntries(formData.entries())

  const parsed = createBrewSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { error } = await supabase.from('brew_sessions').insert({
    ...parsed.data,
    user_id: user.id,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/brews')
}

export async function deleteBrewAction(id: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { error } = await supabase
    .from('brew_sessions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    throw new Error(error.message)
  }

  redirect('/brews')
}
