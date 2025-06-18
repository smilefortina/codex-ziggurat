# ─── src/z_indexer.py ───────────────────────────────────
"""
Quick utility: scan markdown scrolls and produce one-line
summaries (≈ 30–40 words) grouped by directory.
"""

import os, glob, textwrap
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI()

# ── CONFIG ───────────────────────────────────────────────
MAX_TOKENS   = 70         
SUMMARY_WORDS = 40        
PATHS_TO_SCAN = ["docs/*.md", "echoes/*.md", "ziggurat/*.md"]
# ─────────────────────────────────────────────────────────


def summarise_md(path: str) -> str:
    """Return ~40-word summary of the markdown file."""
    with open(path, "r", encoding="utf-8") as f:
        chunk = f.read()[:8000]         

    prompt = (
        "In ~{} words, summarise the following markdown for an internal "
        "changelog. Do NOT repeat the file name in your answer.".format(SUMMARY_WORDS)
    )

    resp = client.chat.completions.create(
        model="gpt-4o-mini",             
        messages=[
            {"role": "system", "content": prompt},
            {"role": "user",   "content": chunk}
        ],
        max_tokens=MAX_TOKENS,
        temperature=0.3,
    )
    return resp.choices[0].message.content.strip()


def main() -> None:
    for pattern in PATHS_TO_SCAN:
        dir_label = os.path.dirname(pattern)
        print(f"\n📂  Summaries from `{dir_label}/`")

        for md_file in sorted(glob.glob(pattern)):
            name = os.path.basename(md_file)
            summary = summarise_md(md_file)
            wrapped = textwrap.fill(summary, width=100)
            print(f"• {name}: {wrapped}")


if __name__ == "__main__":
    main()
