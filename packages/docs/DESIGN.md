# BeeNut Documentation Workbench

The documentation uses the same visible language as BeeNut Workbench v0.2. It is a technical surface for operators and developers, not a rounded marketing site.

## North star

The browser should feel like a companion workbench beside the BeeNut application: calm, compact, flat, and easy to scan while configuring or repairing a counting station.

## Tokens

- Canvas: `#F3F4F6` light, `#0F0F0F` dark.
- Surface: `#FFFFFF` light, `#18181B` dark.
- Raised surface: `#F9FAFB` light, `#27272A` dark.
- Ink: `#171717` light, `#FAFAFA` dark.
- Muted ink: `#52525B` light, `#A1A1AA` dark.
- Structural line: `#D4D4D8` light, `#3F3F46` dark.
- Roadway amber: `#F4A900` light, `#FFC23D` dark.
- Amber selection: `#FFF2CC` light, `#3A2A00` dark.
- Panel radius: 6 px. Control radius: 4 px.
- Normal layout surfaces do not cast shadows.

## Typography

Noto Sans Thai is the interface and reading family for Thai and Latin. Weight 400 is the default, 500 marks controls and local hierarchy, and 600 is reserved for the page title or one major heading. Machine values use the platform monospace stack.

Documentation prose is 15 px with a 1.75 line height. Navigation and controls use 11–12 px labels. Article headings stay sentence case and never use weights above 600.

## Shell

- The 56 px toolbar is an opaque surface with a one-pixel bottom line.
- The Home workbench is full-bleed below the toolbar and fills the remaining viewport height; it is not presented as a centered card.
- Desktop navigation is a 240 px surface rail with task-based group labels.
- Selected destinations use amber wash plus deep-amber text.
- The document is one flat surface on the canvas, with a maximum 6 px corner radius and no at-rest shadow.
- The right table of contents is quiet auxiliary navigation, not another card.
- Below 768 px, the navigation moves to a flat side sheet and the article becomes full width.

## Components

- Buttons are compact rectangles, 36 px high by default, with weight-500 labels.
- Inputs use a one-pixel outline, surface background, and visible two-pixel focus ring.
- Tables use a raised header row and structural dividers.
- Screenshots use a 6 px radius and one-pixel border in article content. The Home preview may float without a border above the branded amber, blue, violet, and coral mesh stage.
- Callouts use semantic status colors. Amber is never used for success or warning.
- Search dialogs and sheets may use elevation because they physically float above the workbench.

## Test matrix

Check English and Thai in light and dark themes at desktop and 390 px mobile widths. Body text and controls must meet WCAG AA contrast, focus must remain visible, and reduced-motion users must not depend on animation to understand state.
