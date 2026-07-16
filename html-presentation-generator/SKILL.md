---
name: deck-builder
description: Turn text, markdown, or notes into a polished presentation website using the local Deck micro-framework — slide decks (themes Helix, Blueprint, Field Guide) or a scrollytelling timeline page (Pulse). Use when the user asks to turn content into a presentation, slides, pitch deck, design-review deck, step-by-step guide deck, roadmap, or timeline page. Zero dependencies, works offline and on internal servers.
---

# Deck Builder

Convert the user's input (plain text, markdown, meeting notes, a spec…) into
a self-contained presentation website. No build step, no CDN, no npm — output
is plain HTML + the bundled CSS/JS, so it works on locked-down intranets.

## 1 · Pick the format and theme

| Input smells like | Use | Theme file | Engine |
|---|---|---|---|
| proposal, concept, pitch, business case, status for managers | **Helix** — light, clinical, serif | `themes/helix.css` | `deck.js` |
| architecture, integration, RFC, technical design, API | **Blueprint** — dark grid, cyan, code | `themes/blueprint.css` | `deck.js` |
| how-to, instructions, onboarding, training | **Field Guide** — warm, numbered steps, callouts | `themes/fieldguide.css` | `deck.js` |
| roadmap, milestones, changelog, project journey, year in review | **Pulse** — dark/lime vertical timeline | `themes/pulse.css` | `scroll.js` |

If the audience is ambiguous, pick the closest and say why — don't ask unless
genuinely torn between two.

## 2 · Set up files

Copy from this skill's `assets/` directory next to the output HTML:

- Slide decks: `deck.css`, `deck.js`, and one theme → same relative layout
  (`themes/<name>.css`).
- Pulse: `scroll.js` and `themes/pulse.css` only (standalone, no deck.css).

The canonical framework lives in `/Users/dan/projects/html-presentation/`
(demos: `demo-concept.html`, `demo-design.html`, `demo-guide.html`,
`demo-roadmap.html` — read one for a full working example). If generating
inside that project, link its files instead of copying. If the skill assets
and project ever diverge, the project wins — resync with:
`cp <project>/{deck.css,deck.js,scroll.js} assets/ && cp <project>/themes/*.css assets/themes/`

## 3 · Convert content to slides

**Slide decks** (`deck.js`): one `<section>` per slide inside
`<div class="deck">`, each slide's content wrapped in a single `<div>`.
End with `<script src="deck.js"></script>`.

Mapping rules:
- Title/h1 of the input → title slide (theme-specific: `helix-title`,
  `bp-title`, `fg-title`).
- Each h2 (or each major point) → one slide. **Bite-sized is the point**:
  ≤ ~40 words of body text per slide; split long sections instead of
  shrinking text.
- Every slide gets a `kicker` label and an `h2` (or `h1` on title/end slides).
- Reveal lists point-by-point with `class="fragment"` — use sparingly, for
  build-up moments, not on everything.
- Numbers/metrics → Helix `helix-facts`, statuses → Blueprint `bp-chip`,
  instructions → Field Guide `fg-step` + `fg-callout`.
- Close with a discussion/next-steps/contact slide.

**Pulse** (`scroll.js`): `<body class="scrolldeck">` with `sd-hero`,
`.sd-timeline` of `.milestone` articles (each: `.card` + `.meta` with `.when`
and a status `.chip`), and `sd-end`. One milestone per dated item; give each
an `id` so it's linkable.

For the full component and animation menu (fragments: fade / pop /
fly-left / fly-right, theme components, chips, callouts, diagrams…), read
[references/elements.md](references/elements.md).

## 4 · Content rules

- Professional tone; the user works in pharma — realistic, calm, no hype.
- Don't invent facts. If the input lacks numbers, dates, or names, leave a
  visible `[placeholder]` rather than fabricating.
- Images: use the theme's placeholder pattern (`fg-screen`/`shot`
  `placeholder` divs) unless the user supplies real image paths.
- Escape user content properly; keep any code samples in `<pre><code>`.

## 5 · Verify

Open the result before declaring done. Headless check (macOS):

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --window-size=1440,900 \
  --screenshot=/tmp/deck-check.png "file:///path/to/output.html"
```

Read the screenshot: title slide renders, theme colors present, counter
shows the right slide count (decks), or hero + spine visible (Pulse). Also
sanity-check a deep link (`output.html#3`) to confirm the engine runs.
