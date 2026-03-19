'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

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
  brew_time_m: z.preprocess(
    val => val === '' ? null : val,
    z.coerce.number().int().min(0).max(99).nullable().optional()
  ),
  brew_time_s: z.preprocess(
    val => val === '' ? null : val,
    z.coerce.number().int().min(0).max(59).nullable().optional()
  ),
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

  const flavorNotes = formData.getAll('flavor_notes[]').map(String).filter(Boolean)
  const raw = Object.fromEntries(formData.entries())

  const parsed = createBrewSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { brew_time_m, brew_time_s, ...rest } = parsed.data
  const brew_time_s_combined = (brew_time_m == null && brew_time_s == null)
    ? null
    : (brew_time_m ?? 0) * 60 + (brew_time_s ?? 0)

  const { error } = await supabase.from('brew_sessions').insert({
    ...rest,
    brew_time_s: brew_time_s_combined,
    flavor_notes: flavorNotes,
    user_id: user.id,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/brews')
}

const updateBrewSchema = z.object({
  id: z.string().uuid(),
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
  brew_time_m: z.preprocess(
    val => val === '' ? null : val,
    z.coerce.number().int().min(0).max(99).nullable().optional()
  ),
  brew_time_s: z.preprocess(
    val => val === '' ? null : val,
    z.coerce.number().int().min(0).max(59).nullable().optional()
  ),
  grind_size: z.string().optional().transform(val => val === '' ? null : val),
  rating: z.preprocess(
    val => val === '' ? null : val,
    z.coerce.number().min(1).max(10).nullable().optional()
  ),
  notes: z.string().optional().transform(val => val === '' ? null : val),
})

export type UpdateBrewState = {
  error?: string
} | null

export async function updateBrewAction(
  _prevState: UpdateBrewState,
  formData: FormData
): Promise<UpdateBrewState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const flavorNotes = formData.getAll('flavor_notes[]').map(String).filter(Boolean)
  const raw = Object.fromEntries(formData.entries())

  const parsed = updateBrewSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { id, brew_time_m, brew_time_s, ...rest } = parsed.data
  const brew_time_s_combined = (brew_time_m == null && brew_time_s == null)
    ? null
    : (brew_time_m ?? 0) * 60 + (brew_time_s ?? 0)

  const { error } = await supabase
    .from('brew_sessions')
    .update({ ...rest, brew_time_s: brew_time_s_combined, flavor_notes: flavorNotes })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  redirect(`/brews/${id}`)
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
