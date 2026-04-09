-- Add location update function to update users table timestamp
create or replace function public.update_user_location_timestamp()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update public.users
  set last_location_update = new.timestamp
  where id = new.user_id;
  return new;
end;
$$;

-- Trigger to update timestamp when location is inserted
create trigger on_location_insert
  after insert on public.locations
  for each row execute procedure public.update_user_location_timestamp();
