-- FRESH SETUP (use this for new installations):

-- Users authenticated via Clerk
create table users (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text unique not null,
  email text not null,
  first_name text,
  last_name text,
  additional_context text,
  stripe_subscription_id text unique,
  created_at timestamp with time zone default now(),
  modified_at timestamp with time zone default now()
);

-- Subscription records (1 active per user at a time)
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  stripe_subscription_id text unique,
  tier text not null check (tier in ('starter', 'pro', 'max')),
  billing_cycle text not null check (billing_cycle in ('monthly', 'yearly')),
  start_date date not null,
  end_date date not null,
  is_active boolean default true,
  cancel_at_period_end boolean default false,
  created_at timestamp with time zone default now(),
  -- Ensure end_date is after start_date
  constraint valid_subscription_dates check (end_date > start_date)
);

-- Enforce 1 active sub per user
create unique index one_active_subscription_per_user
on subscriptions(user_id)
where is_active = true;

-- Tracks current usage per billing window
create table credit_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  subscription_id uuid references subscriptions(id) on delete cascade,
  usage_window_start date not null,
  usage_window_end date not null,
  credits_used integer default 0,
  created_at timestamp with time zone default now(),
  -- Ensure window end is after start
  constraint valid_usage_window check (usage_window_end > usage_window_start)
);

-- Audit log per credit-consuming action
create table credit_usage_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) not null,
  feature_id text not null,
  credits_used integer not null,
  created_at timestamp with time zone default now()
);

-- Indexes for performance
create index idx_users_email on users(email);
create index idx_users_stripe_sub on users(stripe_subscription_id);
create index idx_subscriptions_user on subscriptions(user_id);
create index idx_subscriptions_stripe on subscriptions(stripe_subscription_id);
create index idx_subscriptions_dates on subscriptions(start_date, end_date);
create index idx_credit_usage_user on credit_usage(user_id);
create index idx_credit_usage_sub on credit_usage(subscription_id);
create index idx_credit_usage_window on credit_usage(usage_window_start, usage_window_end);
create index idx_credit_usage_log_user on credit_usage_log(user_id);
create index idx_credit_usage_log_feature on credit_usage_log(feature_id);
create index idx_credit_usage_log_created on credit_usage_log(created_at);

-- Function to update modified_at timestamp
create or replace function update_modified_at_column()
returns trigger as $$
begin
  new.modified_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger for users modified_at
create trigger update_users_modified_at
  before update on users
  for each row
  execute function update_modified_at_column();

-- Enable Row Level Security (RLS)
alter table users enable row level security;
alter table subscriptions enable row level security;
alter table credit_usage enable row level security;
alter table credit_usage_log enable row level security;

-- Block all access by default
create policy "Block all access"
  on users
  for all
  using (false);

create policy "Block all access"
  on subscriptions
  for all
  using (false);

create policy "Block all access"
  on credit_usage
  for all
  using (false);

create policy "Block all access"
  on credit_usage_log
  for all
  using (false);

-- Revoke all permissions from anon and authenticated roles
revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
revoke all on schema public from anon, authenticated;

-- Grant usage only to service role
grant usage on schema public to service_role;
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;