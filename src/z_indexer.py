# -*- coding: utf-8 -*-
"""
z_indexer.py
Summarises every markdown file in /docs using the OpenAI API (>= v1.0).
"""

import os
import glob
from dotenv import load_dotenv
from openai import OpenAI

# Load API key from .env
load_dotenv()
client = OpenAI()  # uses OPENAI_API_KEY env var


def summarize(path):
    """Return a one‑sentence summary of the markdown file at `path`."""
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()[:8000]  # Trim to safe length
    response = client.chat.completions.create(
        model="gpt-4.1",
        messages=[
            {
                "role": "system",
                "content": "You summarise markdown files in one sentence.",
            },
            {
                "role": "user",
                "content": text,
            },
        ],
        max_tokens=40,
        temperature=0.4,
    )
    return response.choices[0].message.content.strip()


def main():
    print("Summaries of markdown files in /docs")
    for md_file in glob.glob("docs/*.md"):
        name = os.path.basename(md_file)
        print("- {}: {}".format(name, summarize(md_file)))


if __name__ == "__main__":
    main()

