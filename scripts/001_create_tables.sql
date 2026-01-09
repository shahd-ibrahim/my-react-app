-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create services table for managing website services
create table if not exists public.services (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  image_url text not null,
  icon_name text,
  order_index integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create features table for "Neden Biz?" section
create table if not exists public.features (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  icon_name text not null,
  order_index integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create contact_requests table for storing contact form submissions
create table if not exists public.contact_requests (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  status text default 'new' check (status in ('new', 'in_progress', 'completed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create admin_users table for admin authentication
create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.services enable row level security;
alter table public.features enable row level security;
alter table public.contact_requests enable row level security;
alter table public.admin_users enable row level security;

-- RLS Policies for services (public read, admin write)
create policy "services_public_read"
  on public.services for select
  using (true);

create policy "services_admin_insert"
  on public.services for insert
  with check (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid()
    )
  );

create policy "services_admin_update"
  on public.services for update
  using (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid()
    )
  );

create policy "services_admin_delete"
  on public.services for delete
  using (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid()
    )
  );

-- RLS Policies for features (public read, admin write)
create policy "features_public_read"
  on public.features for select
  using (true);

create policy "features_admin_insert"
  on public.features for insert
  with check (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid()
    )
  );

create policy "features_admin_update"
  on public.features for update
  using (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid()
    )
  );

create policy "features_admin_delete"
  on public.features for delete
  using (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid()
    )
  );

-- RLS Policies for contact_requests (public insert, admin read/update)
create policy "contact_requests_public_insert"
  on public.contact_requests for insert
  with check (true);

create policy "contact_requests_admin_read"
  on public.contact_requests for select
  using (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid()
    )
  );

create policy "contact_requests_admin_update"
  on public.contact_requests for update
  using (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid()
    )
  );

create policy "contact_requests_admin_delete"
  on public.contact_requests for delete
  using (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid()
    )
  );

-- RLS Policies for admin_users (admins can read their own data)
create policy "admin_users_read_own"
  on public.admin_users for select
  using (auth.uid() = id);

create policy "admin_users_update_own"
  on public.admin_users for update
  using (auth.uid() = id);

-- Create function to automatically create admin_users entry
create or replace function public.handle_new_admin_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.admin_users (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', null)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Create trigger for new admin users
drop trigger if exists on_auth_admin_user_created on auth.users;

create trigger on_auth_admin_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_admin_user();

-- Create indexes for better performance
create index if not exists services_order_index_idx on public.services(order_index);
create index if not exists features_order_index_idx on public.features(order_index);
create index if not exists contact_requests_status_idx on public.contact_requests(status);
create index if not exists contact_requests_created_at_idx on public.contact_requests(created_at desc);
