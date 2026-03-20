-- FemFin AI initial Supabase/Postgres schema
-- Idempotent migration for local/dev/prod environments.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password_hash text not null,
  phone_number text,
  role text not null default 'entrepreneur',
  profile jsonb,
  credit_score integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.funds (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text,
  status text default 'Active',
  description text,
  funding_range jsonb,
  timeline text,
  eligibility jsonb,
  features jsonb,
  industry_focus jsonb,
  business_stage_applicable jsonb,
  scheme_details jsonb,
  loan_quantum jsonb,
  target_audience text,
  purpose text,
  beneficiaries jsonb,
  application_link text,
  portal jsonb,
  amount numeric,
  interest_rate text,
  repayment_period text,
  interest_subvention text,
  credit_guarantee text,
  margin jsonb,
  guarantee_fee_structure jsonb,
  annual_guarantee_fee_note text,
  hybrid_security text,
  ineligible_facilities jsonb,
  required_documents jsonb,
  facility_type text,
  objectives jsonb,
  loan_categories jsonb,
  pricing text,
  processing_fee text,
  contact_info text,
  created_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references public.users(id),
  title text not null,
  description text,
  category text,
  status text not null default 'Active',
  target_amount numeric not null default 0,
  current_amount numeric not null default 0,
  min_investment numeric not null default 1000,
  end_date timestamptz,
  milestones jsonb not null default '[]'::jsonb,
  investments jsonb not null default '[]'::jsonb,
  stats jsonb not null default '{"views": 0}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.credit_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id),
  business_id uuid,
  digital_transactions jsonb,
  business_activity jsonb,
  social_trust jsonb,
  financial_health jsonb,
  overall_score integer,
  loan_eligibility jsonb,
  score_history jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.fund_recommendation_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id),
  full_name text,
  email text,
  phone text,
  business_idea text,
  budget_required numeric,
  industry_type text,
  business_stage text,
  experience text,
  location text,
  team_size integer,
  recommendations jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_users_email on public.users(email);
create index if not exists idx_funds_status on public.funds(status);
create index if not exists idx_funds_category on public.funds(category);
create index if not exists idx_campaigns_creator_id on public.campaigns(creator_id);
create index if not exists idx_campaigns_status on public.campaigns(status);
create index if not exists idx_credit_scores_user_id on public.credit_scores(user_id);
create index if not exists idx_credit_scores_created_at on public.credit_scores(created_at desc);
create index if not exists idx_frr_user_id on public.fund_recommendation_requests(user_id);
create index if not exists idx_frr_created_at on public.fund_recommendation_requests(created_at desc);

drop trigger if exists trg_users_updated_at on public.users;
create trigger trg_users_updated_at
before update on public.users
for each row
execute function public.set_updated_at();

drop trigger if exists trg_funds_updated_at on public.funds;
create trigger trg_funds_updated_at
before update on public.funds
for each row
execute function public.set_updated_at();

drop trigger if exists trg_campaigns_updated_at on public.campaigns;
create trigger trg_campaigns_updated_at
before update on public.campaigns
for each row
execute function public.set_updated_at();

drop trigger if exists trg_credit_scores_updated_at on public.credit_scores;
create trigger trg_credit_scores_updated_at
before update on public.credit_scores
for each row
execute function public.set_updated_at();

drop trigger if exists trg_frr_updated_at on public.fund_recommendation_requests;
create trigger trg_frr_updated_at
before update on public.fund_recommendation_requests
for each row
execute function public.set_updated_at();
