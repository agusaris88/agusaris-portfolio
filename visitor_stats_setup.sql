-- Jalankan sekali di Supabase SQL Editor untuk mengaktifkan statistik pengunjung publik.
create table if not exists public.portfolio_visitor_stats (
  country text primary key,
  visits bigint not null default 0 check (visits >= 0),
  updated_at timestamptz not null default now()
);

alter table public.portfolio_visitor_stats enable row level security;
drop policy if exists "Public can read portfolio visitor stats" on public.portfolio_visitor_stats;
create policy "Public can read portfolio visitor stats"
  on public.portfolio_visitor_stats for select
  to anon, authenticated using (true);
grant select on public.portfolio_visitor_stats to anon, authenticated;

create or replace function public.record_portfolio_visit(p_country text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare clean_country text;
begin
  clean_country := left(trim(coalesce(nullif(p_country, ''), 'Unknown')), 80);
  insert into public.portfolio_visitor_stats (country, visits, updated_at)
  values (clean_country, 1, now())
  on conflict (country) do update
    set visits = public.portfolio_visitor_stats.visits + 1,
        updated_at = now();
end;
$$;
revoke all on function public.record_portfolio_visit(text) from public;
grant execute on function public.record_portfolio_visit(text) to anon, authenticated;
