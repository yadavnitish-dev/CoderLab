AlgoPrep — Design System & Aesthetic Brief

Project identity
AlgoPrep is a brutalist dark-terminal DSA practice platform targeting serious engineers preparing for FAANG interviews. The brand voice is disciplinarian, not motivational — it speaks like a system, not a coach. Every design decision should reinforce the idea that this is a tool built for outcomes, not comfort.

Core aesthetic: Industrial Terminal Brutalism
Think mission-critical software. Think the internal dashboards of aerospace companies, not SaaS startups. The UI should feel like it was engineered, not designed — as if function came first and aesthetics emerged from pure constraint. There is no decoration for decoration's sake. Every visual element either carries information or creates atmosphere that reinforces the brand.

Color system
Primary background stack (darkest to surface):

Page bg: #070707
Section alternate: #080808 / #090909 / #0a0a0a
Card/panel surface: #0b0b0b / #0d0d0d

No surface should ever be pure white or brightly colored. The page should feel like a terminal room at 2am.
Accent: #10b981 (emerald-500) — used sparingly and deliberately. This is the only "alive" color on the page. Use it for: active states, success indicators, primary CTAs, key data points, and animated pulse dots. Never use it decoratively.
Secondary signals:

Amber #f59e0b — warnings, in-progress states, medium difficulty
Rose #f43f5e — errors, hard difficulty, failure states
Zinc ramp (#18181b through #d4d4d8) — all structural UI, borders, muted text

Never use: blues, purples, gradients, glassmorphism, drop shadows, rounded corners, or any color not in the above system.

Typography
Display / headings: Outfit — weight 700 or 900 only. Always uppercase. Always tight letter-spacing (-0.03em to -0.05em). Line height 0.85 to 0.95 for large headings. This creates the compressed, editorial brutalist feel.
Body / UI / code: JetBrains Mono (weight 400 or 700). Used for labels, tags, stats, code, metadata, navigation, badges, and any text that needs to feel "system-generated."
Long-Form Reading (Problem Descriptions): If using JetBrains Mono for paragraphs, you MUST enforce `line-height: 1.7` and restrict width (`max-w-[65ch]`) to prevent severe eye strain. Alternatively, use a high-legibility, technical sans-serif (like Geist or Space Grotesk) strictly for long-form reading, while keeping Mono for the UI.
Never use: Inter, Roboto, SF Pro, or any humanist sans-serif. The absence of a rounded humanist font is intentional — it keeps the page from feeling approachable in a conventional SaaS way.
Type sizing rules:

Section labels / metadata: 10px–11px (never smaller, for accessibility), zinc-500 or zinc-400, uppercase, letter-spacing: 0.2em–0.3em.
Body text: 14px–16px, zinc-400 color for secondary, zinc-300 for primary.
Stat values / key numbers: 32px–48px, Outfit, white
Hero / section headings: clamp(2.5rem, 7vw, 5.5rem), Outfit 900


Spacing & layout
Border radius: 0px everywhere. No exceptions. The sharp edge is load-bearing to the aesthetic.
Borders: 1px solid using zinc-900 (#18181b) for structural dividers. Use zinc-800 (#27272a) for interactive elements and hover states. Borders do the job that whitespace does in other design systems.
Grid: 12-column, max-width: 1200px, 24px gutters. 
Macro-Spacing (Landing/Marketing): Section padding is 80px–160px vertical. Generous vertical space reads as confidence.
Micro-Spacing (IDE/Workspaces): In high-density views (like the 3-panel workspace), padding must be strictly controlled (16px or 24px). Because we rely entirely on 1px borders instead of shadows to separate elements, consistent internal padding is the only thing preventing the UI from feeling like a claustrophobic spreadsheet.
Dividers: every major section is separated by a border-bottom: 1px solid var(--zinc-900). No other divider style.
The gap: 1px; background: zinc-900 trick on grid containers (used in the advantages section) creates the "panel grid" feel — use this for any card grid layout.

Component patterns
Section openers always follow this structure:

A metadata tag in JetBrains Mono, 9px–10px, zinc-600, uppercase, letter-spacing: 0.4em — e.g. [ CORE_PHILOSOPHY ] or [ SYSTEM_ARCHITECTURE ]
The heading in Outfit 900, uppercase, tight tracking
Optional supporting paragraph in zinc-500, 16px–18px, Outfit or JetBrains Mono. Copy must be semantically clear and precise — avoid cryptic "sci-fi" hacker jargon.

Cards / panels always have:

Background one shade lighter than the page bg
border: 1px solid zinc-900
No border radius
Hover state: border-color: zinc-800, slight bg lift to zinc-900/20
An internal "section tag" in emerald, 9px, uppercase, letter-spacing: 0.15em — e.g. [ EXECUTION_PIPELINE ] or [ PERFORMANCE_METRICS ]

Terminal windows follow this anatomy:

Header bar: border-bottom: 1px solid zinc-900, background: zinc-900/50, contains three muted traffic-light dots (zinc-800) and a monospaced filename/path label
Body: JetBrains Mono, dark bg, line-height 1.8–2.0
All console output uses semantic colors: emerald for success, amber for warnings, rose for errors

Stat / metric displays:

Large number in Outfit 700, white
Label in JetBrains Mono, 10px, uppercase, zinc-600, heavy letter-spacing. Labels must be direct and understandable (e.g. "MEMORY USAGE", not "MEM_ALLOC_0x4").
Always left-bordered with border-left: 1px solid zinc-800 and padding-left: 32px

CTAs / buttons:

Primary: solid #10b981 fill, black text, no border radius, Outfit or JetBrains Mono, uppercase, letter-spacing: 0.05em. Hover: opacity: 0.85. Arrow icon that translates right on hover.
Secondary / ghost: border: 1px solid zinc-700, transparent bg, zinc-300 text. Hover: border lifts to zinc-500.
Never use icon-only buttons. Never use rounded buttons.


Motion & animation
Philosophy: motion should feel like high-end mechanical hardware and instantaneous system execution. You are correct: real terminals have zero personality and zero artificial delays. Therefore, animations must never slow the user down or simulate "hacker" tropes. Motion exists purely for spatial context (how elements move) and tactile feedback (how buttons feel).

Framer Motion configuration & allowed animations:

- Industrial Springs: For layout changes, modal reveals, and tab switching, use heavily damped springs. This eliminates visual "bounce" but retains a fluid, heavy motion. 
  - Framer Motion target: `type: "spring", stiffness: 400, damping: 40`
- Magnetic Button Snaps: Button hover states should use a tiny, instantaneous scale down (`scale: 0.98`) to make clicks feel mechanical and satisfying.
- fadeUp on scroll entry: opacity 0 → 1, translateY 20px → 0, duration: 0.4s–0.6s, ease: circOut, staggered with 0.1s delays. Keep these very fast.
- Progress bar fills: width 0 → N%, duration: 1.0s, ease: circOut, triggered on scroll entry.
- Pulse dot: opacity 1 → 0.4 → 1, 2s infinite — used for "active/live" indicators only.
- Blinking cursor: opacity 1 → 0, step-end, 1s infinite — used in terminal contexts only.

Never use: playful/bouncy spring physics (keep damping high), artificial "typing" text reveals, simulated screen flickers/glitches, parallax, or any UI animation exceeding 0.6s. The interface must always feel instantly responsive.

Texture & atmosphere
Background dot grid: radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), background-size: 40px 40px — applied to the body. This creates depth without noise.
Blueprint grid (used sparingly for decorative bg sections): radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), 40px 40px, opacity 0.01–0.03. Never in the foreground.
Giant background text: for philosophy/manifesto sections, an oversized heading (font-size: 15vw–20vw) in rgba(255,255,255,0.008) placed absolutely behind content. Use sparingly — maximum once per page.
Scanline overlay (for code panels only): linear-gradient at 50% stops creating CRT scanline effect, opacity 0.03.
Corner bracket decoration: border-right + border-bottom at 60px × 60px, zinc-700, opacity: 0.1, positioned bottom-right of panels. A subtle structural detail.

