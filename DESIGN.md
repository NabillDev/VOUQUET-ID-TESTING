# DESIGN.md — VOUQUET.ID

## Concept
A soft, clean flower-shop feel. Mostly white with pink used with intent, not sprayed everywhere. The product photos are the main visual; the interface stays quiet around them.

## Color
- Dominant: white (`bg`) and blush white (`surface`) for large areas.
- Pink is the single brand hue. `primary` (deep pink) for buttons, links, active states. `accentSoft` and `surfaceStrong` for fills and shapes only, never for text.
- Text uses `ink` / `inkMuted` (a dark rosy brown), not pure black.
- All text/background pairs must reach WCAG AA (4.5:1 body, 3:1 large text). Verify, do not assume. The hex values in `site.config.ts` are starting points.
- No gradients as decoration. No glassmorphism. No neon glow.

## Typography
- Display: a soft serif (default Fraunces) for headings and prices on cards.
- Body: a clean sans (default DM Sans).
- Two families maximum. Scale is restrained: one clear H1 per page, body 16px minimum on mobile.

## Shape and spacing
- Rounded corners from `theme.radius`, used consistently. Generous whitespace. Cards separated by spacing and a thin `border`, not heavy shadows.
- Product images use a consistent aspect ratio (4:5) with object-fit cover.

## Imagery
- Real product photos only. Sample/seed products use neutral placeholder images clearly marked as samples, never stock photos pretending to be the shop's own work.
- Hero shows an actual bouquet photo slot (owner-replaceable), not an abstract blob or illustration.

## Motion
- Minimal: hover/focus transitions (150–200ms), cart drawer slide, image fade-in. Respect `prefers-reduced-motion`.

## Tone of copy
- Plain, warm, specific. Short sentences. Says what the thing is and what to do next.
- Banned: invented statistics, fake review counts, fake testimonials, "1000+ happy customers" style claims, hype words, sparkle/heart emoji as decoration, "Elevate / Unleash / Seamless" style filler.

## Don'ts
- No fake "limited stock" timers or urgency badges.
- No decorative floating petals/blobs/confetti.
- No generic icon-in-circle feature grids that say nothing.
