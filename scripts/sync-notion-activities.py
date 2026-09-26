#!/usr/bin/env python3
"""One-time sync of the public Notion activity gallery into local site assets."""

from __future__ import annotations

import json
import subprocess
import tempfile
import time
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "public" / "activities"
DATA_FILE = ROOT / "app" / "data" / "activities.ts"
CACHE_DIR = Path(tempfile.gettempdir()) / "taebin-notion-activity-cache"

SPACE_ID = "69232c8f-690f-460b-878a-3fbe3e055cff"
COLLECTION_ID = "c3a1c232-f629-429c-a6d3-55c2bd82ab6a"
VIEW_ID = "00e441e6-2ee5-45a2-ad90-86eb8771ad5b"
COLLECTION_BLOCK_ID = "307fc7b3-b78e-4a1e-9ea4-0cfc849f688d"
MAIN_PAGE_ID = "d69375f9-4f30-46f0-af2f-05915d25d561"

FOH_TAGS = {"오퍼레이팅", "튜닝"}
STAGE_TAGS = {"크루", "RF", "랜탈회사", "무대진행 및 보조", "플레이백"}


def post(endpoint: str, body: dict) -> dict:
    request = urllib.request.Request(
        f"https://www.notion.so/api/v3/{endpoint}",
        data=json.dumps(body).encode(),
        headers={"Content-Type": "application/json", "User-Agent": "Mozilla/5.0"},
    )
    for attempt in range(7):
        try:
            with urllib.request.urlopen(request, timeout=40) as response:
                return json.loads(response.read())
        except Exception:
            if attempt == 6:
                raise
            time.sleep(1.5 * (attempt + 1))
    raise RuntimeError("unreachable")


def value(record: dict) -> dict:
    outer = record.get("value", {})
    return outer.get("value", outer)


def plain_text(rich_text: list | None) -> str:
    if not rich_text:
        return ""
    return "".join(str(fragment[0]) for fragment in rich_text if fragment)


def role_from(tags: list[str]) -> str:
    tag_set = set(tags)
    if tag_set & FOH_TAGS:
        return "FOH Engineer"
    if tag_set & STAGE_TAGS:
        return "Stage Technician"
    return "애매함!"


def load_page(page_id: str) -> dict:
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    cached = CACHE_DIR / f"{page_id}.json"
    if cached.exists():
        return json.loads(cached.read_text())
    page = post(
        "loadPageChunk",
        {"pageId": page_id, "limit": 100, "cursor": {"stack": []}, "verticalColumns": False},
    )
    cached.write_text(json.dumps(page, ensure_ascii=False))
    return page


def signed_url(source: str, block_id: str) -> str | None:
    result = post(
        "getSignedFileUrls",
        {
            "spaceId": SPACE_ID,
            "urls": [
                {
                    "url": source,
                    "permissionRecord": {"table": "block", "id": block_id, "spaceId": SPACE_ID},
                }
            ],
        },
    )
    return result.get("signedUrls", [None])[0]


def download_jpeg(url: str, target: Path) -> bool:
    with tempfile.TemporaryDirectory() as temporary_directory:
        source = Path(temporary_directory) / "source"
        request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(request, timeout=60) as response:
            source.write_bytes(response.read())
        result = subprocess.run(
            ["sips", "-Z", "1400", "-s", "format", "jpeg", "-s", "formatOptions", "82", str(source), "--out", str(target)],
            capture_output=True,
            text=True,
        )
        return result.returncode == 0 and target.exists() and target.stat().st_size > 0


def main() -> None:
    query = post(
        "queryCollection",
        {
            "collectionView": {"id": VIEW_ID, "spaceId": SPACE_ID},
            "collectionViewBlock": {"id": COLLECTION_BLOCK_ID, "spaceId": SPACE_ID},
            "clientType": "notion_app",
            "userTimeZone": "Asia/Seoul",
            "isFullScreen": True,
            "isMobile": False,
        },
    )
    all_ids = set(query["allBlockIds"])
    main_page = load_page(MAIN_PAGE_ID)
    view_record = main_page["recordMap"]["collection_view"][VIEW_ID]
    ordered_ids = [page_id for page_id in value(view_record).get("page_sort", []) if page_id in all_ids]
    if len(ordered_ids) != len(all_ids):
        ordered_ids.extend(sorted(all_ids - set(ordered_ids)))

    ASSET_DIR.mkdir(parents=True, exist_ok=True)
    activities: list[dict[str, str]] = []
    referenced_files: set[str] = set()

    for index, page_id in enumerate(ordered_ids, start=1):
        page = load_page(page_id)
        blocks = page.get("recordMap", {}).get("block", {})
        root = value(blocks.get(page_id, {}))
        properties = root.get("properties", {})
        title = plain_text(properties.get("title")) or "Untitled activity"
        tags = [tag.strip() for tag in plain_text(properties.get("exW_", [])).split(",") if tag.strip()]

        image_block_id = ""
        image_source = ""
        content_order = root.get("content", [])
        candidates = content_order + [block_id for block_id in blocks if block_id not in content_order]
        for block_id in candidates:
            block = value(blocks.get(block_id, {}))
            if block.get("type") == "image":
                source_value = block.get("properties", {}).get("source")
                if source_value:
                    image_block_id = block_id
                    image_source = plain_text(source_value)
                    break

        image_path = ""
        target_name = f"{index:03d}-{page_id[:8]}.jpg"
        target = ASSET_DIR / target_name
        if image_source and image_block_id:
            if not target.exists():
                url = signed_url(image_source, image_block_id)
                if url and not download_jpeg(url, target):
                    target.unlink(missing_ok=True)
            if target.exists():
                image_path = f"/activities/{target_name}"
                referenced_files.add(target_name)

        activities.append(
            {"id": page_id, "title": title, "image": image_path, "role": role_from(tags)}
        )
        print(f"{index:03d}/{len(ordered_ids)} {activities[-1]['role']:<16} {title}", flush=True)
        time.sleep(0.12)

    for existing in ASSET_DIR.iterdir():
        if existing.is_file() and existing.name not in referenced_files:
            existing.unlink()

    lines = [
        "export type Activity = { id: string; title: string; image: string; role: 'Stage Technician' | 'FOH Engineer' | '애매함!' };",
        "",
        "export const activities: Activity[] = [",
    ]
    lines.extend(f"  {json.dumps(activity, ensure_ascii=False)}," for activity in activities)
    lines.append("];\n")
    DATA_FILE.write_text("\n".join(lines))

    counts = {role: sum(activity["role"] == role for activity in activities) for role in ("Stage Technician", "FOH Engineer", "애매함!")}
    print(f"Synced {len(activities)} cards, {len(referenced_files)} images: {counts}")


if __name__ == "__main__":
    main()
