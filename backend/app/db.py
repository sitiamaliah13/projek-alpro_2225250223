"""Akses database Supabase lewat REST (PostgREST) memakai service key.

Service key hanya ada di server (agents.md aturan 6). RLS aktif tanpa policy publik,
jadi hanya kunci ini yang bisa membaca/menulis tabel.
"""

from __future__ import annotations

import os
from typing import Any, Protocol

import httpx


class Db(Protocol):
    def select(self, table: str, params: dict[str, str]) -> list[dict[str, Any]]: ...
    def upsert(self, table: str, rows: list[dict[str, Any]], on_conflict: str, ignore_duplicates: bool = False) -> None: ...
    def update(self, table: str, match: dict[str, str], values: dict[str, Any]) -> None: ...
    def insert(self, table: str, row: dict[str, Any]) -> dict[str, Any]: ...


class SupabaseDb:
    def __init__(self, url: str, service_key: str) -> None:
        self._client = httpx.Client(
            base_url=url.rstrip("/") + "/rest/v1",
            headers={"apikey": service_key, "Authorization": f"Bearer {service_key}"},
            timeout=10.0,
        )

    def select(self, table: str, params: dict[str, str]) -> list[dict[str, Any]]:
        r = self._client.get(f"/{table}", params=params)
        r.raise_for_status()
        return r.json()

    def upsert(self, table: str, rows: list[dict[str, Any]], on_conflict: str, ignore_duplicates: bool = False) -> None:
        if not rows:
            return
        resolution = "ignore-duplicates" if ignore_duplicates else "merge-duplicates"
        r = self._client.post(
            f"/{table}",
            params={"on_conflict": on_conflict},
            json=rows,
            headers={"Prefer": f"resolution={resolution},return=minimal"},
        )
        r.raise_for_status()

    def insert(self, table: str, row: dict[str, Any]) -> dict[str, Any]:
        r = self._client.post(f"/{table}", json=row, headers={"Prefer": "return=representation"})
        r.raise_for_status()
        return r.json()[0]

    def update(self, table: str, match: dict[str, str], values: dict[str, Any]) -> None:
        params = {k: f"eq.{v}" for k, v in match.items()}
        r = self._client.patch(f"/{table}", params=params, json=values, headers={"Prefer": "return=minimal"})
        r.raise_for_status()


_db: Db | None = None


def get_db() -> Db:
    """Dependency FastAPI. Tes menggantinya dengan database tiruan."""
    global _db
    if _db is None:
        url = os.environ.get("SUPABASE_URL")
        key = os.environ.get("SUPABASE_SERVICE_KEY")
        if not url or not key:
            raise RuntimeError("SUPABASE_URL dan SUPABASE_SERVICE_KEY belum diatur.")
        _db = SupabaseDb(url, key)
    return _db
