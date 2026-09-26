#!/usr/bin/env python3
"""One-time sync of the public Notion activity gallery into local site assets."""

from __future__ import annotations

import json
import re
import subprocess
import tempfile
import time
import urllib.request
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "public" / "activities"
DATA_FILE = ROOT / "content" / "activities.json"
CACHE_DIR = Path(tempfile.gettempdir()) / "taebin-notion-activity-cache"

SPACE_ID = "69232c8f-690f-460b-878a-3fbe3e055cff"
COLLECTION_ID = "c3a1c232-f629-429c-a6d3-55c2bd82ab6a"
VIEW_ID = "00e441e6-2ee5-45a2-ad90-86eb8771ad5b"
COLLECTION_BLOCK_ID = "307fc7b3-b78e-4a1e-9ea4-0cfc849f688d"
MAIN_PAGE_ID = "d69375f9-4f30-46f0-af2f-05915d25d561"

MIXING_TAGS = {"오퍼레이팅"}
STAGE_TAGS = {"크루", "RF", "랜탈회사", "무대진행 및 보조", "플레이백"}
SYSTEM_TERMS = {
    "음향시스템 튜닝",
    "음향 시스템 튜닝",
    "시스템 디자인",
    "시스템 기획",
    "원형무대 기획",
    "원형 무대 기획",
    "얼라인먼트",
}


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


def role_from(tags: list[str], title: str, details: str) -> str:
    tag_set = set(tags)
    combined = f"{title} {details}"
    if "튜닝" in tag_set or any(term in combined for term in SYSTEM_TERMS) or "AFC 이머시브 오디오" in title:
        return "System Engineer"
    if tag_set & MIXING_TAGS:
        return "Mixing Engineer"
    if tag_set & STAGE_TAGS:
        return "Technician"
    return "애매함!"


def event_type_from(title: str, tags: list[str]) -> str:
    lowered = title.lower()
    tag_set = set(tags)
    if "튜닝" in title:
        return "Sound System Tuning"
    if "음향담당관" in title or "음향간사" in title:
        return "House of Worship Audio"
    if "드론" in title:
        return "Drone Light Show"
    if "신차 발표회" in title:
        return "Vehicle Launch Event"
    if "팬미팅" in title or "fanmeeting" in lowered or "fan meeting" in lowered or "fancon" in lowered:
        return "Fan Meeting"
    if "쇼케이스" in title:
        return "Artist Showcase"
    if "수련회" in title:
        return "Church Retreat"
    if "캠프" in title:
        return "Camp & Community Program"
    if "찬양집회" in title or "연합예배" in title or "감사예배" in title or "성탄 공연" in title:
        return "Worship Service"
    if "뮤지컬" in title:
        return "Musical Production"
    if "연극" in title or "소리극" in title or "오페라마" in title:
        return "Theater Production"
    if "컨퍼런스" in title or "학술대회" in title or "경찰청장회의" in title:
        return "Conference"
    if "포럼" in title or "토크콘서트" in title or "강연" in title:
        return "Forum & Talk"
    if "creators day" in lowered or "crea tors day" in lowered:
        return "Creative Industry Conference"
    if "어워즈" in title:
        return "Awards Event"
    if "마라톤" in title:
        return "Marathon & Music Festival"
    if "영화제" in title or "시네마" in title:
        return "Film & Community Event"
    if "버스킹" in title:
        return "Outdoor Live Performance"
    if "dima tv" in lowered or "방송 1회차 촬영" in title or "녹음" in title:
        return "Broadcast & Recording Production"
    if "축제" in title or "festival" in lowered or "fleischfest" in lowered or "페스티벌" in title or "행주문화제" in title or "개천절" in title:
        return "Festival"
    if "발표회" in title or "가요제" in title or "갈라쇼" in title or "한마당" in title or "선인제" in title or "새나무제" in title or "아프dima" in lowered:
        return "School & Community Performance"
    if "영어 말하기 대회" in title:
        return "English Speech Competition"
    if "박람회" in title:
        return "Fair & Exhibition"
    if "회원대회" in title:
        return "Convention"
    if "해단식" in title:
        return "Closing Ceremony"
    if "콘서트" in title or "concert" in lowered or "tour" in lowered or "정기공연" in title or "음악회" in title or "개강공연" in title or "흠뻑쇼" in title:
        return "Concert"
    if any(term in lowered for term in ("sincerely 35", "connect x", "glitter day", "voice memo", "twinkle twinkle")):
        return "Concert"
    if "클래식 소풍" in title:
        return "Community Concert"
    if "공연" in title or "performance" in lowered or "live" in lowered:
        return "Live Performance"
    if "장학" in title or "재단" in title or "은행" in title or "현대자동차" in title or "tbwa" in lowered:
        return "Corporate & Foundation Event"
    if "연합체전" in title:
        return "University Sports Event"
    if "교회" in title or "교회" in tag_set:
        return "Church Event"
    if "오퍼레이팅" in tag_set:
        return "Live Sound Production"
    return "Live Event Production"


