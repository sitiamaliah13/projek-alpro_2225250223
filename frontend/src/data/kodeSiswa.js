/** Buat identitas lokal samaran; nama panggilan tidak dipakai sebagai kunci data. */
export function buatIdSamaran() {
  const nilai = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
  return `anon-${nilai}`
}

/** Terima nama panggilan saja. Jangan masukkan nama lengkap atau data pribadi. */
export function buatSiswa(teks) {
  const nama = String(teks ?? '').trim().replace(/\s+/g, ' ')
  if (!nama) return { ok: false, pesan: 'Masukkan nama panggilanmu.' }
  if (nama.length > 24) return { ok: false, pesan: 'Nama panggilan maksimal 24 karakter.' }
  if (/\p{Cc}/u.test(nama)) return { ok: false, pesan: 'Nama panggilan berisi karakter yang tidak didukung.' }

  const id = buatIdSamaran()
  return { ok: true, siswa: { nama, peserta: id, kode: id } }
}
