-- Stores encrypted biometric templates (face embeddings) for face login.

create table if not exists public.user_face_embeddings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  model text not null default 'Facenet512',
  embedding_encrypted text not null,
  embedding_iv text not null,
  embedding_auth_tag text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_user_face_embeddings_user_id
  on public.user_face_embeddings(user_id);

drop trigger if exists trg_user_face_embeddings_updated_at on public.user_face_embeddings;
create trigger trg_user_face_embeddings_updated_at
before update on public.user_face_embeddings
for each row
execute function public.set_updated_at();
