import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import { cookies } from 'next/headers'

export function createServerSupabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${cookies().get('sb-access-token')?.value ?? ''}`,
        },
      },
    }
  )
}
