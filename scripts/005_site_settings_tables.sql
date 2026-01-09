-- Site Settings Tables
-- This script creates tables for managing all site content from admin panel

-- Create site_settings table for general site configuration
create table if not exists public.site_settings (
  id uuid primary key default uuid_generate_v4(),
  setting_key text not null unique,
  setting_value text,
  setting_type text default 'text' check (setting_type in ('text', 'number', 'boolean', 'url', 'email', 'phone')),
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create hero_sections table for hero section content
create table if not exists public.hero_sections (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  title_highlight text,
  description text not null,
  primary_button_text text,
  primary_button_link text,
  secondary_button_text text,
  secondary_button_link text,
  background_image_url text,
  is_active boolean default true,
  order_index integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create logos table for logo management
create table if not exists public.logos (
  id uuid primary key default uuid_generate_v4(),
  logo_type text not null check (logo_type in ('header', 'footer', 'favicon')),
  image_url text not null,
  alt_text text,
  width integer,
  height integer,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(logo_type, is_active) deferrable initially deferred
);

-- Create header_settings table for header configuration
create table if not exists public.header_settings (
  id uuid primary key default uuid_generate_v4(),
  site_name text not null,
  site_tagline text,
  phone_number text,
  cta_button_text text,
  cta_button_link text,
  navigation_links jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create footer_settings table for footer configuration
create table if not exists public.footer_settings (
  id uuid primary key default uuid_generate_v4(),
  description text,
  phone_number text,
  email text,
  address text,
  quick_links jsonb default '[]'::jsonb,
  copyright_text text,
  legal_links jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.site_settings enable row level security;
alter table public.hero_sections enable row level security;
alter table public.logos enable row level security;
alter table public.header_settings enable row level security;
alter table public.footer_settings enable row level security;

-- RLS Policies for site_settings (public read, admin write)
create policy "site_settings_public_read"
  on public.site_settings for select
  using (true);

create policy "site_settings_admin_all"
  on public.site_settings for all
  using (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid()
    )
  );

-- RLS Policies for hero_sections (public read, admin write)
create policy "hero_sections_public_read"
  on public.hero_sections for select
  using (true);

create policy "hero_sections_admin_all"
  on public.hero_sections for all
  using (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid()
    )
  );

-- RLS Policies for logos (public read, admin write)
create policy "logos_public_read"
  on public.logos for select
  using (true);

create policy "logos_admin_all"
  on public.logos for all
  using (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid()
    )
  );

-- RLS Policies for header_settings (public read, admin write)
create policy "header_settings_public_read"
  on public.header_settings for select
  using (true);

create policy "header_settings_admin_all"
  on public.header_settings for all
  using (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid()
    )
  );

-- RLS Policies for footer_settings (public read, admin write)
create policy "footer_settings_public_read"
  on public.footer_settings for select
  using (true);

create policy "footer_settings_admin_all"
  on public.footer_settings for all
  using (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid()
    )
  );

-- Create indexes for better performance
create index if not exists site_settings_key_idx on public.site_settings(setting_key);
create index if not exists hero_sections_active_idx on public.hero_sections(is_active, order_index);
create index if not exists logos_type_active_idx on public.logos(logo_type, is_active);
create index if not exists header_settings_created_at_idx on public.header_settings(created_at desc);
create index if not exists footer_settings_created_at_idx on public.footer_settings(created_at desc);

-- Insert default settings
insert into public.site_settings (setting_key, setting_value, setting_type, description) values
  ('site_name', 'Gaziantep Kriminal Büro', 'text', 'Site adı'),
  ('site_tagline', 'Siber & Güvenlik Teknolojileri', 'text', 'Site sloganı'),
  ('contact_phone', '+90 342 123 45 67', 'phone', 'İletişim telefonu'),
  ('contact_email', 'info@gaziantepkriminalburo.com', 'email', 'İletişim e-postası'),
  ('contact_address', 'Gaziantep, Türkiye', 'text', 'İletişim adresi')
on conflict (setting_key) do nothing;

-- Insert default hero section
insert into public.hero_sections (
  title,
  title_highlight,
  description,
  primary_button_text,
  primary_button_link,
  secondary_button_text,
  secondary_button_link,
  background_image_url,
  is_active,
  order_index
) values (
  'Dijital Delilde Uzman,',
  'Güvenlikte Güvenilir',
  'Gaziantep Siber Güvenlik ve Kriminal Büro Danışmanlık olarak; siber güvenlik, adli bilişim, veri kurtarma ve geçiş kontrol çözümlerinde profesyonel hizmetinizdeyiz.',
  'Hizmetlerimizi İnceleyin',
  '#hizmetler',
  'Bizimle İletişime Geçin',
  '#iletisim',
  '/images/hero.jpeg',
  true,
  0
) on conflict do nothing;

-- Insert default logos
insert into public.logos (logo_type, image_url, alt_text, width, height, is_active) values
  ('header', '/images/logo.jpeg', 'Gaziantep Kriminal Büro', 60, 60, true),
  ('footer', '/images/logo.jpeg', 'Gaziantep Kriminal Büro', 50, 50, true)
on conflict do nothing;

-- Insert default header settings
insert into public.header_settings (
  site_name,
  site_tagline,
  phone_number,
  cta_button_text,
  cta_button_link,
  navigation_links
) values (
  'GAZİANTEP KRİMİNAL BÜRO',
  'Siber & Güvenlik Teknolojileri',
  '+90 342 123 45 67',
  'Teklif Alın',
  '#iletisim',
  '[
    {"label": "Anasayfa", "href": "/"},
    {"label": "Hizmetler", "href": "#hizmetler"},
    {"label": "Hakkımızda", "href": "#hakkimizda"},
    {"label": "İletişim", "href": "#iletisim"}
  ]'::jsonb
) on conflict do nothing;

-- Insert default footer settings
insert into public.footer_settings (
  description,
  phone_number,
  email,
  address,
  quick_links,
  copyright_text,
  legal_links
) values (
  'Dijital güvenliğiniz için yanınızdayız. Gaziantep''te tecrübemiz ile profesyonel hizmetimizeyiz.',
  '+90 342 123 45 67',
  'info@gaziantepkriminalburo.com',
  'Gaziantep, Türkiye',
  '[
    {"label": "Hizmetler", "href": "#hizmetler"},
    {"label": "Hakkımızda", "href": "#hakkimizda"},
    {"label": "İletişim", "href": "#iletisim"}
  ]'::jsonb,
  '© 2023 Gaziantep Kriminal Büro · Tüm Hakları Saklıdır',
  '[
    {"label": "KVKK", "href": "#"},
    {"label": "Gizlilik Politikası", "href": "#"}
  ]'::jsonb
) on conflict do nothing;

