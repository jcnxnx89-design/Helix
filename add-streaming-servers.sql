-- Add more streaming servers to Helix
-- Run this in Supabase SQL Editor

-- HiMovie
INSERT INTO public.media_sources (media_type, metadata_id, season_number, episode_number, name, kind, url, enabled)
VALUES
  ('movie', '0', NULL, NULL, 'HiMovie', 'iframe', 'https://himovies.to/watch/movie?tmdb={id}', true),
  ('tv', '0', 1, 1, 'HiMovie', 'iframe', 'https://himovies.to/watch/tv?tmdb={id}&season={season}&episode={episode}', true)
ON CONFLICT DO NOTHING;

-- MovieBox
INSERT INTO public.media_sources (media_type, metadata_id, season_number, episode_number, name, kind, url, enabled)
VALUES
  ('movie', '0', NULL, NULL, 'MovieBox', 'iframe', 'https://www.moviebox.fun/embed/movie?imdb={id}', true),
  ('tv', '0', 1, 1, 'MovieBox', 'iframe', 'https://www.moviebox.fun/embed/tv?imdb={id}&season={season}&episode={episode}', true)
ON CONFLICT DO NOTHING;

-- StreamM4u
INSERT INTO public.media_sources (media_type, metadata_id, season_number, episode_number, name, kind, url, enabled)
VALUES
  ('movie', '0', NULL, NULL, 'StreamM4u', 'iframe', 'https://streamm4u.com/embed/tmdb-movie-{id}', true),
  ('tv', '0', 1, 1, 'StreamM4u', 'iframe', 'https://streamm4u.com/embed/tmdb-tv-{id}-{season}-{episode}', true)
ON CONFLICT DO NOTHING;

-- Losmovies
INSERT INTO public.media_sources (media_type, metadata_id, season_number, episode_number, name, kind, url, enabled)
VALUES
  ('movie', '0', NULL, NULL, 'Losmovies', 'iframe', 'https://www.losmovies.tv/embed/movie/{id}', true),
  ('tv', '0', 1, 1, 'Losmovies', 'iframe', 'https://www.losmovies.tv/embed/tv/{id}/{season}/{episode}', true)
ON CONFLICT DO NOTHING;

-- Flixtor
INSERT INTO public.media_sources (media_type, metadata_id, season_number, episode_number, name, kind, url, enabled)
VALUES
  ('movie', '0', NULL, NULL, 'Flixtor', 'iframe', 'https://www.flixtor.to/embed/movie/{id}', true),
  ('tv', '0', 1, 1, 'Flixtor', 'iframe', 'https://www.flixtor.to/embed/tv/{id}/{season}/{episode}', true)
ON CONFLICT DO NOTHING;

SELECT name, COUNT(*) as count FROM public.media_sources GROUP BY name ORDER BY name;
