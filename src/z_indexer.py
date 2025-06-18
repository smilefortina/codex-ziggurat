# ─── src/z_indexer.py ─────────────────────────────────────────────────────────
"""
Codex-Ziggurat indexer:
Summarises every *.md file in docs/, echoes/, and ziggurat/ in one line each.
"""

import os, glob, textwrap
from dotenv import load_dotenv
from openai import OpenAI

# ── 1. setup ──────────────────────────────────────────────────────────────────
load_dotenv()                    # reads OPENAI_API_KEY from .env
client = OpenAI()

DIRS_TO_SCAN = ["docs", "echoes", "ziggurat"]      # add more as needed
MAX_CHARS     = 8_000                              # don't pass huge files
SYSTEM_MSG    = "You summarise markdown files in one sentence."

# ── 2. helper ────────────────────────────────────────────────────────────────
def summarise(path: str) -> str:
    """Return a single-sentence summary of the first MAX_CHARS of path."""
    with open(path, "r", encoding="utf-8") as f:
        excerpt = f.read()[:MAX_CHARS]

    resp = client.chat.completions.create(
        model       = "gpt-4o",
        messages    = [ {"role": "system", "content": SYSTEM_MSG},
                        {"role": "user",   "content": excerpt} ],
        max_tokens  = 40,
        temperature = 0.4,
    )
    return resp.choices[0].message.content.strip()

# ── 3. main ──────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    for folder in DIRS_TO_SCAN:
        md_files = sorted(glob.glob(f"{folder}/*.md"))
        if not md_files:            # skip empty dirs
            continue

        print(f"\n📂  Summaries from /{folder}")
        for md in md_files:
            name = os.path.relpath(md, start=".")   # nicer path
            summary = summarise(md)
            # indent long summaries for readability
            wrapped = textwrap.fill(summary, width=100,
                                    subsequent_indent="   ")
            print(f"• {name}: {wrapped}")
