-- Fix TV Sources - Remove broken season/episode requirements
-- Run this in Supabase SQL Editor

-- Delete TV sources with specific season/episode numbers (they're too restrictive)
DELETE FROM public.media_sources 
WHERE media_type = 'tv' 
  AND metadata_id = '0' 
  AND (season_number IS NOT NULL OR episode_number IS NOT NULL);

-- Re-add TV sources WITHOUT season/episode (wildcard for all episodes)
INSERT INTO public.media_sources (media_type, metadata_id, season_number, episode_number, name, kind, url, enabled)
VALUES
  ('tv', '0', NULL, NULL, 'VidCore', 'iframe', 'https://vidcore.org/embed/tv/{id}/{season}/{episode}', true),
  ('tv', '0', NULL, NULL, '2embed', 'iframe', 'https://www.2embed.online/embed/tv/{id}/{season}/{episode}', true),
  ('tv', '0', NULL, NULL, 'HiMovie', 'iframe', 'https://himovies.to/watch/tv?tmdb={id}&season={season}&episode={episode}', true),
  ('tv', '0', NULL, NULL, 'MovieBox', 'iframe', 'https://www.moviebox.fun/embed/tv?imdb={id}&season={season}&episode={episode}', true),
  ('tv', '0', NULL, NULL, 'StreamM4u', 'iframe', 'https://streamm4u.com/embed/tmdb-tv-{id}-{season}-{episode}', true),
  ('tv', '0', NULL, NULL, 'Losmovies', 'iframe', 'https://www.losmovies.tv/embed/tv/{id}/{season}/{episode}', true),
  ('tv', '0', NULL, NULL, 'Flixtor', 'iframe', 'https://www.flixtor.to/embed/tv/{id}/{season}/{episode}', true)
ON CONFLICT DO NOTHING;

SELECT 'TV sources fixed!' as status;
SELECT name, COUNT(*) FROM public.media_sources WHERE media_type = 'tv' GROUP BY name;
