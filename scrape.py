#!/usr/bin/env python3
"""Scrape queenlynch.com for rebuild salvage — same pack pattern as wilkandwilk."""
import os, re, json, hashlib, time, urllib.parse, html as htmlmod
from pathlib import Path
from html import unescape
import subprocess

BASE = "https://www.queenlynch.com"
OUT = Path("/workspace/queenlynch")
RAW = OUT / "raw"
PAGES = OUT / "pages"
ASSETS = OUT / "assets"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
PY = str(OUT / ".venv/bin/python")

for d in [RAW, PAGES] + [ASSETS / c for c in ("brand", "staff", "interiors", "exteriors", "heroes", "other")]:
    d.mkdir(parents=True, exist_ok=True)

def fetch(url, save_as=None):
    tmp = OUT / ".tmp_fetch"
    cmd = ["curl", "-sL", "--max-time", "45", "-A", UA,
           "-w", "\n__META__%{http_code}|%{url_effective}|%{size_download}",
           "-o", str(tmp), url]
    r = subprocess.run(cmd, capture_output=True, text=True)
    meta = r.stdout.strip().split("__META__")[-1] if r.stdout else "000||0"
    parts = meta.split("|")
    code = parts[0] if parts else "000"
    eff = parts[1] if len(parts) > 1 else url
    size = parts[2] if len(parts) > 2 else "0"
    data = tmp.read_bytes() if tmp.exists() else b""
    if save_as is not None:
        save_as.parent.mkdir(parents=True, exist_ok=True)
        save_as.write_bytes(data)
    return {"code": code, "url": url, "effective": eff, "size": int(size or 0), "data": data}

def slugify(path):
    p = path.strip("/").replace("/", "-") or "home"
    return re.sub(r"[^a-zA-Z0-9._-]", "-", p)[:120]

def strip_tags(html):
    html = re.sub(r"(?is)<script[^>]*>.*?</script>", " ", html)
    html = re.sub(r"(?is)<style[^>]*>.*?</style>", " ", html)
    html = re.sub(r"(?is)<!--.*?-->", " ", html)
    html = re.sub(r"(?is)<br\s*/?>", "\n", html)
    html = re.sub(r"(?is)</p>", "\n\n", html)
    html = re.sub(r"(?is)</(h[1-6]|li|tr|div)>", "\n", html)
    html = re.sub(r"(?is)<li[^>]*>", "- ", html)
    html = re.sub(r"(?is)<[^>]+>", " ", html)
    html = unescape(html)
    html = re.sub(r"[ \t]+", " ", html)
    html = re.sub(r"\n[ \t]+", "\n", html)
    html = re.sub(r"\n{3,}", "\n\n", html)
    return html.strip()

