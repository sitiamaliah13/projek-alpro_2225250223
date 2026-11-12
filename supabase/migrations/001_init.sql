-- FungsiKu Tahap 2: skema database Supabase (architecture.md §4).
-- Prinsip privasi (agents.md aturan 6):
--   * Tidak ada kolom nama asli, email, atau nomor HP. Siswa dikenali lewat kode samaran.
--   * Nama panggilan TIDAK disimpan di server.
--   * RLS aktif di semua tabel TANPA policy publik: hanya backend (service key) yang bisa membaca/menulis.

create extension if not exists pgcrypto;

-- Kelas & siswa ----------------------------------------------------------------
create table if not exists classes (
  id    uuid primary key default gen_random_uuid(),
  name  text not null unique,
  grade int  not null default 8
);

create table if not exists students (
  id           uuid primary key default gen_random_uuid(),
  code         text not null unique,          -- mis. FK-8A-K3P9, dibandingkan dalam huruf besar
  label        text unique,                   -- kode peserta penelitian: P01, P02, ... (bukan nama)
  class_id     uuid references classes(id) on delete set null,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  last_seen_at timestamptz
);

-- Salinan utuh progres dari aplikasi (dipakai untuk pindah perangkat) -----------
create table if not exists progress_snapshots (
  student_id uuid primary key references students(id) on delete cascade,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);

-- Tabel rinci untuk analisis peneliti ------------------------------------------
create table if not exists lesson_progress (
  student_id   uuid not null references students(id) on delete cascade,
  lesson_id    text not null,
  done         boolean not null default false,
  stars        int,
  completed_at timestamptz,
  primary key (student_id, lesson_id)
);

create table if not exists attempts (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references students(id) on delete cascade,
  item_id     text not null,
  is_correct  boolean,
  error_tag   text,                            -- SIGN_ERROR, MULTI_PAIR, NO_PAIR, ... (api.md)
  hints_used  int not null default 0,
  tries       int,
  client_ts   timestamptz not null,
  created_at  timestamptz not null default now(),
  unique (student_id, item_id, client_ts)      -- sinkron berulang tidak membuat data ganda
);

create table if not exists explanations (      -- "Jelaskan ke Temanmu" (GL04)
  id             uuid primary key default gen_random_uuid(),
  student_id     uuid not null references students(id) on delete cascade,
  item_id        text not null,
  reason_choice  int,
  reason_correct boolean,
  text           text check (char_length(text) <= 200),
  client_ts      timestamptz not null,
  created_at     timestamptz not null default now(),
  unique (student_id, item_id, client_ts)
);

create table if not exists cognitive_load (    -- skala beban 1..9
  id         uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  lesson_id  text not null,
  rating     int not null check (rating between 1 and 9),
  client_ts  timestamptz not null,
  created_at timestamptz not null default now(),
  unique (student_id, lesson_id, client_ts)
);

create table if not exists diagnostic_results ( -- Cek Bekal
  student_id      uuid primary key references students(id) on delete cascade,
  scores          jsonb not null default '{}'::jsonb,
  penguatan_tanda boolean not null default false,
  updated_at      timestamptz not null default now()
);

-- Pretest/posttest uraian: jawaban disimpan, skor diisi peneliti (assessments.json: kunci tidak di aplikasi).
create table if not exists assessment_results (
  student_id   uuid not null references students(id) on delete cascade,
  kind         text not null check (kind in ('pre', 'post')),
  answers      jsonb not null default '{}'::jsonb,
  submitted_at timestamptz,
  score        numeric,                         -- diisi peneliti setelah menilai
  per_process  jsonb,                           -- { reasoning, formulate, employ, interpret }
  primary key (student_id, kind)
);

create index if not exists attempts_student_idx on attempts (student_id);
create index if not exists attempts_error_idx   on attempts (error_tag) where error_tag is not null;

-- RLS: aktif, tanpa policy => anon/authenticated tidak bisa akses apa pun.
alter table classes            enable row level security;
alter table students           enable row level security;
alter table progress_snapshots enable row level security;
alter table lesson_progress    enable row level security;
alter table attempts           enable row level security;
alter table explanations       enable row level security;
alter table cognitive_load     enable row level security;
alter table diagnostic_results enable row level security;
alter table assessment_results enable row level security;

-- Tampilan ringkas untuk peneliti (dibuka dari dashboard Supabase → Table Editor / SQL).
create or replace view rekap_siswa with (security_invoker = true) as
select
  s.label,
  s.code,
  (select count(*) from lesson_progress lp where lp.student_id = s.id and lp.done)        as pelajaran_selesai,
  (select count(*) from attempts a where a.student_id = s.id)                             as jumlah_jawaban,
  (select count(*) from attempts a where a.student_id = s.id and a.is_correct)            as jawaban_benar,
  (select coalesce(sum(a.hints_used), 0) from attempts a where a.student_id = s.id)       as hint_dipakai,
  (select count(*) from attempts a where a.student_id = s.id and a.error_tag = 'SIGN_ERROR') as salah_tanda,
  (select round(avg(c.rating), 2) from cognitive_load c where c.student_id = s.id)        as rata_beban,
  (select ar.score from assessment_results ar where ar.student_id = s.id and ar.kind = 'pre')  as skor_pre,
  (select ar.score from assessment_results ar where ar.student_id = s.id and ar.kind = 'post') as skor_post,
  s.last_seen_at
from students s
order by s.label;
