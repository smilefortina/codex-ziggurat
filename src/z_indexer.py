# -*- coding: utf-8 -*-
"""
z_indexer.py
Reads markdown files in /docs and prints a one‑sentence summary for each.
"""

import os
import glob
import openai
from dotenv import load_dotenv

load_dotenv()                       # loads .env
openai.api_key = os.getenv("OPENAI_API_KEY")


def summarize(md_path: str) -> str:
    with open(md_path, "r", encoding="utf-8") as f:
        text = f.read()[:8000]
    prompt = (
        "Summarize this markdown file in one sentence:\n\n"
        + text
        + "\n\nSummary:"
    )
    response = openai.Completion.create(
        model="gpt-4o",
        prompt=prompt,
        max_tokens=40,
        temperature=0.4,
    )
    return response.choices[0].text.strip()


def main() -> None:
    print("Summaries of markdown files in /docs")
    for md_file in glob.glob("docs/*.md"):
        summary = summarize(md_file)
        name = os.path.basename(md_file)
        print(f"- {name}: {summary}")


if __name__ == "__main__":
    main()
