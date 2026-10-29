-- Agus Aris portfolio: Supabase schema
-- Run in Supabase SQL Editor. This schema is designed for public read + authenticated admin write.
-- Never expose a service_role key in frontend code.

create table if not exists public.research_locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  region text,
  lat double precision not null check (lat between -90 and 90),
  lon double precision not null check (lon between -180 and 180),
  topic text,
  description text,
  year text,
  status text default 'Research area',
  outputs jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.publications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  authors text,
  year integer,
  venue text,
  type text default 'Journal article',
  url text,
  created_at timestamptz not null default now()
);

create table if not exists public.media_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text default 'Field note',
  date text,
  image_url text,
  url text,
  created_at timestamptz not null default now()
);

create table if not exists public.learning_resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text default 'Learning resource',
  format text default 'Material',
  url text,
  created_at timestamptz not null default now()
);

alter table public.research_locations enable row level security;
alter table public.publications enable row level security;
alter table public.media_items enable row level security;
alter table public.learning_resources enable row level security;

-- Public read access for portfolio content.
drop policy if exists "Public can read research locations" on public.research_locations;
create policy "Public can read research locations" on public.research_locations for select to anon, authenticated using (true);
drop policy if exists "Public can read publications" on public.publications;
create policy "Public can read publications" on public.publications for select to anon, authenticated using (true);
drop policy if exists "Public can read media" on public.media_items;
create policy "Public can read media" on public.media_items for select to anon, authenticated using (true);
drop policy if exists "Public can read learning resources" on public.learning_resources;
create policy "Public can read learning resources" on public.learning_resources for select to anon, authenticated using (true);

-- Admin write access is restricted to authenticated users.
-- For a private admin account, create the user in Supabase Authentication > Users.
drop policy if exists "Authenticated admins manage locations" on public.research_locations;
create policy "Authenticated admins manage locations" on public.research_locations for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);
drop policy if exists "Authenticated admins manage publications" on public.publications;
create policy "Authenticated admins manage publications" on public.publications for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);
drop policy if exists "Authenticated admins manage media" on public.media_items;
create policy "Authenticated admins manage media" on public.media_items for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);
drop policy if exists "Authenticated admins manage learning" on public.learning_resources;
create policy "Authenticated admins manage learning" on public.learning_resources for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);

-- Enable realtime publication for live map/content updates. If already added, ignore duplicate error.
do $$ begin
  alter publication supabase_realtime add table public.research_locations;
exception when duplicate_object then null;
end $$;
do $$ begin
  alter publication supabase_realtime add table public.publications;
exception when duplicate_object then null;
end $$;
do $$ begin
  alter publication supabase_realtime add table public.media_items;
exception when duplicate_object then null;
end $$;
do $$ begin
  alter publication supabase_realtime add table public.learning_resources;
exception when duplicate_object then null;
end $$;

-- Optional sample locations: approximate regional markers only; replace with verified survey coordinates.
insert into public.research_locations (name, region, lat, lon, topic, description, year, outputs)
select 'Teluk Weda', 'Halmahera Tengah, Maluku Utara', 0.42, 127.90,
       'Pemantauan lingkungan pesisir dan kualitas perairan',
       'Penanda regional perkiraan. Ganti dengan koordinat lokasi atau stasiun survei yang telah diverifikasi.',
       '2026', '[]'::jsonb
where not exists (select 1 from public.research_locations where name = 'Teluk Weda');
insert into public.research_locations (name, region, lat, lon, topic, description, year, outputs)
select 'Punaga', 'Takalar, Sulawesi Selatan', -5.56, 119.45,
       'Pemetaan budidaya rumput laut',
       'Penanda regional perkiraan. Ganti dengan koordinat lokasi atau stasiun survei yang telah diverifikasi.',
       '2026', '[]'::jsonb
where not exists (select 1 from public.research_locations where name = 'Punaga');
insert into public.research_locations (name, region, lat, lon, topic, description, year, outputs)
select 'Polewali Mandar', 'Sulawesi Barat', -3.43, 119.34,
       'Pemetaan kawasan budidaya rumput laut',
       'Penanda regional perkiraan. Ganti dengan koordinat lokasi atau stasiun survei yang telah diverifikasi.',
       '2026', '[]'::jsonb
where not exists (select 1 from public.research_locations where name = 'Polewali Mandar');
insert into public.research_locations (name, region, lat, lon, topic, description, year, outputs)
select 'Tadui', 'Mamuju, Sulawesi Barat', -2.68, 118.89,
       'Observasi geospasial budidaya rumput laut',
       'Penanda regional perkiraan. Ganti dengan koordinat lokasi atau stasiun survei yang telah diverifikasi.',
       '2026', '[]'::jsonb
where not exists (select 1 from public.research_locations where name = 'Tadui');
