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
  varietal: z.string().optional(),
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

  const raw = Object.fromEntries(
    [...formData.entries()].filter(([, v]) => v !== '')
  )

  const parsed = createBagSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { varietal, ...rest } = parsed.data

  const { error } = await supabase.from('bags').insert({
    ...rest,
    varietal: varietal ? varietal.split(',').map((v) => v.trim()).filter(Boolean) : null,
    user_id: user.id,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/bags')
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
