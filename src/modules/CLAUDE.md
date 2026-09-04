# src/modules — domain modules

Every directory here is a self-contained domain. All of them are currently empty (`.gitkeep`) —
this is a map of intended boundaries, not existing code. Drop that sentence once the first module
has real code in it.

## Anatomy of a module

```
listings/
  listings.module.ts        # @Module, exports the service(s) only
  listings.controller.ts    # HTTP: routes, guards, DTOs. No logic.
  listings.service.ts       # domain business logic
  listings.repository.ts    # Prisma access (optional, when queries are non-trivial)
  dto/
    create-listing.dto.ts   # input: class-validator
    listing.response.dto.ts # output: only fields safe to expose
  listings.service.spec.ts  # unit tests next to the code
```

Files are named `kebab-case.<role>.ts`, classes `PascalCase`, the directory is a plural noun.

## Rules

- **Thin controllers.** A controller parses the request, calls the service, maps to a response
  DTO. No Prisma queries and no business `if`s in a controller.
- **Prisma models never leave the module.** Return response DTOs instead. Otherwise the first
  migration breaks the API contract and fields like `passwordHash` leak.
- **Cross-domain access goes through the service.** `OrdersService` asks `ListingsService`;
  it does not read the `listing` table itself. Fix a cycle between two modules with an event or
  a third module, not with a reflexive `forwardRef`.
- **Export the minimum** — usually a single service. Repositories and internal helpers stay private.
- Every new module is wired into `src/app.module.ts` with an explicit import.

## Planned domains

| Module | Responsibility |
| --- | --- |
| `auth` | sign-up, sign-in, JWT + refresh, password reset, sessions |
| `users` | profile, addresses, settings, blocks, seller rating |
| `catalog` | reference data: categories, brands, sizes, condition, colors |
| `listings` | listings: draft → published → sold/withdrawn, moderation |
| `media` | listing photo upload and processing, storage |
| `search` | listing search and filtering, sorting, facets |
| `orders` | the deal: reservation, statuses, cancellation, disputes |
| `payments` | payments and seller payouts, commission, refunds |
| `shipping` | delivery: rates, labels, tracking |
| `chat` | buyer↔seller conversation about a listing |
| `reviews` | reviews and ratings after a completed deal |
| `notifications` | email / push / in-app notifications |

This set and these boundaries may change once the product questions in `docs/product.md` are
answered. If you change a boundary, update this table and `docs/architecture.md`.
