import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Public Supabase Client for client-side and server-side image fetching
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Returns the public URL for an asset stored in Supabase Storage.
 * @param path Relative path inside the bucket (e.g., 'hero/krishna-palace-hero.png')
 * @param bucket Storage bucket name (defaults to 'hotel-images')
 */
export function getPublicStorageUrl(path: string, bucket: string = 'hotel-images'): string {
  if (!supabaseUrl) {
    return ''
  }
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}
