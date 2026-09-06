# UI/UX & Design Guidelines: IP-SAKTI Sahayak

## 1. Design Philosophy
Bright, clinical, trustworthy — this is a legal-adjacent tool, so clarity beats decoration. Every design decision should answer: "does this make the user trust the citation more, or trust it less?"

- **Strictly light mode.** No dark mode variant needed for MVP.
- **Bento Box layout**: distinct rounded-corner cards with soft shadows, generous whitespace. Never let chat text and citation text share a visual container without a clear boundary.

## 2. Color Palette

| Role | Color | Hex | Usage |
|---|---|---|---|
| App background | Soft off-white | `#F9FAFB` | page background only |
| Card background | Pure white | `#FFFFFF` | all Bento cards |
| Primary text | Deep charcoal | `#1F2937` | body copy, legal text |
| Primary accent (trust/action) | Bright teal | `#0D9488` | primary buttons, user chat bubbles, key term highlights |
| Secondary accent (alerts/toggles) | Energetic orange | `#F97316` | jurisdiction toggle, disclaimer banner, low-confidence badge |
| Success/high confidence | Green | `#16A34A` | confidence badge = High |
| Warning/medium confidence | Amber | `#D97706` | confidence badge = Medium |
| Border/divider | Light gray | `#E5E7EB` | card borders, dividers |

## 3. Typography
- Font: Inter or similar clean sans-serif.
- Headings: semi-bold, charcoal.
- Legal citation text: use a distinct weight/size (e.g. medium, slightly smaller, monospace-adjacent) so it visually reads as "sourced fact" vs. "assistant prose."

## 4. Page-by-Page Breakdown

### 4.1 Landing / Entry
- Short one-line explainer of what the tool does + the "not legal advice" disclaimer, visible before any interaction.
- Primary CTA: "Start" → opens Formulation Classifier modal (optional — user can also skip straight to chat).

### 4.2 Formulation Classifier (Modal)
- 4–6 sequential questions, one per screen, progress indicator at top.
- Final screen: shows the classification result as a colored chip + one-line "why," with a "Change answers" link and a "Continue to chat" button.

### 4.3 Chat Interface (Main Screen)
Layout: Bento grid —
- **Header bar**: Jurisdiction Toggle (India / International) — large, impossible to miss, orange accent — plus classification chip if set.
- **Main chat column**: user bubbles (teal), assistant bubbles (white card, charcoal text).
- **Per-assistant-message components** (all inside the assistant's card, clearly separated by a divider):
  1. Answer text
  2. **Citations drawer** — collapsed by default, shows count (e.g. "2 sources"), expands to list source name + ref ID + link.
  3. **Confidence badge** — small pill, colored per section 2.
- **Persistent disclaimer banner**: thin orange-bordered strip pinned above the chat input, "This tool provides information, not legal advice."
- **Escalation button**: "Talk to an IP facilitator" — fixed position, always visible, secondary style (not competing with primary teal CTA).

### 4.4 Low-Confidence / Refusal State
- Rendered as a distinct card style (dashed border, no citation drawer) so it's visually obvious this is not a normal answer — reinforces trustworthiness rather than looking like a bug.

## 5. Component States to Design
- Chat input: default, loading (skeleton/typing indicator), error (retrieval or LLM failure).
- Citation drawer: collapsed, expanded, empty (should never render empty in practice — falls back to refusal state instead).
- Jurisdiction toggle: India active, International active — make the inactive state clearly de-emphasized (lower opacity), not just a color swap, so users never misread which mode they're in.

## 6. Accessibility
- Maintain WCAG AA contrast: charcoal-on-white and white-on-teal both pass; verify orange-on-white text meets AA (use orange for borders/backgrounds with charcoal text on top, not orange text on white).
- All interactive elements (toggle, buttons) need visible focus states — judges may test keyboard navigation.
