-- Supabase Location Tracker Schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (extends Supabase auth.users)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  phone text unique,
  full_name text,
  avatar_url text,
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  last_location_update timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Locations table - stores GPS coordinates with timestamps
create table if not exists public.locations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  latitude decimal(10, 8) not null,
  longitude decimal(11, 8) not null,
  accuracy real,
  timestamp timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- Location History table - stores historical location trails
create table if not exists public.location_history (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  latitude decimal(10, 8) not null,
  longitude decimal(11, 8) not null,
  accuracy real,
  timestamp timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- Contacts table - manages contact relationships
create table if not exists public.contacts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  contact_phone text not null,
  contact_name text,
  contact_user_id uuid references public.users(id) on delete set null,
  status text default 'pending', -- pending, accepted, blocked
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, contact_phone)
);

-- Contact requests table - for mutual connections
create table if not exists public.contact_requests (
  id uuid primary key default uuid_generate_v4(),
  from_user_id uuid not null references public.users(id) on delete cascade,
  to_user_id uuid not null references public.users(id) on delete cascade,
  status text default 'pending', -- pending, accepted, rejected
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(from_user_id, to_user_id)
);

-- Create indexes for better query performance
create index idx_locations_user_id on public.locations(user_id);
create index idx_locations_timestamp on public.locations(timestamp);
create index idx_location_history_user_id on public.location_history(user_id);
create index idx_location_history_timestamp on public.location_history(timestamp);
create index idx_contacts_user_id on public.contacts(user_id);
create index idx_contacts_contact_user_id on public.contacts(contact_user_id);
create index idx_contact_requests_from_user on public.contact_requests(from_user_id);
create index idx_contact_requests_to_user on public.contact_requests(to_user_id);

-- Enable Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.locations enable row level security;
alter table public.location_history enable row level security;
alter table public.contacts enable row level security;
alter table public.contact_requests enable row level security;

-- RLS Policies for users table
create policy "Users can read their own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.users for update
  using (auth.uid() = id);

create policy "Users can read contact's profile"
  on public.users for select
  using (
    exists (
      select 1 from public.contacts
      where (contacts.user_id = auth.uid() and contacts.contact_user_id = users.id)
        and contacts.status = 'accepted'
    )
  );

-- RLS Policies for locations table
create policy "Users can read their own locations"
  on public.locations for select
  using (auth.uid() = user_id);

create policy "Users can insert their own locations"
  on public.locations for insert
  with check (auth.uid() = user_id);

create policy "Contacts can read your locations"
  on public.locations for select
  using (
    exists (
      select 1 from public.contacts
      where (contacts.user_id = auth.uid() and contacts.contact_user_id = user_id)
        and contacts.status = 'accepted'
    )
  );

-- RLS Policies for location history
create policy "Users can read their own location history"
  on public.location_history for select
  using (auth.uid() = user_id);

create policy "Users can insert their own location history"
  on public.location_history for insert
  with check (auth.uid() = user_id);

-- RLS Policies for contacts
create policy "Users can read their own contacts"
  on public.contacts for select
  using (auth.uid() = user_id);

create policy "Users can insert contacts"
  on public.contacts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own contacts"
  on public.contacts for update
  using (auth.uid() = user_id);

create policy "Users can delete their own contacts"
  on public.contacts for delete
  using (auth.uid() = user_id);

-- RLS Policies for contact requests
create policy "Users can read their contact requests"
  on public.contact_requests for select
  using (auth.uid() = from_user_id or auth.uid() = to_user_id);

create policy "Users can send contact requests"
  on public.contact_requests for insert
  with check (auth.uid() = from_user_id);

create policy "Users can update their contact requests"
  on public.contact_requests for update
  using (auth.uid() = to_user_id);

-- Function to automatically create user profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

-- Trigger to create user profile on auth signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
