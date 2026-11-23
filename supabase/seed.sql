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
  ('contemporary-art', 'Современное искусство', 'Произведения живущих художников и художников недавнего прошлого.', 0, true),
  ('abstract-art',     'Абстрактное искусство', 'Форма, цвет и жест без изображения реальных предметов.', 1, true),
  ('installations',    'Инсталляции',    'Предметы и ситуации, выстроенные в пространстве.', 2, true),
  ('paintings',        'Живопись и гравюра', 'Двумерные работы — от станковой живописи до гравюры на дереве.', 3, true),
  ('sculpture',        'Скульптура',        'Высеченные, вылепленные и отлитые объекты.', 4, true),
  ('photography',      'Фотография',      'Изображения, созданные светом, от первых фотографий до наших дней.', 5, true),
  ('digital-art',      'Цифровое искусство',      'Работы, созданные с помощью программ, кода и экранов.', 6, true),
  ('ai-art',           'ИИ-искусство',           'Изображения, созданные или доработанные с помощью моделей машинного обучения.', 7, true),
  ('experimental-art', 'Экспериментальное искусство', 'Работы, которые проверяют границы своей техники.', 8, true)
on conflict (slug) do nothing;

-- Achievements -------------------------------------------------------------
insert into public.achievements (id, name, description, icon, points, sort_order)
values
  ('first-vote',   'Первое суждение',      'Отдайте свой первый голос.',                    'sparkles', 20, 0),
  ('ten-votes',    'Первые 10 голосов',    'Оцените десять работ.',                          'layers',   20, 1),
  ('fifty-votes',  'Исследователь искусства', 'Оцените пятьдесят работ в пяти категориях.',   'compass',  20, 2),
  ('hundred-votes','100 оценённых работ',  'Оцените сто работ.',                             'trophy',   20, 3),
  ('streak-3',     'Три дня подряд',       'Голосуйте три дня подряд.',                      'flame',    20, 4),
  ('streak-7',     'Недельная серия',      'Голосуйте семь дней подряд.',                    'calendar', 20, 5),
  ('top-10',       'Топ-10%',              'Войдите в первые десять процентов таблицы лидеров.', 'crown', 20, 6),
  ('first-upload', 'Впервые в галерее',    'Добейтесь одобрения своей работы.',               'palette',  20, 7),
  ('curator',      'Куратор',              'Добейтесь одобрения пяти работ.',                 'gallery',  20, 8),
  ('commenter',    'Участник обсуждения',  'Оставьте десять комментариев.',                   'message',  20, 9)
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
--     'the-great-wave', 'Большая волна у Канагавы',
--     'Высокая волна обрамляет гору Фудзи в гравюре Хокусая.',
--     'https://<project>.supabase.co/storage/v1/object/public/artworks/great-wave.jpg',
--     'paintings', 'Кацусика Хокусай', 'ок. 1830–1832', 'Япония',
--     'Метрополитен-музей', 'Общественное достояние',
--     'https://www.metmuseum.org/art/collection/search/45434',
--     true, false, 'approved'
--   )
--   on conflict (slug) do nothing;
