-- Data awal: 1 kelas uji coba + 5 kode siswa (task.md Fase G: P01–P03 + 2 cadangan).
-- Kode hanya pengenal samaran. Jangan tulis nama asli siswa di sini (agents.md aturan 6).
-- Untuk menambah kode baru, salin satu baris insert di bawah dan ganti kode & labelnya.

insert into classes (name, grade) values ('8A', 8) on conflict (name) do nothing;
-- Kelas 'Umum': pengguna tanpa kode dari guru. Kodenya dibuat otomatis oleh POST /auth/daftar (FK-UM-xxxxxx).
insert into classes (name, grade) values ('Umum', 8) on conflict (name) do nothing;

insert into students (code, label, class_id)
select v.code, v.label, c.id
from (values
  ('FK-8A-9MCT', 'P01'),
  ('FK-8A-VMSM', 'P02'),
  ('FK-8A-5D75', 'P03'),
  ('FK-8A-WJUU', 'P04'),  -- cadangan
  ('FK-8A-ZP5K', 'P05')   -- cadangan
) as v(code, label)
cross join classes c
where c.name = '8A'
on conflict (code) do nothing;
