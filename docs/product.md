# Product

## In one line

A C2C marketplace for second-hand clothing in Serbia — Vinted-like: someone lists an item,
someone else buys it, the platform brings them together and carries the deal.

## Settled

- Market: **Serbia**. Settlement currency **RSD**, users' timezone `Europe/Belgrade`.
- Buyer and seller are **the same user account**, not separate ones. A moderator/admin role
  exists separately.
- Core flow: listing → buyer interest → deal → delivery → review.

## Open questions

Do not guess the answers — they change the data model and the module boundaries. Ask the product
owner, record the answer here, and write an ADR if the decision is architectural.

1. **Monetization.** Commission per deal with built-in payments (the platform holds funds until
   confirmation), or a listings-only board where buyer and seller settle off-platform?
   → decides whether `payments`, escrow and payouts exist at all, and whether the project falls
   under payment regulation.
2. **Shipping.** Integration with Serbian carriers (Post Express, BEX, D Express, AKS) with label
   generation and tracking, or private arrangement and pickup for now?
   → decides the `shipping` module and the order status set.
3. **Languages.** Which comes first: `sr-Latn`, `sr-Cyrl`, `en`? Do reference tables (categories,
   brands) need translations from day one?
   → decides the i18n design in `catalog` and the API response shape.
4. **Mobile app.** Is a native client planned?
   → decides API requirements: refresh tokens, versioning, push notifications.
5. **Identity and payouts.** Is seller KYC required, and how does money reach the seller
   (card, bank transfer, a local PSP)?
6. **Moderation.** Pre-moderation of listings or post-moderation on reports? Which categories
   are prohibited?

## Deliberately out of scope for now

Until the questions above are answered, no code appears for payments, escrow, carrier integrations
or KYC. The directories exist as a plan, not as a commitment to a date.
