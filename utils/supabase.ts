import { createClient }  from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(
  url,
  key,
  {auth: {
    persistSession: false,
  }}
)

export const getServiceSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_KEY || "",
);