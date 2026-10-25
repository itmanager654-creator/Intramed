create table if not exists products (
  id serial primary key,
  category text not null,
  slug text not null,
  name text not null,
  spec text default '',
  description text default '',
  image_url text default '',
  sort int default 0,
  created_at timestamptz default now(),
  unique (category, slug)
);
create table if not exists gallery (
  id serial primary key,
  url text not null,
  category text default '',
  caption text default '',
  created_at timestamptz default now()
);
create table if not exists inquiries (
  id serial primary key,
  name text not null,
  phone text not null,
  email text default '',
  product text default '',
  message text not null,
  status text default 'new',
  created_at timestamptz default now()
);

create table if not exists featured (
  id serial primary key,
  title text not null,
  tag text default '',
  description text default '',
  image_url text default '',
  sort int default 0
);
create table if not exists partners (
  id serial primary key,
  name text not null,
  description text default '',
  logo_url text default '',
  sort int default 0
);
create table if not exists clients (
  id serial primary key,
  label text not null,
  logo_url text default '',
  sort int default 0
);
