-- Helix Movies - Add VidCore Sources
-- Run this in Supabase SQL Editor

-- Insert VidCore dynamic iframe sources
INSERT INTO public.media_sources (
  media_type, 
  metadata_id, 
  season_number, 
  episode_number, 
  name, 
  kind, 
  url, 
  mime_type, 
  subtitles, 
  enabled
) VALUES
  -- VidCore Movies (dynamic)
  (
    'movie',
    '0',
    NULL,
    NULL,
    'VidCore',
    'iframe',
    'https://vidcore.org/embed/movie/{id}',
    NULL,
    '[]'::jsonb,
    true
  ),
  -- VidCore TV (dynamic)
  (
    'tv',
    '0',
    1,
    1,
    'VidCore',
    'iframe',
    'https://vidcore.org/embed/tv/{id}/{season}/{episode}',
    NULL,
    '[]'::jsonb,
    true
  )
ON CONFLICT DO NOTHING;

SELECT 'VidCore sources added!' as status;
SELECT * FROM public.media_sources ORDER BY created_at DESC;