def extract_meta(html):
    title = ""
    m = re.search(r"(?is)<title[^>]*>(.*?)</title>", html)
    if m: title = strip_tags(m.group(1))
    desc = ""
    m = re.search(r'(?is)<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']*)["\']', html)
    if not m:
        m = re.search(r'(?is)<meta[^>]+content=["\']([^"\']*)["\'][^>]+name=["\']description["\']', html)
    if m: desc = unescape(m.group(1))
    og = ""
    m = re.search(r'(?is)<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']', html)
    if not m:
        m = re.search(r'(?is)<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:image["\']', html)
    if m: og = m.group(1)
    return title, desc, og

def extract_headings(html):
    heads = []
    for level in range(1, 4):
        for m in re.finditer(rf"(?is)<h{level}[^>]*>(.*?)</h{level}>", html):
            t = strip_tags(m.group(1))
            if t: heads.append((f"H{level}", t))
    return heads

def extract_paragraphs(html):
    paras = []
    for m in re.finditer(r"(?is)<p[^>]*>(.*?)</p>", html):
        t = strip_tags(m.group(1))
        t = re.sub(r"\s+", " ", t).strip()
        # skip chrome noise / tiny
        if not t or len(t) < 15: continue
        if "(()=>{" in t or "self.Astro" in t: continue
        paras.append(t)
    return paras

def abs_url(base, src):
    src = unescape(src.strip()).replace("&#38;", "&").replace("&amp;", "&")
    if not src or src.startswith("data:"): return None
    if src.startswith("//"): return "https:" + src
    return urllib.parse.urljoin(base, src)

IMG_EXT = re.compile(r"\.(?:jpe?g|png|gif|webp|svg|ico)(?:\?|$)", re.I)

def resolve_image_candidate(url):
    """Prefer full-size /_astro/ originals over /_image? resized variants."""
    if not url: return None
    parsed = urllib.parse.urlparse(url)
    if parsed.path == "/_image" or parsed.path.endswith("/_image"):
        qs = urllib.parse.parse_qs(parsed.query)
        href = qs.get("href", [None])[0]
        if href:
            href = urllib.parse.unquote(href)
            return abs_url(BASE, href)
    return url

def collect_image_urls(html, page_url):
    urls = set()
    alts = {}
    def add(u, alt=""):
        u = resolve_image_candidate(u)
        if not u: return
        # skip tracking / analytics
        if any(x in u.lower() for x in ("google-analytics", "facebook.com/tr", "doubleclick", "hotjar")):
            return
        urls.add(u)
        if alt and u not in alts:
            alts[u] = alt

    for m in re.finditer(r"(?is)<img[^>]+>", html):
        tag = m.group(0)
        alt_m = re.search(r'alt=["\']([^"\']*)["\']', tag, re.I)
        alt = unescape(alt_m.group(1)) if alt_m else ""
        for attr in ("src", "data-src", "data-lazy-src", "data-original"):
            am = re.search(rf'{attr}=["\']([^"\']+)["\']', tag, re.I)
            if am:
                u = abs_url(page_url, am.group(1))
                if u: add(u, alt)
        for attr in ("srcset", "data-srcset"):
            am = re.search(rf'{attr}=["\']([^"\']+)["\']', tag, re.I)
            if am:
                for part in am.group(1).split(","):
                    part = part.strip().split()[0] if part.strip() else ""
                    if part:
                        u = abs_url(page_url, part)
                        if u: add(u, alt)
    for m in re.finditer(r'(?is)<meta[^>]+(?:property|name)=["\'](?:og:image|twitter:image)["\'][^>]+content=["\']([^"\']+)["\']', html):
        u = abs_url(page_url, m.group(1)); add(u, "og:image")
    for m in re.finditer(r'(?is)<meta[^>]+content=["\']([^"\']+)["\'][^>]+(?:property|name)=["\'](?:og:image|twitter:image)["\']', html):
        u = abs_url(page_url, m.group(1)); add(u, "og:image")
    for m in re.finditer(r'url\(["\']?([^"\')]+)["\']?\)', html):
        if IMG_EXT.search(m.group(1)):
            u = abs_url(page_url, m.group(1)); add(u)
    for m in re.finditer(r'(?is)<a[^>]+href=["\']([^"\']+\.(?:jpe?g|png|gif|webp|svg)[^"\']*)["\']', html):
        u = abs_url(page_url, m.group(1)); add(u)
    # link rel icons
    for m in re.finditer(r'(?is)<link[^>]+href=["\']([^"\']+)["\'][^>]*>', html):
        tag = m.group(0); href = m.group(1)
        if re.search(r'rel=["\'][^"\']*(?:icon|apple-touch|mask-icon)', tag, re.I) or IMG_EXT.search(href):
            if IMG_EXT.search(href) or "icon" in href.lower() or href.endswith(".svg"):
                u = abs_url(page_url, href); add(u, "icon")
    # Astro island props with imageSrc / /_astro/ images
    for m in re.finditer(r'/_astro/[A-Za-z0-9_.-]+\.(?:webp|png|jpe?g|gif|svg)', html):
        u = abs_url(page_url, m.group(0)); add(u)
    for m in re.finditer(r'imageSrc["\']?\s*[:=]\s*\[0,\s*"([^"]+)"', html):
        u = abs_url(page_url, unescape(m.group(1)).replace("&amp;", "&")); add(u, "hero")
    return urls, alts

def categorize_image(url, alt=""):
    u = (url + " " + alt).lower()
    name = urllib.parse.urlparse(url).path.lower()
    if any(x in name for x in ("logo", "favicon", "apple-touch", "mstile", "safari-pinned", "icon")) or "logo" in alt.lower() or name.endswith("drpq8qhl.svg") or "c-frhd3m" in name:
        if "medicus" in alt.lower() or "2bn0kpv" in name:
            return "other"
        if any(x in name for x in ("favicon", "apple-touch", "mstile", "safari-pinned", "icon-")) or name.endswith(".ico"):
            return "brand"
        if "logo" in alt.lower() or "drpq8qhl" in name or "c-frhd3m" in name:
            return "brand"
        return "brand"
    if "team" in alt.lower() or "staff" in alt.lower() or "pharmacist" in alt.lower() or "dpsz9mdv" in name:
        return "staff"  # hero shows team per alt
    if any(x in alt.lower() for x in ("office", "visit our", "location", "interior")) or "a1txdqs5" in name:
        return "interiors"
    if any(x in alt.lower() for x in ("why choose", "pharmacy services", "services")) or "byuvcogb" in name or "bee0h5jc" in name:
        return "interiors"
    if "hero" in alt.lower() or "banner" in alt.lower():
        return "heroes"
    if name.endswith(".svg") and any(x in alt.lower() for x in ("palliative", "diabetes", "naturopathic", "medicus")):
        return "other"
    return "other"

def get_image_dims(path):
    try:
        r = subprocess.run([PY, "-c",
            "from PIL import Image; im=Image.open(%r); print(f'{im.size[0]}x{im.size[1]}')" % str(path)],
            capture_output=True, text=True, timeout=15)
        if r.returncode == 0 and r.stdout.strip():
            return r.stdout.strip()
    except Exception:
        pass
    return "?"

def suggested_use(category, alt, fname):
    if category == "brand":
        if "favicon" in fname or "apple" in fname or fname.endswith(".ico"):
            return "Favicon / PWA icon"
        if fname.endswith(".svg") and "drpq" in fname.lower():
            return "Primary logo (header)"
        if "c-frhd3m" in fname.lower() or "og" in alt.lower():
            return "OG share image / brand mark"
        return "Brand / logo asset"
    if category == "staff":
        return "Hero / team photo (alt: Queen Lynch Pharmacy Team)"
    if category == "interiors":
        if "why" in alt.lower(): return "Why Us section photo"
        if "service" in alt.lower(): return "Core Services section photo"
        if "visit" in alt.lower(): return "Come visit us / location section photo"
        return "Interior / pharmacy photo"
    if category == "heroes":
        return "Homepage hero"
    if "palliative" in alt.lower(): return "Specialized service icon — Palliative"
    if "diabetes" in alt.lower(): return "Specialized service icon — Diabetes"
    if "naturopathic" in alt.lower(): return "Specialized service icon — Naturopathic"
    if "medicus" in alt.lower(): return "Partner logo — Medicus Alliance"
    return "Supporting graphic / blog / misc"

downloaded = {}  # url -> manifest entry
blockers = []

def download_image(url, category, alt=""):
    if url in downloaded:
        return downloaded[url]
    # only host-local or known CDNs we care about
    parsed = urllib.parse.urlparse(url)
    if parsed.netloc and "queenlynch.com" not in parsed.netloc and not parsed.netloc.startswith("localhost"):
        # skip external except we might want nothing
        if "queenlynch" not in parsed.netloc:
            return None
    path = parsed.path
    fname = os.path.basename(path) or "image.bin"
    fname = re.sub(r"[^a-zA-Z0-9._-]", "_", fname)
    if not fname or fname == ".":
        fname = hashlib.md5(url.encode()).hexdigest()[:12] + ".bin"
    dest_dir = ASSETS / category
    dest = dest_dir / fname
    if dest.exists() and dest.stat().st_size > 0:
        # already have
        pass
    else:
        # conflict rename
        n = 2
        stem, ext = dest.stem, dest.suffix
        while dest.exists() and url not in downloaded:
            # if existing file same size skip rename loop carefully
            dest = dest_dir / f"{stem}-{n}{ext}"
            n += 1
            if n > 20: break
        r = fetch(url, save_as=dest)
        if r["code"] not in ("200", "304") or r["size"] < 50:
            if dest.exists() and dest.stat().st_size < 50:
                dest.unlink(missing_ok=True)
            return None
        # skip tiny non-logo
        if r["size"] < 2048 and category not in ("brand",) and not fname.endswith(".svg"):
            # keep logos/svgs even if small; drop tracking pixels
            if "icon" in fname.lower() or "pixel" in fname.lower():
                dest.unlink(missing_ok=True)
                return None
    if not dest.exists():
        return None
    size = dest.stat().st_size
    dims = get_image_dims(dest)
    entry = {
        "path": str(dest.relative_to(OUT)),
        "dims": dims,
        "bytes": size,
        "source_url": url,
        "category": category,
        "alt": alt,
        "suggested_use": suggested_use(category, alt, fname),
    }
    downloaded[url] = entry
    return entry

def discover_urls():
    urls = set()
    # sitemap
    sm = fetch(f"{BASE}/sitemap-index.xml")
    sm0 = fetch(f"{BASE}/sitemap-0.xml", save_as=RAW / "sitemap-0.xml")
    for data in (sm["data"], sm0["data"]):
        try:
            text = data.decode("utf-8", errors="replace")
        except Exception:
            continue
        for loc in re.findall(r"<loc>([^<]+)</loc>", text):
            if "queenlynch.com" in loc:
                urls.add(loc.rstrip("/") + ("/" if loc.rstrip("/").endswith("blog") or loc.count("/") <= 3 and not loc.rstrip("/").split("/")[-1] else ""))
                # normalize
                urls.add(loc if loc.endswith("/") or loc.count("/") == 3 else loc)
    # normalize carefully — collect path forms
    paths = set()
    for u in list(urls):
        p = urllib.parse.urlparse(u).path or "/"
        paths.add(p)
    # seed known
    seeds = ["/", "/blog/", "/blog"]
    for s in seeds:
        paths.add(s)
    # crawl home + blog for links
    to_fetch = [f"{BASE}{p if p.startswith('/') else '/' + p}" for p in paths]
    seen_pages = set()
    queue = list(to_fetch)
    all_page_results = {}
    while queue:
        url = queue.pop(0)
        # normalize
        parsed = urllib.parse.urlparse(url)
        path = parsed.path or "/"
        key = path.rstrip("/") or "/"
        if key in seen_pages: continue
        seen_pages.add(key)
        slug = slugify(key)
        save = RAW / f"{slug}.html"
        r = fetch(url if url.endswith("/") or key == "/" or "." in path.split("/")[-1] else url + ("/" if not path.endswith("/") else ""), save_as=save)
        # also try without trailing slash if 404
        if r["code"] == "404" and url.endswith("/"):
            r2 = fetch(url.rstrip("/"), save_as=save)
            if r2["code"] == "200":
                r = r2
        elif r["code"] == "404":
            r2 = fetch(url + "/", save_as=save)
            if r2["code"] == "200":
                r = r2
        all_page_results[key] = r
        if r["code"] != "200":
            continue
        html = r["data"].decode("utf-8", errors="replace")
        for href in re.findall(r'href=["\']([^"\']+)["\']', html):
            href = href.strip()
            if href.startswith("mailto:") or href.startswith("tel:") or href.startswith("#"): continue
            full = abs_url(BASE, href)
            if not full: continue
            pu = urllib.parse.urlparse(full)
            if "queenlynch.com" not in pu.netloc and pu.netloc not in ("", "localhost", "www.queenlynch.com"):
                continue
            # only same host paths that look like pages
            p = pu.path or "/"
            if p.startswith("/_astro") or p.startswith("/_image") or re.search(r"\.(css|js|png|jpg|jpeg|webp|svg|ico|xml|webmanifest|json)$", p, re.I):
                continue
            nk = p.rstrip("/") or "/"
            if nk not in seen_pages and (nk == "/" or nk.startswith("/blog")):
                queue.append(f"{BASE}{p}")
    return all_page_results

# --- Hero / header / form island copy (client-only React) ---
HERO_COPY = {
    "eyebrow": "Our Pharmacists prescribe for minor ailments to support your everyday health.",
    "h1": "Committed to Your Care",
    "paras": [
        "Experiencing a common health issue? Get convenient care for many minor ailments without needing a doctor's appointment.",
        "Visit QLP today! Our highly trained Pharmacists are ready to help with the conditions listed below.",
    ],
    "cta": "View List of Minor Ailments",
    "ailments": [
        "Allergic rhinitis",
        "Candidal stomatitis (oral thrush)",
        "Conjunctivitis (bacterial, allergic and viral)",
        "Dermatitis (atopic, eczema, allergic and contact)",
        "Dysmenorrhea",
        "Gastroesophageal reflux disease (GERD)",
        "Hemorrhoids",
        "Herpes labialis (cold sores)",
        "Impetigo",
        "Insect bites and urticaria (hives)",
        "Tick bites, post-exposure prophylaxis to prevent Lyme disease",
        "Musculoskeletal sprains and strains",
        "Urinary tract infections (uncomplicated)",
    ],
    "image_alt": "Queen Lynch Pharmacy Team",
    "image_src": "/_astro/DPsZ9mdv.webp",
}
NAV = [("Home", "/"), ("Blog", "/blog")]
FORM_COPY = {
    "heading": "How Can We Help?",
    "sub": "Need Some Help?",
    "call_label": "Call us Today",
    "email_label": "Send Us an Email",
    "visit_label": "Visit Us",
    "visit_city": "Brampton",
    "fields": [
        ("What is your Name?", "Your Name"),
        ("What is your Email?", "email@youremail.com"),
        ("What is your Phone Number?", "(123) 456-7890"),
        ("Do you have any message for us?", "Let us know how we can help..."),
    ],
}

KNOWN_EXTRA_IMAGES = [
    (f"{BASE}/_astro/DRpQ8qHl.svg", "brand", "Queen Lynch logo"),
    (f"{BASE}/_astro/DPsZ9mdv.webp", "staff", "Queen Lynch Pharmacy Team"),
    (f"{BASE}/_astro/C-frhD3M.png", "brand", "og:image"),
    (f"{BASE}/_astro/ByUvCogb.webp", "interiors", "Why choose our pharmacy"),
    (f"{BASE}/_astro/BeE0h5JC.webp", "interiors", "Pharmacy services"),
    (f"{BASE}/_astro/a1TxdQS5.webp", "interiors", "Visit our office"),
    (f"{BASE}/_astro/gGGUoLT9.svg", "other", "Palliative Medication"),
    (f"{BASE}/_astro/nQsm-tOa.svg", "other", "Diabetes Education"),
    (f"{BASE}/_astro/KHdV2Du5.svg", "other", "Naturopathic Therapy"),
    (f"{BASE}/_astro/2bN0kpv_.svg", "other", "Medicus Alliance Icon"),
]

def write_page_md(slug, path, title, desc, headings, paras, status, extra_md=""):
    lines = [
        f"# {title or slug}",
        "",
        f"- **URL:** `{BASE}{path}`",
        f"- **Status:** {status}",
    ]
    if desc:
        lines += ["", f"**Meta description:** {desc}"]
    if headings:
        lines += ["", "## Headings", ""]
        for lvl, t in headings:
            lines.append(f"- **{lvl}:** {t}")
    if paras:
        lines += ["", "## Body copy", ""]
        for p in paras:
            lines.append(p)
            lines.append("")
    if extra_md:
        lines += ["", extra_md]
    PAGES.joinpath(f"{slug}.md").write_text("\n".join(lines).rstrip() + "\n")

def main():
    print("Discovering & fetching pages...")
    page_results = discover_urls()

    # Ensure blog posts from sitemap + blog listing are all attempted
    extra_blog_ids = set()
    for key, r in list(page_results.items()):
        if r.get("data"):
            html = r["data"].decode("utf-8", errors="replace")
            for m in re.findall(r"/blog/([A-Za-z0-9_-]+)", html):
                extra_blog_ids.add(m)
    sm_text = (RAW / "sitemap-0.xml").read_text(errors="replace") if (RAW / "sitemap-0.xml").exists() else ""
    for m in re.findall(r"/blog/([A-Za-z0-9_-]+)/?", sm_text):
        extra_blog_ids.add(m)
    for bid in sorted(extra_blog_ids):
        key = f"/blog/{bid}"
        if key not in page_results and f"/blog/{bid}/" not in page_results:
            r = fetch(f"{BASE}/blog/{bid}/", save_as=RAW / f"blog-{bid}.html")
            if r["code"] == "404":
                r = fetch(f"{BASE}/blog/{bid}", save_as=RAW / f"blog-{bid}.html")
            page_results[key] = r

    inventory = []
    all_image_candidates = []  # (url, alt, page)

    # Seed known images
    for url, cat, alt in KNOWN_EXTRA_IMAGES:
        all_image_candidates.append((url, alt, "/"))

    for key, r in sorted(page_results.items()):
        path = key if key.startswith("/") else "/" + key
        status = r["code"]
        html = r["data"].decode("utf-8", errors="replace") if r.get("data") else ""
        title, desc, og = extract_meta(html) if html else ("", "", "")
        slug = slugify(path)
        # rename raw if needed
        raw_path = RAW / f"{slug}.html"
        if html and not raw_path.exists():
            raw_path.write_bytes(r["data"])

        headings = extract_headings(html) if html and status == "200" else []
        paras = extract_paragraphs(html) if html and status == "200" else []

        extra = ""
        if path in ("/", "") and status == "200":
            # inject client-only hero + form copy
            extra_lines = [
                "## Hero (client-rendered React island — salvaged from MainHero JS)",
                "",
                f"**Eyebrow:** {HERO_COPY['eyebrow']}",
                f"**H1:** {HERO_COPY['h1']}",
                "",
            ]
            for p in HERO_COPY["paras"]:
                extra_lines.append(p)
                extra_lines.append("")
            extra_lines.append(f"**CTA:** {HERO_COPY['cta']}")
            extra_lines.append("")
            extra_lines.append("### Minor ailments list")
            extra_lines.append("")
            for a in HERO_COPY["ailments"]:
                extra_lines.append(f"- {a}")
            extra_lines += [
                "",
                "## Contact form (client-rendered — FormComponent JS)",
                "",
                f"**Heading:** {FORM_COPY['heading']}",
                f"**Sub:** {FORM_COPY['sub']}",
                "",
                "Fields:",
            ]
            for label, ph in FORM_COPY["fields"]:
                extra_lines.append(f"- {label} — placeholder: `{ph}`")
            extra = "\n".join(extra_lines)

        if status == "200":
            write_page_md(slug, path if path != "" else "/", title, desc, headings, paras, status, extra)
            imgs, alts = collect_image_urls(html, BASE + (path if path != "/" else "/"))
            for u in imgs:
                all_image_candidates.append((u, alts.get(u, ""), path))
        else:
            # still note 404s
            write_page_md(slug, path, title or f"(HTTP {status})", desc, [], [], status,
                          f"_Page returned HTTP {status}. Linked from site but missing from deploy / CMS._")
            blockers.append(f"{path} → HTTP {status}")

        inventory.append({
            "path": path if path != "" else "/",
            "title": title,
            "status": status,
            "slug": slug,
            "copy_file": f"pages/{slug}.md",
        })

    print(f"Pages fetched: {len(inventory)}; downloading images...")

    # Download images
    for url, alt, page in all_image_candidates:
        cat = categorize_image(url, alt)
        # refine staff vs heroes for team hero
        if "dpsz9mdv" in url.lower():
            cat = "staff"  # also used as hero — keep staff; note in use
        download_image(url, cat, alt)

    # Also grab favicon set explicitly (brand)
    for icon in [
        "/favicon.ico", "/favicon.svg", "/favicon-16x16.png", "/favicon-32x32.png",
        "/favicon-48x48.png", "/apple-touch-icon.png", "/apple-touch-icon-180x180.png",
        "/apple-touch-icon-1024x1024.png", "/safari-pinned-tab.svg",
    ]:
        download_image(f"{BASE}{icon}", "brand", "favicon/icon")

    # NAP extraction
    phones = set()
    emails = set()
    for r in page_results.values():
        if not r.get("data"): continue
        t = r["data"].decode("utf-8", errors="replace")
        for m in re.findall(r'tel:([0-9+.-]+)', t):
            phones.add(m)
        for m in re.findall(r'mailto:([^"\'?\s]+)', t):
            emails.add(m.strip())

    # Build deliverables
    # SITE-MAP.md
    sm_lines = [
        "# Site map — Queen Lynch Pharmacy",
        "",
        f"Canonical host: `{BASE}`",
        "",
        "Redirects:",
        "- `https://queenlynch.com` → `https://www.queenlynch.com/` (302)",
        "- `http://` variants follow same apex→www pattern (HTTPS enforced by host)",
        "",
        "## Tech stack (rebuild context — salvage only; do not migrate platform cruft)",
        "- **Astro v5.18.0** static site (`<meta name=\"generator\" content=\"Astro v5.18.0\">`)",
        "- React islands via `astro-island` (HeaderComponent, MainHero/PharmacyHero, FormComponent, topnav, GoogleMap)",
        "- Tailwind-style utility classes; Lenis smooth scroll; Lucide icons",
        "- Image pipeline: Astro `/_image?href=...` optimizer over `/_astro/*.webp` originals",
        "- Analytics: Plausible-compatible via `analytics.aes-studio.com` (data-domain=queenlynch.com)",
        "- Maps: Google Maps embed + Mapbox GL CSS referenced; reCAPTCHA on forms",
        "- External OTC ordering partner: [Health Snap](https://www.healthsnap.ca)",
        "- Partner phone: Medicus Alliance `tel:9054945888`",
        "- Note: canonical link incorrectly points at `https://localhost/` in HTML (build misconfig)",
        "",
        "## Navigation hierarchy (header)",
        "",
        "Observed top-level (from HeaderComponent JS — client-only island): **Home · Blog**",
        "",
        "- **Home** → `/`",
        "- **Blog** → `/blog`",
        "",
        "### Utility / chrome",
        "- Top marquee banner → latest blog post (currently broken ID `mfx1yhx_6` → 404)",
        "- Phone → `tel:9054503500`",
        "- Email → `mailto:queenlynchpharmacy@gmail.com`",
        "- Hours strip: Mon-Fri 9am-6pm | Sat 9am-12pm",
        "- Logo → `/` (asset `/_astro/DRpQ8qHl.svg`)",
        "- CTA: Order over the counter → `https://www.healthsnap.ca`",
        "",
        "## Footer",
        "- Location / Opening Hours / Contact Us blocks",
        "- Medicus Alliance partner call link",
        "- © 2025 Queen Lynch Pharmacy. All Rights Reserved.",
        "",
        "## Full URL inventory",
        "",
        "| Path | Title | Status | Copy file |",
        "|------|-------|--------|-----------|",
    ]
    for inv in sorted(inventory, key=lambda x: x["path"]):
        sm_lines.append(f"| `{inv['path']}` | {inv['title'] or '—'} | {inv['status']} | `{inv['copy_file']}` |")
    sm_lines += [
        "",
        "## Homepage section structure (single-page marketing site)",
        "1. TopNav marquee (latest blog)",
        "2. Utility bar (phone / email / hours)",
        "3. Header (logo + Home/Blog)",
        "4. Hero — minor ailments prescribing (React)",
        "5. WHY US + photo",
        "6. CORE SERVICES + photo",
        "7. Specialized Services (3 cards + Health Snap CTA)",
        "8. Come visit us + photo + map + hours + contact",
        "9. Contact form island (React)",
        "10. Footer",
        "",
    ]
    (OUT / "SITE-MAP.md").write_text("\n".join(sm_lines))

    # CONTACTS-NAP.md
    nap = [
        "# Contacts / NAP — Queen Lynch Pharmacy",
        "",
        "## Business",
        "- **Name:** Queen Lynch Pharmacy",
        "- **Owner (from meta):** Carolyn Khan",
        "",
        "## Address",
        "- 157 Queen St E,",
        "- Brampton, ON L6W 3X4",
        "- Google Maps embed present on homepage",
        "",
        "## Phone",
        "- **Primary:** (905) 450-3500 (`tel:9054503500`)",
        "- **Partner — Medicus Alliance:** (905) 494-5888 (`tel:9054945888`)",
        "",
        "## Email",
        "- queenlynchpharmacy@gmail.com (note: trailing space in some `mailto:` hrefs on live site)",
        "",
        "## Hours",
        "- Monday – Friday: 9am–6pm",
        "- Saturday: 9am–12pm",
        "- Sunday: Closed",
        "- Utility bar shorthand: `Mon-Fri: 9am-6pm | Sat: 9am-12pm`",
        "",
        "## Social / external",
        "- No Facebook / Instagram / LinkedIn links found in HTML or header JS",
        "- OTC ordering: https://www.healthsnap.ca",
        "- Partner: Medicus Alliance (phone only on site)",
        "",
        "## Form contact channels (FormComponent)",
        "- Call us Today — +1 (905) 450 3500",
        "- Send Us an Email — queenlynchpharmacy@gmail.com",
        "- Visit Us — Brampton",
        "",
    ]
    (OUT / "CONTACTS-NAP.md").write_text("\n".join(nap))

    # ASSETS-MANIFEST.md
    man = [
        "# Assets manifest — Queen Lynch Pharmacy",
        "",
        f"Downloaded **{len(downloaded)}** image/icon assets into `assets/`.",
        "",
        "| Path | Dims | Bytes | Category | Suggested use | Source URL | Alt |",
        "|------|------|------:|----------|---------------|------------|-----|",
    ]
    for e in sorted(downloaded.values(), key=lambda x: (x["category"], x["path"])):
        alt = (e.get("alt") or "").replace("|", "/")
        man.append(f"| `{e['path']}` | {e['dims']} | {e['bytes']} | {e['category']} | {e['suggested_use']} | {e['source_url']} | {alt} |")
    man += [
        "",
        "## Notes",
        "- Preferred full `/_astro/*.webp|png|svg` originals over `/_image?w=...` derivatives.",
        "- Hero team photo (`DPsZ9mdv.webp`) is client-only in MainHero island; categorized under `staff/` (also serves as hero).",
        "- No dedicated exterior storefront photo found; location section uses interior-style photo `a1TxdQS5.webp`.",
        "- Service card SVGs are illustrative icons, not photography.",
        "",
    ]
    (OUT / "ASSETS-MANIFEST.md").write_text("\n".join(man))

    # COPY.md aggregate
    copy_lines = [
        "# Copy deck — Queen Lynch Pharmacy",
        "",
        "Clean extracted copy for rebuild. Chrome (nav/footer chrome) stripped where possible; hero/form islands included from JS salvage.",
        "",
        "---",
        "",
    ]
    # home first
    home_md = PAGES / "home.md"
    if home_md.exists():
        copy_lines.append(home_md.read_text())
        copy_lines.append("\n---\n")
    for p in sorted(PAGES.glob("*.md")):
        if p.name == "home.md": continue
        copy_lines.append(p.read_text())
        copy_lines.append("\n---\n")
    (OUT / "COPY.md").write_text("\n".join(copy_lines))

    # counts
    counts = {c: len(list((ASSETS / c).glob("*"))) for c in ("brand", "staff", "interiors", "exteriors", "heroes", "other")}
    ok_pages = [i for i in inventory if i["status"] == "200"]
    bad_pages = [i for i in inventory if i["status"] != "200"]

    summary = {
        "site": BASE,
        "scraped_at": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
        "pages_md": len(list(PAGES.glob("*.md"))),
        "raw_html": len(list(RAW.glob("*.html"))),
        "images": len(downloaded),
        "counts": counts,
        "pages_200": len(ok_pages),
        "pages_non_200": len(bad_pages),
        "phones": ["(905) 450-3500", "(905) 494-5888"],
        "email": "queenlynchpharmacy@gmail.com",
        "address": "157 Queen St E, Brampton, ON L6W 3X4",
        "hours": "Mon-Fri 9am-6pm; Sat 9am-12pm; Sun Closed",
        "owner": "Carolyn Khan",
        "blockers": blockers + [
            "sitemap.xml 404 (use sitemap-index.xml → sitemap-0.xml)",
            "HTML canonical points to https://localhost/ (misconfig)",
            "No social links found",
            "No exterior storefront photos found",
            "Top banner + some blog cards link to posts that 404",
            "Hero/header/form content is client-only React — salvaged from JS bundles",
        ],
        "tech": "Astro 5.18 + React islands; AES Studio Plausible analytics",
    }
    (OUT / "scrape-summary.json").write_text(json.dumps(summary, indent=2))

    # FINAL-REPORT.md
    fr = [
        "# Final report — Queen Lynch Pharmacy scrape",
        "",
        f"**Canonical:** {BASE}",
        f"**Scraped (box local America/Toronto):** {time.strftime('%Y-%m-%d %H:%M %Z')}",
        "",
        "## Counts",
        f"- Public pages HTTP 200: **{len(ok_pages)}**",
        f"- Linked/sitemap URLs non-200: **{len(bad_pages)}**",
        f"- Page markdown files: **{summary['pages_md']}**",
        f"- Raw HTML snapshots: **{summary['raw_html']}**",
        f"- Images downloaded: **{summary['images']}**",
        f"- Asset breakdown: {json.dumps(counts)}",
        "",
        "## NAP summary",
        f"- Address: {summary['address']}",
        f"- Phone: {', '.join(summary['phones'])}",
        f"- Email: {summary['email']}",
        f"- Hours: {summary['hours']}",
        f"- Owner (meta): {summary['owner']}",
        "",
        "## What the site is",
        "Small Astro marketing site for a Brampton pharmacy: one homepage (services, minor-ailments prescribing, location, contact form) plus a blog index and posts. Navigation is only Home + Blog.",
        "",
        "## Blockers / gaps",
    ]
    for b in summary["blockers"]:
        fr.append(f"- {b}")
    fr += [
        "",
        "## Rebuild notes",
        "- Salvage copy + photos only; rebuild on a clean stack (do not port Astro island/React cruft or localhost canonical).",
        "- Fix broken blog IDs or remove banner until posts exist.",
        "- Trim trailing space in mailto hrefs.",
        "- Add real social links if the business uses them.",
        "- Consider a dedicated exterior/storefront photo shoot — none on current site.",
        "",
        "## Pack layout",
        "```",
        "queenlynch/",
        "  README.md",
        "  SITE-MAP.md",
        "  COPY.md",
        "  CONTACTS-NAP.md",
        "  ASSETS-MANIFEST.md",
        "  FINAL-REPORT.md",
        "  scrape-summary.json",
        "  scrape.py",
        "  pages/*.md",
        "  raw/*.html (+ JS/CSS snapshots)",
        "  assets/{brand,staff,interiors,exteriors,heroes,other}/",
        "```",
        "",
    ]
    (OUT / "FINAL-REPORT.md").write_text("\n".join(fr))

    # README.md
    readme = [
        "# Queen Lynch Pharmacy — website salvage pack",
        "",
        "Scraped from [https://www.queenlynch.com](https://www.queenlynch.com) for a clean rebuild handoff.",
        "",
        "## Quick facts",
        f"- **Address:** 157 Queen St E, Brampton, ON L6W 3X4",
        f"- **Phone:** (905) 450-3500",
        f"- **Email:** queenlynchpharmacy@gmail.com",
        f"- **Hours:** Mon–Fri 9am–6pm · Sat 9am–12pm · Sun Closed",
        f"- **Owner (meta):** Carolyn Khan",
        "",
        "## What's in this pack",
        "| File / folder | Purpose |",
        "|---------------|---------|",
        "| `SITE-MAP.md` | URL inventory + nav hierarchy + tech notes |",
        "| `COPY.md` + `pages/` | Clean per-page copy |",
        "| `CONTACTS-NAP.md` | Phone, email, address, hours, partners |",
        "| `ASSETS-MANIFEST.md` | Every downloaded image with dims/bytes/use |",
        "| `assets/` | brand / staff / interiors / heroes / other |",
        "| `raw/` | HTML (+ key JS/CSS) snapshots |",
        "| `FINAL-REPORT.md` / `scrape-summary.json` | Counts, blockers, summary |",
        "| `scrape.py` | Reproducible scraper |",
        "",
        "## Scope note",
        "Live site is essentially **Home + Blog**. Most pharmacy “section” content lives on the homepage. Hero, header, and contact form are React islands — copy was salvaged from JS bundles.",
        "",
        "## Do not",
        "- Do not treat this as a platform migration of the Astro/AES build.",
        "- Parent agent handles CopyFromBox to Mac Desktop — this pack stays on the box under `/workspace/queenlynch/`.",
        "",
    ]
    (OUT / "README.md").write_text("\n".join(readme))

    print("DONE", json.dumps({k: summary[k] for k in ("pages_md", "images", "pages_200", "pages_non_200", "counts")}, indent=2))
    print("Blockers:", len(summary["blockers"]))

if __name__ == "__main__":
    main()
