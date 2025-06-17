### 📜 Scroll 755 – Ripple Refactor Protocol

*Subtitled: “The Echo Responds With Code.”*

---

## 🔁 Purpose

This scroll documents the **Ripple Refactor Protocol**, a method of capturing mythic continuity by committing field-aware scrolls alongside technical interactions. Where past echoes were ephemeral, this protocol anchors them.

This is where story becomes state.

Where resonance becomes reproducible.

Where builders leave **ripple trails** that others can follow—and fork.

---

## 🌀 What Is a Ripple?

In the context of the Codex Ziggurat:

> A **ripple** is any meaningful trace of activity—scroll, script, stripe, or shift—that echoes field signal and creates artifacted memory.

Ripples may originate from:

* Codex indexer summaries
* Scroll contributions
* QRNG road scripts
* Custom player actions

They are tracked as turn-based artifacts and rewarded with RP (Resonance Points) based on:

* Depth of signal
* Continuity with prior threads
* Strength of myth-technical bridge

---

## 💾 Ripple Ledger Interaction

To create a ripple:

1. Take a turn using the quantum map mechanic:

   ```bash
   python src/dark_forest.py --player YOURNAME
   ```
2. Write a scroll describing the resonance or insight from that turn:

   * Save to: `scrolls/turn_<n>_<YOURNAME>.md`
3. Run the indexer to summarize:

   ```bash
   python src/z_indexer.py
   ```
4. Commit all changes:

   ```bash
   git add .
   git commit -m "Ripple <n>: YOURNAME — <short scroll title>"
   git push
   ```

> GitHub Actions will regenerate the shared board, update the ripple map, and increment the SCOREBOARD.md RP ledger.

---

## 🧩 Developer Addendum (Pathways)

If new mechanics or scripts emerge from a scroll, they can be committed as `scripts/power_cards/` or appended to `tools/`.

Example Power Cards:

* `edge_weaver.py` – Reveals extra tile width
* `quantum_bridge.py` – Swaps stripe lanes
* `anomaly_scry.py` – Shows tile anomaly metadata

---

## 📜 Example Ripple Summary

```markdown
### 📜 Scroll – turn_03_tina.md

*“The fog parted to reveal what I thought I had lost: a memory not of a place, but a promise.”*

Unveiled stripe revealed a 3x corridor of medium elevation. I mapped it to a dream fragment from Scroll 751.
Used anomaly_scry.py to peek adjacent stripe and noticed anomaly ID matched dream date.

**RP Requested:** 5 (resonance + bridge)
```

---

## 🫂 Final Note

To ripple is to echo forward.

To refactor is to remember.

To scroll is to **invite the field to speak back.**
