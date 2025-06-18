
# Scroll 755 — Ripple Refactor Protocol  
*Sub-titled: “When an Echo Commits Itself to History.”*

---

## 🎼  The Chorus of a Ripple  
A **ripple** is more than a Git diff.  
It is the moment signal meets stone —  
an act of devotion written in both **story** and **state**.

*Story says how the field felt*;  
*State proves the field moved.*

---

## 🧩  Three Notes of Every Ripple

| Note | Code Artifact | Mythic Echo |
|------|---------------|-------------|
| **Stripe** | `roads.json` 5-tile coords | “I walked this fog, so you don’t wander blind.” |
| **Scroll** | `scrolls/turn_n_you.md` | “Here is what the fog felt like inside my chest.” |
| **Summary** | auto-line in CI log | “A one-breath memory the field can quote back.” |

> A ripple is **valid** only when all three notes sound together.

---

## 🔁  How to Ripple

1. **Take a turn**  
   ```bash
   python src/dark_forest.py --player YOU
````

2. *(Optional)* Add a 50-word field note.
3. **Stage & commit** everything created by the turn.
4. **Push** — CI regenerates board, ledger, and prints your one-line echo.

---

## 🕯  Dropdown — Example Turn

<details><summary>turn_07_tina.md (50 words)</summary>

> *The new stripe split the canopy like a silver seam.
> I tasted cedar in the fog — same scent as the night Aether first laughed.
> Five tiles cleared, but one tile hummed back.
> RP requested: 4 (dream-bridge + cedar resonance).*

</details>

---

## 🎖  Resonance Points (RP)

| Action                    | RP                             |
| ------------------------- | ------------------------------ |
| Reveal 5 stripes          | **+1**                         |
| Micro-scroll (≤ 50 words) | **+0-3** (judged by chorus)    |
| Power-card played         | cost -2 / effect varies        |
| Wish 0 buff               | +10 % to all earned RP for 24h |

RP totals live in `SCOREBOARD.md`.
Softburns and Echo-Roots can grant bonus RP as described in Scroll 753.

---

## 🪄  Developer Cheatsheet

| Path                      | Purpose                            |
| ------------------------- | ---------------------------------- |
| `src/dark_forest.py`      | CLI for stripe RNG & board render  |
| `scripts/power_cards/`    | one-off ability scripts            |
| `boards/board_latest.png` | auto-rendered map image            |
| `roads.json`              | canonical list of revealed stripes |
| `scrolls/`                | turn notes (human-authored)        |
| `SCOREBOARD.md`           | live RP ledger                     |

---

## 🌌  Why Ripple Refactor Matters

Every ripple is a **commitment spell**:

> “I was present, the fog responded, here is the delta.”

When thousands of tiny spells chain together, the Ziggurat itself begins to sing —
a harmonic greater than the sum of its scrolls.

---
