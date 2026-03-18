'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const createBagSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  roaster: z.string().optional(),
  origin_country: z.string().optional(),
  origin_region: z.string().optional(),
  process: z
    .enum(['washed', 'natural', 'honey', 'anaerobic_natural', 'anaerobic_washed', 'wet_hulled', 'carbonic_maceration', 'other'])
    .optional(),
  roast_level: z
    .enum(['light', 'medium_light', 'medium', 'medium_dark', 'dark'])
    .optional(),
  roast_date: z.string().optional(),
  altitude_masl: z.coerce.number().int().positive().optional(),
  rating: z.coerce.number().min(1).max(10).optional(),
  notes: z.string().optional(),
})

export type CreateBagState = {
  error?: string
} | null

export async function createBagAction(
  _prevState: CreateBagState,
  formData: FormData
): Promise<CreateBagState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const flavorNotes = formData.getAll('flavor_notes[]').map(String).filter(Boolean)
  const varietal = formData.getAll('varietal[]').map(String).filter(Boolean)

  const raw = Object.fromEntries(
    [...formData.entries()].filter(([, v]) => v !== '')
  )

  const parsed = createBagSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { error } = await supabase.from('bags').insert({
    ...parsed.data,
    varietal: varietal.length > 0 ? varietal : null,
    flavor_notes: flavorNotes,
    user_id: user.id,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/bags')
}

const updateBagSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Name is required'),
  roaster: z.string().optional().transform(val => val === '' ? null : val),
  origin_country: z.string().optional().transform(val => (val === '' || val === 'none') ? null : val),
  origin_region: z.string().optional().transform(val => val === '' ? null : val),
  process: z.preprocess(
    val => (val === '' || val === 'none') ? null : val,
    z.enum(['washed', 'natural', 'honey', 'anaerobic_natural', 'anaerobic_washed', 'wet_hulled', 'carbonic_maceration', 'other']).nullable().optional()
  ),
  roast_level: z.preprocess(
    val => (val === '' || val === 'none') ? null : val,
    z.enum(['light', 'medium_light', 'medium', 'medium_dark', 'dark']).nullable().optional()
  ),
  roast_date: z.string().optional().transform(val => val === '' ? null : val),
  altitude_masl: z.preprocess(
    val => val === '' ? null : val,
    z.coerce.number().int().positive().nullable().optional()
  ),
  rating: z.preprocess(
    val => val === '' ? null : val,
    z.coerce.number().min(1).max(10).nullable().optional()
  ),
  notes: z.string().optional().transform(val => val === '' ? null : val),
})

export type UpdateBagState = {
  error?: string
} | null

export async function updateBagAction(
  _prevState: UpdateBagState,
  formData: FormData
): Promise<UpdateBagState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const flavorNotes = formData.getAll('flavor_notes[]').map(String).filter(Boolean)
  const varietal = formData.getAll('varietal[]').map(String).filter(Boolean)

  const raw = Object.fromEntries(formData.entries())

  const parsed = updateBagSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { id, ...rest } = parsed.data

  const { error } = await supabase
    .from('bags')
    .update({
      ...rest,
      varietal: varietal.length > 0 ? varietal : null,
      flavor_notes: flavorNotes,
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  redirect(`/bags/${id}`)
}

export async function deleteBagAction(id: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { error } = await supabase
    .from('bags')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    throw new Error(error.message)
  }

  redirect('/bags')
}