def english_title_from(title: str) -> str:
    translated = title.strip()
    replacements = [
        ("동아방송예술대학교", "DIMA"),
        ("동아방송예술대", "DIMA"),
        ("동아방송대", "DIMA"),
        ("고려대학교", "Korea University"),
        ("서강대학교", "Sogang University"),
        ("성균관대", "Sungkyunkwan University"),
        ("한밭대", "Hanbat National University"),
        ("롯데장학재단", "Lotte Scholarship Foundation"),
        ("NC문화재단", "NC Cultural Foundation"),
        ("한국언론진흥재단", "Korea Press Foundation"),
        ("사단법인 한국음향협회", "Korea Sound Association"),
        ("(사)한국음향협회", "Korea Sound Association"),
        ("한국경제인협회", "Federation of Korean Industries"),
        ("현대자동차", "Hyundai Motor Company"),
        ("국군중앙교회", "ROK Armed Forces Central Church"),
        ("국방부", "Ministry of National Defense"),
        ("신라호텔", "The Shilla Seoul"),
        ("노브워십", "KNOB Worship"),
        ("로이킴", "Roy Kim"),
        ("신승훈", "Shin Seung Hun"),
        ("어반자카파", "Urban Zakapa"),
        ("김혜윤", "Kim Hye-yoon"),
        ("샤이니 태민", "SHINee TAEMIN"),
        ("NCT 태용", "NCT TAEYONG"),
        ("르세라핌", "LE SSERAFIM"),
        ("(여자)아이들", "(G)I-DLE"),
        ("정세운", "JEONG SEWOON"),
        ("싸이", "PSY"),
        ("경기도 안성시 주최", "Hosted by Anseong City, Gyeonggi Province"),
        ("안성시", "Anseong City"),
        ("부천시", "Bucheon City"),
        ("시흥시", "Siheung City"),
        ("노원구", "Nowon District"),
        ("음향시스템 튜닝", "Sound System Tuning"),
        ("음향 시스템 튜닝", "Sound System Tuning"),
        ("전체 예배당", "Main Sanctuary"),
        ("소예배실", "Chapel"),
        ("예배당", "Sanctuary"),
        ("신차 발표회", "New Vehicle Launch"),
        ("팬미팅", "Fan Meeting"),
        ("정기공연", "Annual Concert"),
        ("개강공연", "Opening Concert"),
        ("기념 공연", "Anniversary Concert"),
        ("전시 콘서트", "Exhibition Concert"),
        ("토크콘서트", "Talk Concert"),
        ("콘서트", "Concert"),
        ("쇼케이스", "Showcase"),
        ("수련회", "Retreat"),
        ("연합예배", "Joint Worship Service"),
        ("감사예배&임직식", "Thanksgiving Service & Ordination Ceremony"),
        ("감사예배", "Thanksgiving Service"),
        ("찬양집회", "Worship Concert"),
        ("성탄 공연", "Christmas Concert"),
        ("뮤지컬 발표회", "Musical Showcase"),
        ("뮤지컬 투어", "Musical Tour"),
        ("뮤지컬", "Musical"),
        ("연극", "Theater"),
        ("소리극", "Music Theater"),
        ("가요제", "Singing Contest"),
        ("발표회", "Showcase"),
        ("말하기 대회", "Speech Competition"),
        ("학술대회", "Conference"),
        ("컨퍼런스", "Conference"),
        ("회원대회", "Members Convention"),
        ("드론 라이트쇼", "Drone Light Show"),
        ("마을축제", "Community Festival"),
        ("문화제", "Cultural Festival"),
        ("축제", "Festival"),
        ("영화제", "Film Festival"),
        ("박람회", "Fair"),
        ("버스킹", "Busking Performance"),
        ("음향 오퍼레이팅", "Audio Mixing"),
        ("오퍼레이팅", "Mixing"),
        ("음향간사", "House Audio Engineer"),
        ("음향담당관", "Audio Engineer"),
        ("원형무대 기획", "In-the-Round Stage System Design"),
        ("원형 무대 기획", "In-the-Round Stage System Design"),
        ("음향 담당", "Audio Production"),
        ("기획공연", "Special Production"),
        ("녹음", "Recording"),
        ("동문 홈커밍데이", "Alumni Homecoming Day"),
        ("네트워킹데이", "Networking Day"),
        ("한마음소통캠프", "Community Camp"),
        ("희망장학생", "Hope Scholars"),
        ("롯데희망장학생", "Lotte Hope Scholars"),
        ("군선교연합캠프", "United Military Ministry Camp"),
        ("경영자 제주하계포럼", "Jeju Summer Business Forum"),
        ("어반 아일랜드", "Urban Island"),
        ("모두의 인공지능 윤리", "AI Ethics for Everyone"),
        ("국제어학원", "Institute of International Education"),
        ("국제 영어", "International English"),
        ("이머시브 오디오", "Immersive Audio"),
        ("신격호평전독후활동공모전 롯데임직원 행사", "Shin Kyuk-ho Biography Reading Contest · Lotte Employee Event"),
        ("개천절민족공동행사", "National Foundation Day Community Event"),
        ("꿈끼 한마당", "Dream & Talent Festival"),
        ("그린나래 종합예술발표회", "그린나래 Arts Showcase"),
        ("화요콘서트", "Tuesday Concert"),
        ("포레스트런", "Forest Run"),
        ("애쉬 아일랜드", "ASH ISLAND"),
        ("유스페스티벌", "Youth Festival"),
        ("하계", "Summer "),
        ("동계", "Winter "),
        ("내한공연", "Korea Concert"),
        ("페스티벌", "Festival"),
        ("음악회", "Concert"),
        ("시즌", "Season "),
        ("창립 100주년", "100th Anniversary"),
        ("50주년 기념 시민콘서트", "50th Anniversary Civic Concert"),
        ("관현악단 오케스트라", "Orchestra"),
        ("금요예배", "Friday Worship"),
        ("학생회", "Student Council"),
        ("중앙동아리", "Student Club"),
        ("밴드동아리", "Band Club"),
        ("주니어보드", "Junior Board"),
        ("거리", "Street "),
        ("원형무대", "In-the-Round Stage"),
        ("셋업", "Setup"),
        ("공연", "Performance"),
        ("행사", "Event"),
        ("대학", "University"),
        ("청년부", "Young Adults Ministry"),
        ("청소년부", "Youth Ministry"),
        ("중고등부", "Youth Ministry"),
        ("중등부", "Middle School Ministry"),
        ("고등부", "High School Ministry"),
        ("초등부", "Children's Ministry"),
        ("전교인", "All-Church"),
        ("중학교", "Middle School"),
        ("고등학교", "High School"),
        ("초등학교", "Elementary School"),
        ("교회", "Church"),
        ("장학생", "Scholars"),
        ("장학", "Scholarship"),
        ("기업행사", "Corporate Event"),
        ("강연 행사", "Lecture Event"),
        ("연합체전", "Intercollegiate Sports Day"),
        ("해단식", "Closing Ceremony"),
        ("진로체험", "Career Exploration"),
        ("청소년", "Youth"),
    ]
    for korean, english in replacements:
        translated = translated.replace(korean, english)

    cleanup_replacements = [
        ("희망 Scholars", "Hope Scholars"),
        ("롯데 Hope Scholars", "Lotte Hope Scholars"),
        ("화요 Concert", "Tuesday Concert"),
        ("화요Concert", "Tuesday Concert"),
        ("그린나래 종합예술 Showcase", "그린나래 Arts Showcase"),
        ("그린나래 종합예술Showcase", "그린나래 Arts Showcase"),
        ("50주년 기념 시민 Concert", "50th Anniversary Civic Concert"),
        ("50주년 기념 시민Concert", "50th Anniversary Civic Concert"),
        ("KPFKorea Press Foundation", "KPF · Korea Press Foundation"),
        ("100th Anniversary 기념", "100th Anniversary"),
        ("성탄 Concert", "Christmas Concert"),
        ("캠프코리아 스탭", "Camp Korea Staff"),
        ("CCC 연합 예배", "CCC Joint Worship Service"),
        ("DIMA Musical 과 1학년 기말 Performance", "DIMA Department of Musical Theatre · First-Year Final Performance"),
        ("Season 2 방송 1회차 촬영", "Season 2 · Episode 1 Filming"),
        ("27대 Student Council", "27th Student Council"),
        ("Youth 문화재단", "Youth Foundation"),
        ("강연 Event", "Lecture Event"),
        ("동아리 Showcase", "Student Club Showcase"),
        ("찬양 저녁집회", "Evening Worship"),
        ("서울국제경찰청장회의", "Seoul International Police Chiefs Conference"),
    ]
    for source, replacement in cleanup_replacements:
        translated = translated.replace(source, replacement)

    def ordinal(match: re.Match[str]) -> str:
        number = int(match.group(1))
        suffix = "th" if 10 <= number % 100 <= 20 else {1: "st", 2: "nd", 3: "rd"}.get(number % 10, "th")
        return f"{number}{suffix}"

    translated = re.sub(r"제\s*(\d+)회", ordinal, translated)
    translated = re.sub(r"(?<=[가-힣])(?=[A-Za-z(])", " ", translated)
    translated = re.sub(r"(?<=[A-Za-z)])(?=[가-힣])", " ", translated)
    translated = re.sub(r"\s{2,}", " ", translated)
    return translated.strip()


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
    current_year = ""

    for index, page_id in enumerate(ordered_ids, start=1):
        page = load_page(page_id)
        blocks = page.get("recordMap", {}).get("block", {})
        root = value(blocks.get(page_id, {}))
        properties = root.get("properties", {})
        title = plain_text(properties.get("title")) or "Untitled activity"
        explicit_year = re.search(r"\b(20\d{2})\b", title)
        if explicit_year:
            current_year = explicit_year.group(1)
        elif not current_year:
            current_year = str(datetime.fromtimestamp(root.get("created_time", time.time() * 1000) / 1000).year)
        tags = [tag.strip() for tag in plain_text(properties.get("exW_", [])).split(",") if tag.strip()]
        details = " ".join(
            plain_text(value(record).get("properties", {}).get("title"))
            for record in blocks.values()
        )

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
            {
                "id": page_id,
                "title": title,
                "englishTitle": english_title_from(title),
                "eventType": event_type_from(title, tags),
                "year": current_year,
                "image": image_path,
                "role": role_from(tags, title, details),
            }
        )
        print(f"{index:03d}/{len(ordered_ids)} {activities[-1]['role']:<16} {title}", flush=True)
        time.sleep(0.12)

    for existing in ASSET_DIR.iterdir():
        if existing.is_file() and existing.name not in referenced_files:
            existing.unlink()

    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    DATA_FILE.write_text(json.dumps(activities, ensure_ascii=False, indent=2) + "\n")

    counts = {
        role: sum(activity["role"] == role for activity in activities)
        for role in ("Mixing Engineer", "System Engineer", "Technician", "애매함!")
    }
    print(f"Synced {len(activities)} cards, {len(referenced_files)} images: {counts}")


if __name__ == "__main__":
    main()
