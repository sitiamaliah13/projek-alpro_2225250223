# API — FungsiKu (FastAPI)

> **Status (13 Nov 2026): sebagian sudah berjalan** di `https://fungsiku-api-2225250223.vercel.app` (kode: [backend/](backend/)).
> Sudah ada: `GET /health`, `POST /auth/login`, `POST /auth/daftar` (kode samaran otomatis `FK-UM-xxxxxx`, kelas "Umum", 10/menit/IP), `GET /me`, `GET /progress`, **`PUT /progress`**.
> `PUT /progress` menggantikan `POST /attempts/batch`, `/explanations`, `/cognitive-load`, dan `/lessons/{id}/complete`:
> aplikasi mengirim salinan progres utuh, lalu server memecahnya ke tabel rinci tanpa data ganda.
> Endpoint lain di bawah masih rancangan. Konten & penilaian latihan masih di aplikasi (kunci latihan demo).

- **Base URL dev:** `http://localhost:8000`
- **Base URL prod:** `https://fungsiku-api.onrender.com` (contoh)
- **Auth:** `Authorization: Bearer <JWT>` (kecuali `/health`, `/auth/login`)
- **Dokumentasi otomatis:** `/docs`, `/redoc`

## Format Error
```json
{ "detail": { "code": "INVALID_CODE", "message": "Kode siswa tidak ditemukan." } }
```
| HTTP | code | Arti |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Input tidak valid |
| 401 | `INVALID_CODE` / `TOKEN_EXPIRED` | Kode salah / token habis |
| 403 | `INACTIVE` / `LOCKED` | Kode nonaktif / konten belum terbuka |
| 404 | `NOT_FOUND` | Data tidak ada |
| 409 | `ALREADY_SUBMITTED` | Asesmen sudah dikerjakan |
| 429 | `RATE_LIMITED` | Terlalu banyak percobaan |

## Kode Jenis Kesalahan (`error_tag`)
| Tag | Arti | Umpan balik contoh |
|---|---|---|
| `MULTI_PAIR` | Ada anggota domain dengan > 1 pasangan | "2 punya dua pasangan. Fungsi hanya boleh satu." |
| `NO_PAIR` | Ada anggota domain tanpa pasangan | "3 belum punya pasangan." |
| `SIGN_ERROR` | Salah tanda saat substitusi | "Positif × negatif hasilnya negatif." |
| `SLOPE_ERROR` | Nilai a salah | "Bandingkan perubahan f(x) dengan perubahan x." |
| `OFFSET_ERROR` | Nilai b salah | "Coba substitusi satu titik untuk mencari b." |
| `TERM_SWAP` | Domain/kodomain/range tertukar | "Range hanya anggota B yang terkena panah." |
| `UNIT_ERROR` | Satuan/penafsiran konteks salah | "Hasilnya dalam rupiah, bukan km." |

---

## 1. Sistem & Autentikasi
### `GET /health`
`200 { "status": "ok" }`

### `POST /auth/login`
```json
{ "code": "FK-8A-K3P9" }
```
→ `200`
```json
{ "access_token": "eyJ...", "token_type": "bearer", "expires_in": 2592000,
  "student": { "id": "uuid", "nickname": "Bima", "class": "8A",
               "pretest_done": false, "diagnostic_done": false } }
```
Rate limit 5/menit/IP. Kode tidak peka huruf besar/kecil.

### `GET /me`
Profil singkat + status asesmen.

## 2. Diagnostik (Cek Bekal)
### `GET /diagnostic`
Soal prasyarat (himpunan, relasi, operasi bilangan bulat).

### `POST /diagnostic/submit`
```json
{ "answers": [{ "item_id": "d-01", "response": { "value": -7 } }] }
```
→
```json
{ "scores": { "himpunan": 100, "bilangan_bulat": 60 },
  "route": ["m0-tanda"], "message": "Yuk, perkuat dulu tanda bilangan bulat." }
```

## 3. Konten
### `GET /modules`
```json
[{ "id": "m1", "title": "Relasi atau Fungsi?", "order_no": 1,
   "lessons_total": 3, "lessons_done": 1, "stars": 2, "status": "open" }]
```
### `GET /modules/{module_id}`
Detail modul + daftar pelajaran (`locked` | `open` | `done`).

### `GET /lessons/{lesson_id}`
```json
{
  "id": "m4-jembatan",
  "title": "Dari Panah ke Rumus",
  "cards": [
    { "type": "analogy", "text": "Mesin jus: masukkan 1 jeruk, keluar 1 gelas." },
    { "type": "concept", "text": "Satu data bisa ditulis dengan banyak cara." },
    { "type": "bridge", "function": { "a": 2, "b": 1 }, "domain": [1,2,3,4],
      "stages": ["arrow", "pairs", "table", "pattern", "formula", "graph"] },
    { "type": "scene3d", "scene": "function_machine", "rule": { "a": 2, "b": 1 } },
    { "type": "worked", "steps": ["...", "..."] },
    { "type": "faded", "steps": ["...", { "blank": true, "item_id": "m4-f1" }] }
  ],
  "items": ["m4-s1", "m4-s2", "m4-s3"]
}
```

