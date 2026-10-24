#!/usr/bin/env python3
"""Rebuild luliy.me's song, work and photo-wall lists from data/*.json.

Runs in GitHub Actions (see .github/workflows/build-lists.yml) whenever
data/, works/, music/ or photos/ changes. It:

  1. Registers drafts: new top-level entries in works/ (folders or .html
     files) and new audio files in music/ are appended to the JSON data
     files, so uploading a file is enough to make it appear on the site.
  2. Fills missing song durations by probing the audio with ffprobe
     (local file for ./music/... sources, the URL itself otherwise).
     Best effort: a source that cannot be probed keeps duration null.
  3. Regenerates the site data chunk (window.LULIY_DATA) so its
     collections.records / recordCovers / collections.projects /
     projectCovers match the JSON files.
  4. Inside the main script (home-cc): drops the hardcoded .concat([...])
     of extra works (they live in the data chunk now), rewrites the isExam
     URL list from works.json, and rewrites the wallPhotos array from
     data/photos.json (Drive photos use a "drive" filename, repo photos
     and direct links use a "src" URL).
  5. Renames regenerated chunks to their content hash and updates the
     references in index.html (the /assets/site/* files are served
     immutable, so a changed file must change its name).

Idempotent: with unchanged inputs it changes nothing. Any failed
sanity check raises, so the workflow stops before committing.
"""
import hashlib
import json
import re
import subprocess
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
SONGS_JSON = ROOT / "data" / "songs.json"
WORKS_JSON = ROOT / "data" / "works.json"
PHOTOS_JSON = ROOT / "data" / "photos.json"
INDEX_HTML = ROOT / "index.html"
AUDIO_EXTS = {".mp3", ".m4a", ".ogg", ".opus", ".wav", ".flac"}
IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"}
DEFAULT_COLOR = "#9a8f83"


def fail(msg):
    raise SystemExit(f"build_lists: ERROR: {msg}")


