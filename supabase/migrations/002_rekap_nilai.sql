-- Rekap nilai siap Excel: nilai latihan 0–100, nilai pretest/posttest 0–100, dan N-Gain.
-- Rumus sama dengan python/fungsiku_core/skor.py dan docs/kisi-kisi-soal-literasi.md:
--   skor maks total 30 (Reasoning 12, Formulating 6, Employing 6, Interpreting 6)
--   nilai = skor : 30 × 100
--   N-Gain = (post − pre) : (30 − pre); kategori Hake: tinggi ≥ 0,7; sedang 0,3–0,7; rendah < 0,3
-- Cara pakai: Table Editor → rekap_siswa / rekap_indikator → Export → Download as CSV.

-- Skor uraian diisi manual oleh peneliti; tolak angka di luar rentang agar N-Gain tidak keliru.
alter table assessment_results drop constraint if exists assessment_results_score_check;
alter table assessment_results add constraint assessment_results_score_check check (score between 0 and 30);

drop view if exists rekap_siswa;
create view rekap_siswa with (security_invoker = true) as
with dasar as (
  select
    s.id,
    s.label,
    s.code,
    k.name as kelas,
    s.last_seen_at,
    (select count(*) from lesson_progress lp where lp.student_id = s.id and lp.done)          as pelajaran_selesai,
    (select count(*) from attempts a where a.student_id = s.id)                               as jumlah_jawaban,
    (select count(*) from attempts a where a.student_id = s.id and a.is_correct)              as jawaban_benar,
    (select coalesce(sum(a.hints_used), 0) from attempts a where a.student_id = s.id)         as hint_dipakai,
    (select count(*) from attempts a where a.student_id = s.id and a.error_tag = 'SIGN_ERROR') as salah_tanda,
    (select count(*) from attempts a where a.student_id = s.id and a.error_tag in ('MULTI_PAIR', 'NO_PAIR')) as salah_syarat_fungsi,
    (select round(avg(c.rating), 2) from cognitive_load c where c.student_id = s.id)          as rata_beban,
    (select ar.score from assessment_results ar where ar.student_id = s.id and ar.kind = 'pre')  as skor_pre,
    (select ar.score from assessment_results ar where ar.student_id = s.id and ar.kind = 'post') as skor_post
  from students s
  left join classes k on k.id = s.class_id
),
hitung as (
  select
    d.*,
    case when d.jumlah_jawaban > 0 then round(d.jawaban_benar * 100.0 / d.jumlah_jawaban, 2) end as nilai_latihan,
    round(d.skor_pre  * 100.0 / 30, 2) as nilai_pre,
    round(d.skor_post * 100.0 / 30, 2) as nilai_post,
    case when d.skor_pre is not null and d.skor_post is not null and d.skor_pre < 30
         then round((d.skor_post - d.skor_pre) / (30 - d.skor_pre), 4) end as n_gain
  from dasar d
)
select
  label,
  code,
  kelas,
  pelajaran_selesai,
  jumlah_jawaban,
  jawaban_benar,
  nilai_latihan,
  hint_dipakai,
  salah_tanda,
  salah_syarat_fungsi,
  rata_beban,
  skor_pre,
  skor_post,
  nilai_pre,
  nilai_post,
  n_gain,
  case
    when skor_pre = 30 and skor_post is not null then 'tidak terdefinisi (pretest sudah maksimal)'
    when n_gain is null then null
    when n_gain >= 0.7 then 'tinggi'
    when n_gain >= 0.3 then 'sedang'
    else 'rendah'
  end as kategori_n_gain,
  last_seen_at
from hitung
order by (kelas = 'Umum'), label nulls last, code;

-- N-Gain per indikator literasi (dari kolom per_process, diisi peneliti).
-- Contoh isi per_process: {"reasoning": 9, "formulate": 5, "employ": 3, "interpret": 4}
drop view if exists rekap_indikator;
create view rekap_indikator with (security_invoker = true) as
with indikator(nama, maks) as (
  values ('reasoning', 12), ('formulate', 6), ('employ', 6), ('interpret', 6)
),
skor as (
  select
    s.label,
    s.code,
    i.nama as indikator,
    i.maks,
    (pre.per_process ->> i.nama)::numeric  as skor_pre,
    (post.per_process ->> i.nama)::numeric as skor_post
  from students s
  cross join indikator i
  left join assessment_results pre  on pre.student_id  = s.id and pre.kind  = 'pre'
  left join assessment_results post on post.student_id = s.id and post.kind = 'post'
  where pre.per_process is not null or post.per_process is not null
)
select
  label,
  code,
  indikator,
  maks as skor_maks,
  skor_pre,
  skor_post,
  round(skor_pre  * 100.0 / maks, 2) as persen_pre,
  round(skor_post * 100.0 / maks, 2) as persen_post,
  case when skor_pre is not null and skor_post is not null and skor_pre < maks
       then round((skor_post - skor_pre) / (maks - skor_pre), 4) end as n_gain
from skor
order by label nulls last, code, indikator;