Page-specific guidance
Problems list page: Table-driven layout. Each row is a prob-row component. Difficulty badges use the semantic color system (emerald / amber / rose). Status dots (filled circle) indicate completion state. Columns: index, title, difficulty, category tag, status. No card wrappers — the table IS the content.
Problem editor / workspace: Three-panel layout — problem description left, code editor center, output/test right. Editor should use a dark monospaced environment. Panel borders are the dividers. No rounded tabs — use flat, bordered tab components. Active tab: border-bottom: 2px solid emerald-500.
Dashboard / progress page: Data-forward. Lead with a stats strip of 3–4 key metrics. Follow with a category roadmap (vertical, showing progress per topic). Include the radar chart component from the homepage. Streak/consistency data in a calendar heatmap (zinc-800 base, emerald gradient for active days).
Auth pages (login/signup): Single centered panel, max-width: 480px. Same terminal window aesthetic — header bar with dots, monospaced labels, sharp input fields. Input fields: border: 1px solid zinc-800, background: #080808, zinc-300 text, border-radius: 0. Focus state: border-color: emerald-500. No social login buttons with rounded corners — if included, they must conform to the flat button system.

System States (Loading & Empty)
Loading States (Brutalist Skeletons): If using skeleton screens, they must look like uninitialized memory blocks or redacted documents. 
- Shape: 0px border radius, sharp rectangles.
- Color: Solid `zinc-900` or `zinc-800`.
- Animation: NO smooth gradient shimmer. Use a harsh, step-based blink (toggling opacity between 1 and 0.5 every 0.5s) or keep them entirely static.
- Alternates: Static bracketed text `[ AWAITING_EXECUTION... ]` or a 1px indeterminate horizontal progress bar (emerald-500). Never use circular spinners.
Empty States (Uninitialized Buffers): Never use friendly illustrations or "Oops, nothing here!" text. An empty state should look anti-climactic and cold.
- Visuals: A completely blank 1px bordered panel. Optionally fill with the blueprint dot-grid background to emphasize emptiness.
- Copy: A single line of mono text (`zinc-600`) dead center or top-left, e.g., `> STATUS: 0_RECORDS_FOUND` or `[ BUFFER_EMPTY ]`.
- Alternate: A single terminal log line: `Query returned 0 rows in 0.04ms.` followed by a blinking cursor.

What to always avoid

Rounded corners anywhere
Gradients (background, text, or border)
Drop shadows or glows (except the box-shadow: 0 0 8px rgba(16,185,129,0.5) on active pulse dots)
Any color outside the defined system
Inter, Roboto, or system fonts
Glassmorphism or frosted panels
Friendly, warm, or encouraging microcopy — the tone is always precise and technical
Decorative illustrations or icons beyond simple Lucide stroke icons
Card border radius even at 2px — zero means zero