### `GET /items/{item_id}`
Soal tanpa kunci. Contoh tipe `arrow_diagram`:
```json
{ "id": "m1-s2", "type": "arrow_diagram",
  "prompt": "Buat relasi dari A ke B yang merupakan fungsi.",
  "A": [1, 2, 3], "B": ["a", "b", "c", "d"],
  "task": "build_function",         // build_function | build_non_function | judge
  "preset_pairs": [],
  "hints_available": 3, "structure_tag": "syarat-fungsi" }
```
Contoh tipe `multi_step` (literasi):
```json
{ "id": "m7-ojek", "type": "multi_step",
  "literacy_process": ["formulate", "employ", "interpret"],
  "stem": { "text": "Tarif ojek: Rp5.000 saat naik, lalu Rp2.000 per km. Rani naik 6 km. Uangnya Rp20.000. Cukupkah?",
            "highlightable": ["Rp5.000", "Rp2.000 per km", "6 km", "Rp20.000"] },
  "steps": [
    { "key": "pahami",    "type": "highlight" },
    { "key": "rumuskan",  "type": "formula",  "template": "f(x) = _x + _" },
    { "key": "hitung",    "type": "numeric",  "unit": "rupiah" },
    { "key": "tafsirkan", "type": "mcq_reason", "options": ["Cukup", "Tidak cukup"] }
  ] }
```

### `GET /items/{item_id}/hint?level=1..3`
`200 { "level": 1, "text": "Biaya naik dibayar sekali saja." }` — penggunaan hint dicatat.

## 4. Jawaban
### `POST /attempts`
```json
{ "item_id": "m1-s2", "step": null,
  "response": { "pairs": [[1,"a"],[2,"b"],[2,"c"],[3,"d"]] },
  "hints_used": 0, "used_check_back": false,
  "duration_ms": 38000, "client_ts": "2026-11-12T10:05:00Z" }
```
→
```json
{ "is_correct": false, "error_tag": "MULTI_PAIR",
  "feedback": "2 punya dua pasangan (b dan c). Fungsi hanya boleh satu.",
  "highlight": { "A": [2] }, "next_step": null }
```
Contoh rumus: `"response": { "formula": "3x-1" }`. Rumus dinilai dengan SymPy; bentuk setara diterima.

### `POST /attempts/batch`
`{ "attempts": [ ... maks 50 ... ] }` → `{ "accepted": n, "results": [...] }`

### `POST /check-back`
Fitur Cek Balik (GL02). Endpoint ini tidak dinilai, hanya mencatat penggunaannya.
```json
{ "item_id": "m6-s1", "formula": "3x-1", "x": -1 }
```
→ `200 { "value": -4, "matches_given": true }`

### `POST /explanations`
Fitur "Jelaskan ke Temanmu" (GL04).
Siswa **memilih alasan** (wajib, dinilai otomatis), lalu **boleh menambah kalimat sendiri** (opsional, maks 200 karakter, dibaca peneliti).
```json
{ "item_id": "m1-s2", "reason_choice": 1,
  "text": "Soalnya angka 2 panahnya ada dua." }
```
→ `201 { "saved": true, "reason_correct": true,
         "model_answer": "Bukan fungsi, karena 2 punya dua pasangan. Fungsi: setiap anggota A tepat satu pasangan." }`

## 5. Progres & Beban Kognitif
### `POST /lessons/{lesson_id}/complete`
→ `{ "stars": 3, "badge": "Detektif Tanda" | null }`

### `POST /cognitive-load`
```json
{ "lesson_id": "m4-jembatan", "rating": 6 }
```
→ `201 { "suggestion": "extra_example" | "skip_faded" | null }`

### `GET /progress`
```json
{ "modules": [{ "id": "m1", "percent": 100, "stars": 6 }],
  "avg_load": 4.3,
  "error_trend": { "SIGN_ERROR": [3, 2, 0] },
  "pretest": 45, "posttest": null }
```

## 6. Asesmen Literasi
### `GET /assessments/{kind}` — `pre` | `post`
Posttest `403 LOCKED` sampai modul MVP selesai; `409` bila sudah dikerjakan.

### `POST /assessments/{kind}/submit`
```json
{ "answers": [{ "item_id": "pre-01", "response": { "choice": 2 } }], "duration_ms": 900000 }
```
→ `{ "score": 21, "per_process": { "reasoning": 9, "formulate": 5, "employ": 3, "interpret": 4 }, "max_per_process": { "reasoning": 12, "formulate": 6, "employ": 6, "interpret": 6 }, "max_total": 30 }`

## 7. Ekspor Data
Tidak ada endpoint publik. Data diekspor lewat dashboard Supabase (CSV) atau `backend/scripts/export.py`, menghasilkan N-Gain, rata-rata beban per sub-materi, tren `error_tag`, dan penggunaan hint.
