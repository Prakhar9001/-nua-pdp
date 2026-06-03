# DECISIONS.md

## Q1 — Image zoom on hover: CSS scale vs a loupe

The choice was between a CSS zoom (`transform: scale`) and a loupe — a second element that shows a magnified crop of wherever your cursor is.

I went with CSS scale. The reason is scope: a loupe is a non-trivial UI component. It needs to track cursor position relative to the image, calculate the magnified crop offset, and render a positioned overlay that stays within the container bounds. That's probably 80–100 lines of JavaScript for one interaction. For a period underwear PDP, where the photos are product shots on plain backgrounds, a loupe also feels like the wrong register — it's more at home on a camera or jewellery site where texture and detail matter.

CSS scale does what we actually need: it communicates to the user that there's more to see and lets them get a closer look, without requiring any JS at all. `transform: scale(1.08)` on the image inside an `overflow: hidden` container, `transition: 0.3s ease`, done. The 1.08 factor was deliberate — enough to read as interactive without the image flying out of its frame.

One thing I considered: 1.08 is subtle on desktop but on a touch device hover doesn't fire, so mobile users never see this. That's fine — on mobile they can pinch-zoom the image natively, and the tap-to-cycle thumbnail flow handles navigation. The zoom is a desktop enhancement, not a core feature.

---

## Q2 — Product details: Tabs vs Accordion

The question was whether the product details section should be tabs (all labels visible, one panel active at a time, content swaps in place) or an accordion (panels stack vertically, each expands in place).

I went with accordion. The content here — ingredients, care instructions, delivery info — is reference material. People don't browse it sequentially; they look for the one thing they want, read it, and move on. An accordion makes every section heading scannable at a glance, which is exactly the right affordance for reference content. Tabs would hide the section labels behind a horizontal strip that requires the user to already know what's there.

The implementation is a `max-height` CSS transition from `0` to a calculated height, with a chevron that rotates 180° on open. I chose `max-height` over `height: auto` because you can't transition `height: auto` in CSS — the animation would be instant. The trade-off is that `max-height` requires a generous upper bound that may leave dead space during the animation, but at our content lengths (a few lines per panel) this isn't visible. One panel open at a time; opening a new one closes the previous.

---

## Q3 — Variant state: URL params vs React Context

Where to store the selected colour and size.

The easy answer is just React Context — stick the selected variant in a context, read it anywhere, done. Honestly I almost went with that. It's simpler to build, simpler to test, and for something that's not persisted across sessions it's completely reasonable.

What changed my mind was thinking about the URL. With Context-only, if you're looking at Light Pink in size M and you copy the link and send it to someone, they land on whatever the default is. That felt wrong for a product page — the whole point of a PDP is that the URL should mean something specific. So I went with URL params as the source of truth: `?colour=Light+Pink&size=M` in the address bar, and the app reads that on mount and hydrates from it.

The tricky part wasn't the happy path, it was all the edge cases — what if the colour in the URL doesn't exist, what if the size is sold out, what if there are no params at all. I ended up writing a `resolveInitialVariant` function that handles all of that and falls back silently to the first in-stock variant rather than throwing.

One thing I nearly got wrong: I initially used `pushState` to update the URL on every swatch click, which meant the back button cycled through every colour/size selection instead of leaving the page. Switched to `replaceState` and it made much more sense — you're updating the current state, not navigating to a new one.

I'd make the same call again.

---

## What I'd change with more time

The Fake Store API call is thin. It runs in the background and returns a product ID, but that ID doesn't surface anywhere meaningful in the UI. It's there because the spec asked for it, but if you read `useProduct.ts` it's obvious the API isn't doing much real work. I'd have liked to either use the description or category fields for something real, or replace the whole thing with MSW so the network layer is actually testable.

The cart reducer originally had `REMOVE_ITEM` and `UPDATE_QTY` actions with no UI to call them. I removed them — dead code in a public API is worse than missing code, because it implies the feature is further along than it is.

Tests cover the variant selector and add-to-cart button well, but the code I'd most want under test is `useVariant` — specifically the URL hydration logic and the fallback cascade. That's where something subtle could break silently.
