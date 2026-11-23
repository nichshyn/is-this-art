-- ===========================================================================
-- IS THIS ART? — seed data for Supabase
-- ===========================================================================
-- Run after supabase/migrations/0001_init.sql. Idempotent: safe to run more
-- than once. Artworks are intentionally not seeded here because their images
-- live in Supabase Storage. Import the catalogue from src/data/artworks.ts
-- with the service role, or upload images through the admin UI.
-- ===========================================================================

-- Categories ---------------------------------------------------------------
insert into public.categories (slug, name, description, sort_order, is_active)
values
  ('contemporary-art', 'Contemporary Art', 'Work made by living artists and the recent past.', 0, true),
  ('abstract-art',     'Abstract Art',     'Form, colour and gesture without a representational subject.', 1, true),
  ('installations',    'Installations',    'Rooms, objects and situations staged in space.', 2, true),
  ('paintings',        'Paintings & Prints', 'Two-dimensional works, from panel paintings to woodblock prints.', 3, true),
  ('sculpture',        'Sculpture',        'Carved, modelled and cast objects.', 4, true),
  ('photography',      'Photography',      'Images made with light, from the first camera photograph to the present.', 5, true),
  ('digital-art',      'Digital Art',      'Work made with software, code and screens.', 6, true),
  ('ai-art',           'AI Art',           'Images generated or co-created with machine-learning models.', 7, true),
  ('experimental-art', 'Experimental Art', 'Work that tests the rules of its own medium.', 8, true)
on conflict (slug) do nothing;

-- Achievements -------------------------------------------------------------
insert into public.achievements (id, name, description, icon, points, sort_order)
values
  ('first-vote',   'First Judgment',          'Cast your first vote.',                              'sparkles', 20, 0),
  ('ten-votes',    'First 10 Votes',          'Judge ten artworks.',                                'layers',   20, 1),
  ('fifty-votes',  'Art Explorer',            'Judge fifty artworks across five categories.',       'compass',  20, 2),
  ('hundred-votes','100 Artworks Judged',     'Judge one hundred artworks.',                        'trophy',   20, 3),
  ('streak-3',     'Three Days Running',      'Vote on three consecutive days.',                    'flame',    20, 4),
  ('streak-7',     'Weekly Streak',           'Vote on seven consecutive days.',                    'calendar', 20, 5),
  ('top-10',       'Top 10% Player',          'Reach the top ten percent of the leaderboard.',      'crown',    20, 6),
  ('first-upload', 'Featured Artist',         'Have an artwork approved.',                          'palette',  20, 7),
  ('curator',      'Curator',                 'Have five artworks approved.',                       'gallery',  20, 8),
  ('commenter',    'In the Conversation',     'Post ten comments.',                                 'message',  20, 9)
on conflict (id) do nothing;

-- Promote your first admin after signing up through Supabase Auth:
--   update public.profiles set role = 'admin' where username = 'your-username';
--
-- The app's local demo catalogue (src/data/artworks.ts) can be imported with
-- the service role. A minimal example:
--
--   insert into public.artworks (
--     slug, title, description, image_url, category, artist_name,
--     creation_year, country, image_credit, image_license, image_source_url,
--     is_verified, is_demo, status
--   ) values (
--     'the-great-wave', 'The Great Wave off Kanagawa',
--     'A towering wave frames Mount Fuji in Hokusai''s woodblock print.',
--     'https://<project>.supabase.co/storage/v1/object/public/artworks/great-wave.jpg',
--     'paintings', 'Katsushika Hokusai', 'c. 1830–1832', 'Japan',
--     'The Metropolitan Museum of Art', 'Public domain',
--     'https://www.metmuseum.org/art/collection/search/45434',
--     true, false, 'approved'
--   )
--   on conflict (slug) do nothing;
