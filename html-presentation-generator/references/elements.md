# Element lookup sheet

Every building block in the Deck framework, grouped by what it does.
Themes: **Helix** (light/clinical), **Blueprint** (dark/technical),
**Field Guide** (warm/instructional) — all slide decks via `deck.js` —
and **Pulse** (dark/lime scrollytelling via `scroll.js`).

## Motion & animation

| Element | Markup | Where | Effect |
|---|---|---|---|
| Fade-up reveal | `class="fragment"` | any deck slide | fades in rising slightly, one per key press |
| Pure fade | `class="fragment fade"` | any deck slide | fades in, no movement |
| Pop | `class="fragment pop"` | any deck slide | scales up from 60% while fading in |
| Fly in left | `class="fragment fly-left"` | any deck slide | slides in from the left |
| Fly in right | `class="fragment fly-right"` | any deck slide | slides in from the right |
| Slide transition | automatic | all decks | outgoing slide drifts aside, incoming fades in |
| Milestone fly-in | automatic on `.milestone` | Pulse | card + date fly in from opposite sides on scroll |
| Spine dot glow | automatic | Pulse | timeline dot nearest viewport center glows lime |
| Scroll drip hint | `.scrollhint` (Pulse hero) / `.hb-scrollhint` | Pulse, Handbook | animated dripping line pointing down |
| Glow cards | `.bp-cards > .bp-card` + mousemove script | Blueprint | radial glow follows the cursor across cards |
| Progress bar | automatic | all | thin accent bar tracks position |

All motion respects `prefers-reduced-motion` (falls back to plain fades or none).

## Shared helpers (all deck themes)

| Class | Effect |
|---|---|
| `kicker` | small uppercase label above a heading |
| `lead` | larger intro paragraph |
| `muted` | secondary grey text |
| `cols` | two-column grid, stacks on small screens |
| `<kbd>K</kbd>` | styled keyboard key |
| `<mark>` | highlighted phrase (Helix styles it softly) |

## Helix — light, clinical (concept pitches)

| Element | Markup | Effect |
|---|---|---|
| Title slide | `<section class="helix-title">` + `.doc-meta` | title layout with author/date footer line |
| Accent rule | `<hr class="rule">` | short teal line under a heading |
| Quote / statement panel | `.helix-panel` (+ `<cite>`) | white card with teal left edge |
| Fact strip | `.helix-facts` > div > `.fact-value` + `.fact-label` | row of big labelled numbers |
| Checkmark list | `<ul class="helix-check">` | list with round teal checks |
| Timeline / phases | `.helix-timeline` > div (+ `.active`) > `.phase` | horizontal phase bars, active = teal |

## Blueprint — dark grid, technical (design reviews)

| Element | Markup | Effect |
|---|---|---|
| Title slide | `<section class="bp-title">` + `.doc-meta` | gradient headline + monospace meta |
| Diagram box | `.bp-diagram` > `.bp-node` (+ `.dim`), `.bp-arrow`, `.bp-stack` | box-and-arrow architecture diagrams |
| Node label | `.bp-tag` inside a node | small monospace tag above node text |
| Numbered flow | `<ol class="bp-flow">` | steps numbered 01, 02, 03… |
| Glow cards | `.bp-cards` > `.bp-card` > `.bp-card-content` | hover-glow card grid (needs the mousemove snippet from `demo-design.html`) |
| Status chip | `.bp-chip` + `decided` / `open` / `risk` | green / amber / red pill |
| Code block | `<pre><code>` | dark bordered code panel |

## Field Guide — warm, instructional (user-guide decks)

| Element | Markup | Effect |
|---|---|---|
| Title slide | `<section class="fg-title">` + `.app-badge` | pill badge with live-dot + big title |
| Step header | `.fg-step` > `.num` + `.of` + `h2` | big numbered step ("Step 2 of 4") |
| Callout | `.fg-callout` + `tip` / `note` / `warn` / `ok` | 💡 📌 ⚠️ ✅ colored boxes |
| Screenshot frame | `.fg-screen` > `.bar` (+ `.addr`) + `<img>` or `.placeholder` | mock browser window |
| UI reference | `<span class="ui">Save</span>` | looks like a button in prose |
| Click path | `.fg-path` + `.sep` | Settings › Users › Add |
| Agenda list | `<ol class="fg-agenda">` | numbered "what you'll learn" list |

## Pulse — dark/lime scrollytelling (roadmaps)

| Element | Markup | Effect |
|---|---|---|
| Hero | `.sd-hero` > `.eyebrow`, `h1` (+ `<em>` for the lime word), `.tagline`, `.scrollhint` | full-screen opener |
| Timeline | `.sd-timeline` > `.milestone` | glowing center spine, cards alternate sides |
| Milestone card | `.card` > `h2`, `p`, `.stat`, `.shot` | dark card; `.stat` = lime metric chip; `.shot` = media slot |
| Milestone meta | `.meta` > `.when` + `.chip` | date + status on the other side of the spine |
| Status chip | `.chip` + `shipped` / `live` / `building` / `planned` | lime / green / amber / grey pill |
| End cap | `.sd-end` | centered closing section |

## Navigation (built in, no markup)

| Input | Decks (`deck.js`) | Pulse (`scroll.js`) |
|---|---|---|
| `→` `↓` `Space` | next fragment / slide | `↓` `J` next milestone |
| `←` `↑` | previous | `↑` `K` previous |
| `Home` / `End` | first / last slide | top / bottom |
| `F` | fullscreen | — |
| `?` | help overlay | — |
| swipe | next / previous | native scroll |
| URL | `#5` per slide | `#milestone-id` |
| print | one slide per page | normal page |
