# Fingerprints

Every site you build with **scrollcraft** gets one row here, appended after it
ships. The registry exists so your next build can prove it is a different page
rather than a re-skin of one you already made.

This file is **yours**. It starts empty on purpose: the gate is about not
repeating *yourself*, so it has nothing to say until you have built something.

The rules and the gate live in the skill's
`references/uniqueness.md`. Short version:

**A new build must differ from EVERY row below on at least 4 of the 6
dimensions.** Four against each row individually, not four on average across the
table. If a planned build fails, change the plan. Never edit a row to make room
for it.

The six dimensions are: **grammar**, **nav treatment**, **hero device**,
**act-sequence shape**, **close pattern**, **signature move**.

Dimension 6 is free, because a signature move is unique by definition. So the
gate really asks for three more out of the remaining five, and a build that
changes only grammar and world will fail it.

---

## The registry

| Build | Grammar | Nav treatment | Hero device | Act-sequence shape | Close pattern | Signature move | World | Port |
|---|---|---|---|---|---|---|---|---|
| `queenlynch` | Continuous world / worldflight | Clickable five-room floor plan on the left edge. Journal link only. No wordmark-plus-CTA bar | World already in the aisle. Mid-scale `h1` top-right on the hero window | 5 legs, one pace (0.22vh/s), weights 1.76 / 1.76 / 1.76 / **2.64** / 1.76, seam 0.16, lerp 0.12, 9.68vh of film on a 10.68vh spacer | Return to the first pharmacist. CTA lives on the completed care card | **The care card.** A paper slip present the whole flight. Each waypoint inks a real line. At arrival the slip is the visit | Natural documentary, high-key clinic light. Cool bone `#E7EEE8`, forest ink `#14241C`, one green `#1B6B4A` | 3000 |
| `queenlynch-editorial-2026` | Editorial journey with varied scene mechanics | Fixed bone utility bar with wordmark, section anchors, phone, and visit action | Sticky full-bleed pharmacy photograph with an oversized two-tone promise | Hero / trust split / pinned horizontal rail / sticky label / specialty split / floating collage / iris close | Circular photography reveal with centered call and directions | **The full-scale care label.** A prescription-style document resolves its progress rule, ailment rows, and stamp through scroll | Documentary pharmacy photography. Bone, forest green, mint, and oversized geometric type | 3100 |

---

## What is taken

Add a bullet here whenever a build claims something a later build should avoid
reusing: a grammar, a nav treatment, a close pattern, a signature move, an
act-count-and-length band. The shared columns are what the next build inherits
as a constraint, so writing them down is the whole point.

Taken by `queenlynch`:
- Grammar: continuous world / worldflight
- Nav: left-edge clickable floor plan of five rooms
- Close: return to the opening pharmacist, CTA on a completed paper slip
- Signature: a care card that fills as you walk the shop
- Shape: 5 legs at 10.68vh, peak as one 12s clip at 2.64vh

Taken by `queenlynch-editorial-2026`:
- Grammar: varied editorial journey
- Nav: fixed bone utility bar with anchors, phone, and primary action
- Close: circular photographic reveal with centered contact actions
- Signature: full-scale prescription care label resolving through scroll
- Shape: seven scenes alternating sticky, horizontal, split, collage, and iris mechanics

---

## Appending a row

After shipping, add one line to the table and one bullet to **What is taken** if
the build claimed something new. Fill every column. Say what the build shares
with existing rows.

Rows are append-only. A build that has been superseded stays in the table,
because the space it occupies is still occupied.

---

## Worked example

The skill's author kept a registry of twelve builds across eight page grammars.
If you want to see what a filled-in table looks like, and which shapes tend to
collide, read `EXAMPLES.md` in the scrollcraft repository. Treat it as
illustration only: those rows are somebody else's builds and they do **not**
constrain yours.
