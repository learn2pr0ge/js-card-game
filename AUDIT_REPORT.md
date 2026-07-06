---

# 🔍 Weekly Code Audit Report

## 📊 Summary
| Category | Count | Priority |
|----------|-------|----------|
| TODO/FIXME/HACK items | 3 | Review needed |
| Code quality issues | 4 | Refactor |
| Potential bugs | 5 | Fix ASAP |
| Best practice violations | 2 | Improve |

---

## 📝 TODO/FIXME/HACK Comments

### [FILE-001] `index.js:11`
- **Type**: FIX
- **Comment**: `// FIX`
- **Context**: Above `createGameState` function in the battle game loop
- **Suggested action**: Replace with descriptive comment explaining what is broken or remove if already fixed. A bare `// FIX` provides no actionable information.

### [FILE-002] `index.js:21`
- **Type**: HACK
- **Comment**: `// HACK`
- **Context**: Before `const card = random(cards);` in the `gameLoop` function
- **Suggested action**: Document why this is a hack. If `random()` from `@hexlet/pairs-data` has known issues or non-deterministic behavior, add a proper comment or JSDoc explaining the workaround.

### [FILE-003] `src/jokerCard.js:8`
- **Type**: HACK
- **Comment**: `// HACK`
- **Context**: Above `export const make = (name) => cons(type, cons(name, null));`
- **Suggested action**: Explain why `null` is used as the terminator instead of `l()` (empty list). If this is intentional for the pairs-data structure, document it. Consider using `l()` for consistency with other card types.

---

## 🐛 Potential Bugs

### [BUG-001] Unprotected recursive game loop — stack overflow risk
- **File**: `index.js:17-32`
- **Type**: Infinite recursion / Stack overflow
- **Description**: `gameLoop` uses unbounded recursion with no tail call optimization guarantee. JavaScript engines do not guarantee proper tail calls. For a game with `INITIAL_HEALTH = 10` and minimum damage of 1, this can recurse 10+ deep per player death cycle. If damage ever resolves to 0 (edge case), the loop is truly infinite.
- **Impact**: `RangeError: Maximum call stack size exceeded` during gameplay
- **Fix**: Convert to iterative loop using `while` or use a trampoline pattern:
```js
const gameLoop = (health1, name1, health2, name2, log, cards) => {
  let state = { health1, name1, health2, name2, log };
  while (state.health1 > 0) {
    // ... game logic
    state = { health1: newHealth, name1: name2, health2: state.health1, name2: state.name1, log: newLog };
  }
  return cons(`${state.name1} был убит`, state.log);
};
```

### [BUG-002] Null return from registry not guarded — TypeError on missing method
- **File**: `src/card.js:45-46`
- **Type**: Null access
- **Description**: `registry.getMethod(card, 'getName')(card)` — if `getMethod` returns `null` (line 16, when type not found in registry), calling `null(card)` throws `TypeError: null is not a function`.
- **Impact**: Runtime crash when a card type has not registered its methods
- **Fix**:
```js
export const getName = (card) => {
  const fn = registry.getMethod(card, 'getName');
  if (!fn) throw new Error(`Method getName not registered for type ${getType(card)}`);
  return fn(card);
};
```

### [BUG-003] SimpleCard damage ignores health parameter
- **File**: `src/simpleCard.js:15`
- **Type**: Incorrect behavior / API inconsistency
- **Description**: `defmethod('damage', getDamage)` registers `getDamage` as the damage handler, but `getDamage` returns `cdr(cdr(card))` — the fixed damage value. It ignores the `health` parameter that `percentCard.calculateDamage` uses. The `damage` function signature in `card.js:46` is `(card, health)`, but `getDamage` only takes `(card)`.
- **Impact**: SimpleCard deals fixed damage regardless of target health, which may be intentional but is inconsistent with the damage API contract
- **Fix**: Either rename the method to `fixedDamage` or make `getDamage` accept and document the unused parameter: `const getDamage = (card, _health) => cdr(cdr(card));`

### [BUG-004] Game state created but never used — dead code
- **File**: `index.js:28`
- **Type**: Dead code / Logic error
- **Description**: `const state = createGameState(name1, health1, name2, health2);` creates a state with **old** health values (not `newHealth`), then `state` is passed to `appendToLog` but the resulting log is used in recursion with parameter-based health tracking. The state object serves no functional purpose.
- **Impact**: Confusing code, potential future bugs if someone assumes state is authoritative
- **Fix**: Either remove `createGameState` and `appendToLog` entirely, or refactor to use state as the single source of truth.

