-- Create news table
create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  image_url text,
  category text,
  is_featured boolean default false,
  published_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create categories table
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  icon_name text,
  order_index integer default 0,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.news enable row level security;
alter table public.categories enable row level security;

-- Public read access
create policy "Enable read access for all users" on public.news for select using (true);
create policy "Enable read access for all users" on public.categories for select using (true);

-- Admin write access
create policy "Enable insert for admin users" on public.news for insert to authenticated using (
  exists (select 1 from public.admin_users where user_id = auth.uid())
);

create policy "Enable update for admin users" on public.news for update to authenticated using (
  exists (select 1 from public.admin_users where user_id = auth.uid())
);

create policy "Enable delete for admin users" on public.news for delete to authenticated using (
  exists (select 1 from public.admin_users where user_id = auth.uid())
);

create policy "Enable insert for admin users" on public.categories for insert to authenticated using (
  exists (select 1 from public.admin_users where user_id = auth.uid())
);

create policy "Enable update for admin users" on public.categories for update to authenticated using (
  exists (select 1 from public.admin_users where user_id = auth.uid())
);

create policy "Enable delete for admin users" on public.categories for delete to authenticated using (
  exists (select 1 from public.admin_users where user_id = auth.uid())
);

-- Insert sample news
insert into public.news (title, content, category, is_featured, image_url) values
  ('Yeni Siber Güvenlik Tehditleri 2025', 'Dijital dünyadaki gelişen tehditler ve korunma yöntemleri hakkında detaylı bilgiler...', 'Siber Güvenlik', true, '/images/hero.jpeg'),
  ('Adli Bilişim Sektöründe Yenilikler', 'Adli bilişim teknolojilerindeki son gelişmeler ve uygulamalar...', 'Adli Bilişim', true, '/images/adli-bilisim.jpg'),
  ('Veri Koruma Yasası Güncellemeleri', 'KVKK ve uluslararası veri koruma standartlarındaki değişiklikler...', 'Hukuk', false, '/images/siber-guvenlik-1.jpg')
on conflict do nothing;

-- Insert sample categories
insert into public.categories (name, description, icon_name, order_index) values
  ('Siber Güvenlik', 'Siber güvenlik çözümleri ve tehdit analizi', 'shield', 1),
  ('Adli Bilişim', 'Dijital delil toplama ve analiz hizmetleri', 'search', 2),
  ('Veri Kurtarma', 'Kayıp verilerin kurtarılması hizmetleri', 'hard-drive', 3),
  ('Eğitim & Danışmanlık', 'Kurumsal eğitim ve danışmanlık hizmetleri', 'book-open', 4),
  ('Güvenlik Denetimi', 'Sistem ve ağ güvenlik denetimleri', 'shield-check', 5),
  ('Hukuki Destek', 'Siber suçlar için hukuki destek', 'scale', 6)
on conflict do nothing;
