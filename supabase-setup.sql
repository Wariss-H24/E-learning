-- Table profils liée à auth.users
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default now()
);

-- Activer Row Level Security
alter table public.profiles enable row level security;

-- Chaque utilisateur peut lire son propre profil
create policy "Lecture profil personnel"
  on public.profiles for select
  using (auth.uid() = id);

-- Chaque utilisateur peut modifier son propre profil
create policy "Modification profil personnel"
  on public.profiles for update
  using (auth.uid() = id);

-- Insertion automatique du profil à l'inscription
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name)
  values (
    new.id,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger qui appelle la fonction à chaque nouvel utilisateur
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
