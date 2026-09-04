# test — tests

Two runs, two configs:

| | unit | e2e |
| --- | --- | --- |
| files | `src/**/*.spec.ts` (next to the code) | `test/**/*.e2e-spec.ts` |
| config | `vitest.config.ts` | `vitest.config.e2e.ts` |
| command | `npm test` | `npm run test:e2e` |

`globals: true` — no need to import `describe/it/expect`.

## Rules

- **Unit tests live next to the code**, not in `test/`. `test/` holds e2e tests and shared fixtures.
- **Imports carry the `.js` extension**, same as the rest of the code (ESM).
- **Mock at the boundary, not the internals.** Swap a provider through Nest DI
  (`Test.createTestingModule(...).overrideProvider(...)`) rather than stubbing private methods.
- **e2e goes over HTTP** via `supertest` against a booted app — that is what verifies the contract,
  including guards, pipes and the error shape.
- **e2e uses its own database**, created and torn down by the test run. Never the dev database:
  the tests truncate it. The connection string comes from the test environment's `DATABASE_URL`.
- **No `sleep`** to wait for async work — await the promise or the event.
- A failing test is a bug you found. Do not weaken assertions to get a green run.

## What to cover first

Money, access control and order status transitions. The order state machine and commission
arithmetic are where a mistake costs real money, so tests ship with that code, not after it.