### [BUG-005] Flaky test assertions — probabilistic bounds
- **File**: `tests/jokerDistribution.test.js:62`, `tests/cardDistribution2000.test.js:95`
- **Type**: Flaky test
- **Description**: `expect(jokerCount).toBeLessThan(100)` with 1000 draws and 1/100 joker probability. Using binomial distribution B(1000, 0.01), P(X >= 100) ≈ 0, but P(X >= 20) ≈ 0.003. The bound of 100 is so loose it is meaningless; a tighter statistical bound or confidence interval should be used.
- **Impact**: Test could theoretically fail (extremely unlikely but non-zero), and the assertion does not meaningfully validate distribution
- **Fix**: Use statistical testing: `expect(jokerCount).toBeGreaterThan(5); expect(jokerCount).toBeLessThan(25);` or use a chi-squared test.

---

## 🧹 Code Quality Issues

### [QUAL-001] Duplicated code between test files
- **File**: `tests/cardDistribution2000.test.js` and `tests/jokerDistribution.test.js`
- **Issue**: `CARD_NAMES`, `createCardPool()`, and `createDeckWithJoker()` are **identical** in both files (lines 9-28)
- **Recommendation**: Extract shared constants and helpers into `tests/helpers.js` or `tests/fixtures.js`

### [QUAL-002] Duplicated deck creation between play.js and test/test.js
- **File**: `play.js:9-14` and `test/test.js:9-14`
- **Issue**: `createCardDeck()` and `createTestDeck()` are identical — same 4 cards in same order
- **Recommendation**: Export `createCardDeck` from a shared module and import in both files

### [QUAL-003] Magic number `100` in percentage calculation
- **File**: `src/percentCard.js:13`
- **Issue**: `Math.round(health * (getPercent(card) / 100))` — the `100` is implicit percentage base
- **Recommendation**: Extract to constant: `const PERCENT_BASE = 100;` for clarity

### [QUAL-004] Missing JSDoc on all exported functions
- **File**: All `src/*.js` files and `index.js`
- **Issue**: No JSDoc comments on any exported function (`make`, `getName`, `damage`, `defineMethod`, default export)
- **Recommendation**: Add JSDoc with `@param`, `@returns`, and description for all exports

---

## ✅ Best Practice Violations

### [BP-001] console.log in production code (play.js)
- **File**: `play.js:16`
- **Violation**: `printLog` uses `console.log` directly. While `no-console` is disabled in eslint, mixing I/O with game logic violates separation of concerns.
- **Recommendation**: Accept a logger/writer function as parameter: `const printLog = (log, writer = console.log) => writer(toString(reverse(log)));`

### [BP-002] console.log inside test assertion
- **File**: `test/test.js:21`
- **Violation**: `console.log(toString(reverse(log)))` inside a test that only checks `expect(log).toBeDefined()`. The log output is side-effect noise and the assertion is too weak.
- **Recommendation**: Remove `console.log` and add meaningful assertions: `expect(log).not.toBeNull(); expect(log.length).toBeGreaterThan(0);`

---

## 🎯 Top 3 Priority Actions

1. **`index.js:17-32`** — Convert recursive `gameLoop` to iterative. This is a guaranteed crash in production for long games and the highest-severity bug.
2. **`src/card.js:45-46`** — Add null guard before calling registry method result. A missing method registration causes an unhandled TypeError with no useful error message.
3. **`index.js:11`** — Resolve the bare `// FIX` comment. Either fix whatever is broken or document what needs fixing. Unactionable markers are technical debt.

---

## 📈 Trends

- New TODOs since last audit: N/A (first audit)
- Resolved items: N/A
- Total technical debt items: 14

---

## 🔧 Additional Findings

### npm Audit
- **2 moderate severity vulnerabilities** in `documentation` → `vue-template-compiler` (XSS risk, dev dependency only)

### ESLint
- **0 errors** — codebase passes all lint rules

### Test Coverage
- **3 tests passing** — but assertions are minimal (mostly `toBeDefined` / range checks)
