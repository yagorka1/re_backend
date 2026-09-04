/**
 * Conventional Commits: `type(scope)?: subject`.
 *
 * Types come from @commitlint/config-conventional:
 * build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test.
 * Scope is free-form — no fixed list to keep in sync with `src/modules/`.
 *
 * Examples:
 *   feat(auth): add refresh token rotation
 *   fix(orders): do not reserve a listing twice
 *   docs: answer the shipping question in product.md
 */
export default {
  extends: ['@commitlint/config-conventional'],
};
