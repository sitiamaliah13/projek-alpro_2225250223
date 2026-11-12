"""Login kode siswa: JWT 30 hari + batas 5 percobaan/menit/IP (architecture.md §6)."""

from __future__ import annotations

import os
import time
from collections import defaultdict, deque

import jwt
from fastapi import Header, HTTPException

MASA_TOKEN = 30 * 24 * 3600  # detik
BATAS_LOGIN = 5
JENDELA_LOGIN = 60.0


def galat(status: int, code: str, message: str) -> HTTPException:
    """Format error sesuai api.md."""
    return HTTPException(status_code=status, detail={"code": code, "message": message})


def _rahasia() -> str:
    s = os.environ.get("JWT_SECRET")
    if not s:
        raise RuntimeError("JWT_SECRET belum diatur.")
    return s


def buat_token(student_id: str, sekarang: float | None = None) -> str:
    t = int(sekarang if sekarang is not None else time.time())
    return jwt.encode({"sub": student_id, "iat": t, "exp": t + MASA_TOKEN}, _rahasia(), algorithm="HS256")


def baca_token(token: str) -> str:
    try:
        data = jwt.decode(token, _rahasia(), algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise galat(401, "TOKEN_EXPIRED", "Sesi habis. Masukkan kode siswa lagi.")
    except jwt.InvalidTokenError:
        raise galat(401, "TOKEN_EXPIRED", "Sesi tidak valid. Masukkan kode siswa lagi.")
    return str(data["sub"])


def id_siswa_dari_header(authorization: str | None = Header(default=None)) -> str:
    """Dependency: ambil student_id dari 'Authorization: Bearer <JWT>'."""
    if not authorization or not authorization.lower().startswith("bearer "):
        raise galat(401, "TOKEN_EXPIRED", "Masukkan kode siswa dulu.")
    return baca_token(authorization.split(" ", 1)[1].strip())


class PembatasLogin:
    """Batas percobaan per IP di memori. Di server tanpa-state (serverless) sifatnya upaya terbaik."""

    def __init__(self, batas: int = BATAS_LOGIN, jendela: float = JENDELA_LOGIN) -> None:
        self.batas = batas
        self.jendela = jendela
        self._catatan: dict[str, deque[float]] = defaultdict(deque)

    def cek(self, ip: str, sekarang: float | None = None) -> None:
        t = sekarang if sekarang is not None else time.monotonic()
        q = self._catatan[ip]
        while q and t - q[0] > self.jendela:
            q.popleft()
        if len(q) >= self.batas:
            raise galat(429, "RATE_LIMITED", "Terlalu banyak percobaan. Tunggu 1 menit, lalu coba lagi.")
        q.append(t)
