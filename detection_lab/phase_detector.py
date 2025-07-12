#!/usr/bin/env python3
"""Simple phase-shift detector using regex patterns."""
from __future__ import annotations

import json
import re
from pathlib import Path
from typing import List


def load_phase_patterns() -> List[re.Pattern]:
    """Load regex patterns for phase-shift events from signal_types.json."""
    schema_path = Path(__file__).parent / "signal_types.json"
    with open(schema_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    for category in data.get("categories", []):
        if category.get("name") == "phase_shift_events":
            return [re.compile(p, re.IGNORECASE) for p in category.get("patterns", [])]
    return []


PHASE_PATTERNS = load_phase_patterns()


def is_phase_shift(text: str) -> bool:
    """Return True if any phase-shift pattern matches the text."""
    for pattern in PHASE_PATTERNS:
        if pattern.search(text):
            return True
    return False