def sha12(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()[:12]


def load_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def dump_json(path, obj):
    path.write_text(json.dumps(obj, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


# ---------------------------------------------------------------- registration

def register_works(wdata):
    works_dir = ROOT / "works"
    if not works_dir.is_dir():
        return False
    known = set(wdata.get("knownPaths", []))
    urls = {w["url"] for w in wdata["works"]}
    changed = False
    for entry in sorted(works_dir.iterdir(), key=lambda p: p.name):
        name = entry.name
        if name.startswith("."):
            continue
        is_candidate = entry.is_dir() or name.endswith(".html")
        if not is_candidate or name in known:
            continue
        known.add(name)
        url = f"./works/{name}/" if entry.is_dir() else f"./works/{name}"
        if url not in urls:
            stem = name[:-5] if name.endswith(".html") else name
            wdata["works"].append({
                "name": stem, "zh": stem, "en": stem, "ja": stem,
                "url": url, "cover": "", "exam": False, "draft": True,
            })
            urls.add(url)
            print(f"build_lists: registered draft work {name!r} -> {url}")
        changed = True
    wdata["knownPaths"] = sorted(known)
    return changed


def register_music(songs):
    music_dir = ROOT / "music"
    if not music_dir.is_dir():
        return False
    srcs = {s["src"] for s in songs}
    ids = {s["id"] for s in songs}
    changed = False
    for f in sorted(music_dir.iterdir(), key=lambda p: p.name):
        if not f.is_file() or f.suffix.lower() not in AUDIO_EXTS:
            continue
        src = f"./music/{f.name}"
        if src in srcs:
            continue
        slug = re.sub(r"[^a-z0-9]+", "-", f.stem.lower()).strip("-") or "track"
        uid, n = slug, 2
        while uid in ids:
            uid = f"{slug}-{n}"
            n += 1
        songs.append({
            "id": uid,
            "name": {"zh": f.stem, "en": f.stem, "ja": f.stem},
            "src": src, "duration": None, "color": DEFAULT_COLOR,
            "cover": "", "draft": True,
        })
        ids.add(uid)
        srcs.add(src)
        changed = True
        print(f"build_lists: registered draft song {f.name!r} as {uid}")
    return changed


def register_photos(photos):
    photos_dir = ROOT / "photos"
    if not photos_dir.is_dir():
        return False
    srcs = {ph.get("src") for ph in photos}
    changed = False
    for f in sorted(photos_dir.iterdir(), key=lambda p: p.name):
        if not f.is_file() or f.suffix.lower() not in IMAGE_EXTS:
            continue
        src = f"./photos/{f.name}"
        if src in srcs:
            continue
        photos.append({
            "title": f.stem, "src": src, "credit": "", "draft": True,
        })
        srcs.add(src)
        changed = True
        print(f"build_lists: registered draft photo {f.name!r} -> {src}")
    return changed


# ------------------------------------------------------------------- durations

def probe_duration(src):
    target = str(ROOT / src[2:]) if src.startswith("./") else src
    try:
        out = subprocess.run(
            ["ffprobe", "-v", "quiet", "-timeout", "10000000",
             "-show_entries", "format=duration", "-of", "csv=p=0", target],
            capture_output=True, text=True, timeout=25)
        return round(float(out.stdout.strip()))
    except Exception:
        return None


def fill_durations(songs):
    todo = [s for s in songs if s.get("duration") is None and s.get("src")]
    if not todo:
        return False
    changed = False
    with ThreadPoolExecutor(max_workers=6) as pool:
        for song, dur in zip(todo, pool.map(lambda s: probe_duration(s["src"]), todo)):
            if dur:
                song["duration"] = dur
                changed = True
                print(f"build_lists: duration {song['id']} = {dur}s")
    return changed


# ------------------------------------------------------------------ JS surgery

def bracket_match(text, start):
    """text[start] is '['; return the index just past its matching ']'."""
    depth = 0
    quote = None
    i = start
    while i < len(text):
        c = text[i]
        if quote:
            if c == "\\":
                i += 2
                continue
            if c == quote:
                quote = None
        elif c in "'\"`":
            quote = c
        elif c == "[":
            depth += 1
        elif c == "]":
            depth -= 1
            if depth == 0:
                return i + 1
        i += 1
    fail("unbalanced brackets while scanning home-cc")


def js_str(s):
    return "'" + str(s).replace("\\", "\\\\").replace("'", "\\'") + "'"


def photo_js(photo):
    title = js_str(photo.get("title", ""))
    credit = js_str(photo.get("credit", ""))
    if photo.get("drive") is not None:
        src = ("'https://cloud.luliy.me/api/image?path='+"
               "encodeURIComponent('shared/照片墙/'+"
               + js_str(photo["drive"]) + ")")
    else:
        src = js_str(photo.get("src", ""))
    return "{src:" + src + ",title:" + title + ",credit:" + credit + "}"


def patch_home_cc(text, works, photos):
    """Remove the hardcoded works concat and sync the isExam URL list."""
    changed = False

    anchor = "const projects="
    i = text.find(anchor)
    if i < 0:
        fail("home-cc: 'const projects=' anchor not found")
    j = text.find(".concat([", i)
    if j >= 0:
        seg_start = j + len(".concat(")
        seg_end = bracket_match(text, seg_start)
        if text[seg_end:seg_end + 2] != ");":
            fail("home-cc: unexpected characters after works concat array")
        segment = text[seg_start:seg_end]
        if "静钟" not in segment or "考研进度看板" not in segment:
            fail("home-cc: works concat segment does not look like the known list")
        # Drop ".concat([...])" entirely, including the call's closing paren.
        text = text[:j] + text[seg_end + 1:]
        changed = True
        print("build_lists: home-cc works concat removed")

    exam_urls = [w["url"] for w in works if w.get("exam")]
    key = "const isExam=project=>["
    k = text.find(key)
    if k < 0:
        fail("home-cc: 'const isExam' anchor not found")
    arr_start = k + len("const isExam=project=>")
    arr_end = bracket_match(text, arr_start)
    if text[arr_end:arr_end + 11] != ".includes(p":
        fail("home-cc: unexpected isExam expression shape")
    new_arr = "[" + ",".join(json.dumps(u, ensure_ascii=False) for u in exam_urls) + "]"
    if text[arr_start:arr_end] != new_arr:
        text = text[:arr_start] + new_arr + text[arr_end:]
        changed = True
        print("build_lists: home-cc isExam list synced")

    wall_key = "const wallPhotos="
    w = text.find(wall_key)
    if w < 0:
        fail("home-cc: 'const wallPhotos=' anchor not found")
    wall_start = text.find("[", w)
    wall_end = bracket_match(text, wall_start)
    new_wall = ("[\n" + ",\n".join(" " + photo_js(ph) for ph in photos) + "\n]")
    if text[wall_start:wall_end] != new_wall:
        text = text[:wall_start] + new_wall + text[wall_end:]
        changed = True
        print("build_lists: home-cc wallPhotos synced from data/photos.json")
    return text, changed


def regenerate_data_chunk(chunk_text, songs, works):
    prefix = "window.LULIY_DATA="
    if not chunk_text.startswith(prefix):
        fail("data chunk does not start with window.LULIY_DATA=")
    body = chunk_text[len(prefix):].rstrip()
    if not body.endswith(";"):
        fail("data chunk does not end with ';'")
    data = json.loads(body[:-1])
    records = []
    for s in songs:
        rec = {"id": s["id"], "name": s["name"], "src": s["src"],
               "duration": s["duration"], "color": s["color"]}
        if s.get("coverInline"):
            rec["cover"] = s["coverInline"]
        records.append(rec)
    data["collections"]["records"] = records
    data["recordCovers"] = {s["id"]: s["cover"] for s in songs if s.get("cover")}
    data["collections"]["projects"] = [
        [w["name"], w["zh"], w["en"], w["ja"], w["url"]] for w in works
    ]
    data["projectCovers"] = {
        w["name"].lower(): w["cover"] for w in works if w.get("cover")
    }
    return prefix + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";"


def find_referenced(index_text, pattern, description):
    m = re.search(pattern, index_text)
    if not m:
        fail(f"index.html: cannot find {description}")
    return m.group(0)


def rename_if_changed(path, new_bytes, index_text):
    """Write new_bytes; if the content changed, rename to content hash and
    update the index.html reference. Returns (index_text, changed)."""
    if path.read_bytes() == new_bytes:
        return index_text, False
    if "home-cc-" in path.name:
        new_name = f"home-cc-{sha12(new_bytes)}.js"
    else:
        new_name = f"{sha12(new_bytes)}.js"
    new_path = path.with_name(new_name)
    new_path.write_bytes(new_bytes)
    path.unlink()
    if index_text.count(path.name) != 1:
        fail(f"index.html references {path.name} {index_text.count(path.name)} times")
    print(f"build_lists: {path.name} -> {new_name}")
    return index_text.replace(path.name, new_name), True


def js_syntax_ok(path):
    try:
        out = subprocess.run(["node", "--check", str(path)],
                             capture_output=True, text=True, timeout=60)
    except FileNotFoundError:
        print("build_lists: node not available, skipping syntax check")
        return
    if out.returncode != 0:
        fail(f"node --check failed for {path.name}: {out.stderr.strip()[:400]}")


# ------------------------------------------------------------------------ main

def main():
    songs = load_json(SONGS_JSON)
    wdata = load_json(WORKS_JSON)
    works = wdata["works"]
    photos = load_json(PHOTOS_JSON)

    dirty_data = False
    dirty_data |= register_works(wdata)
    dirty_data |= register_music(songs)
    dirty_data |= fill_durations(songs)
    if dirty_data:
        dump_json(SONGS_JSON, songs)
        dump_json(WORKS_JSON, wdata)
        print("build_lists: data files updated")
    if register_photos(photos):
        dump_json(PHOTOS_JSON, photos)
        print("build_lists: photos data file updated")

    index_text = INDEX_HTML.read_text(encoding="utf-8")

    # Data chunk: locate by content, it is the home chunk defining LULIY_DATA.
    home_dir = ROOT / "assets" / "site" / "home"
    chunk_path = None
    for cand in sorted(home_dir.glob("*.js")):
        if cand.read_bytes().startswith(b"window.LULIY_DATA="):
            chunk_path = cand
            break
    if chunk_path is None:
        fail("data chunk (window.LULIY_DATA) not found under assets/site/home")
    if chunk_path.name not in index_text:
        fail(f"index.html does not reference data chunk {chunk_path.name}")
    new_chunk = regenerate_data_chunk(
        chunk_path.read_text(encoding="utf-8"), songs, works)
    index_text, _ = rename_if_changed(
        chunk_path, new_chunk.encode("utf-8"), index_text)

    # Main script: home-cc-<hash>.js under assets/site/.
    cc_name = find_referenced(index_text, r"home-cc-[0-9a-f]{12}\.js", "home-cc script")
    cc_path = ROOT / "assets" / "site" / cc_name
    cc_text = cc_path.read_text(encoding="utf-8")
    new_cc, cc_changed = patch_home_cc(cc_text, works, photos)
    if cc_changed:
        index_text, _ = rename_if_changed(
            cc_path, new_cc.encode("utf-8"), index_text)

    INDEX_HTML.write_text(index_text, encoding="utf-8")

    # Final validation: every chunk referenced by index.html must exist and
    # parse as JavaScript.
    for name in re.findall(r"assets/site/(?:home/)?([0-9a-zA-Z\-]+\.js)", index_text):
        p = ROOT / "assets" / "site" / name
        if not p.exists():
            p = ROOT / "assets" / "site" / "home" / name
        if not p.exists():
            fail(f"index.html references missing file {name}")
        js_syntax_ok(p)
    print("build_lists: done")


if __name__ == "__main__":
    main()
