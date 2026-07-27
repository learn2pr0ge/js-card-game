# 🔍 Weekly Code Audit Report

## 📊 Summary
| Category | Count | Priority |
|----------|-------|----------|
| TODO/FIXME/HACK items | 3 | Review needed |
| Code quality issues | 5 | Refactor |
| Potential bugs | 4 | Fix ASAP |
| Best practice violations | 2 | Improve |

---

## 📝 TODO/FIXME/HACK Comments

### [FILE-001] `index.js:11`
- **Type**: FIX (unresolved)
- **Comment**: `// FIX`
- **Context**: Above `createGameState` function in the main game loop module
- **Suggested action**: Either complete the fix or add a descriptive comment explaining what needs fixing

### [FILE-002] `index.js:21`
- **Type**: HACK
- **Comment**: `// HACK`
- **Context**: Before `random(cards)` call in `gameLoop` function — marks the random card selection as a workaround
- **Suggested action**: Replace with a proper card draw mechanism with deck depletion

### [FILE-003] `src/jokerCard.js:8`
- **Type**: HACK
- **Comment**: `// HACK`
- **Context**: Joker card stores `null` as its data payload: `cons(type, cons(name, null))`
- **Suggested action**: Use a sentinel value or proper Joker-specific data structure instead of `null`

---

## 🐛 Potential Bugs

### [BUG-001] Null dereference in method dispatch
- **File**: `src/card.js:45-46`
- **Type**: Null access
- **Description**: `registry.getMethod(card, 'getName')` can return `null` (line 16), but the result is immediately invoked with `(card)` without a null guard. If a card type is not registered, this throws `TypeError: null is not a function`.
- **Impact**: Runtime crash when an unregistered card type is used
- **Fix**: Add null check: `const fn = registry.getMethod(card, 'getName'); return fn ? fn(card) : null;`

### [BUG-002] Incomplete termination condition in game loop
- **File**: `index.js:18-19`
- **Type**: Logic error
- **Description**: `gameLoop` only checks `if (health1 <= 0)` but does not check `health2 <= 0`. Since players swap roles each recursive call, this works by accident but is fragile — if health2 reaches 0 first, the loop continues one extra iteration with swapped names.
- **Impact**: Incorrect game state, extra battle log entry after game should end
- **Fix**: Add check: `if (health1 <= 0 || health2 <= 0)` or restructure to check both players

### [BUG-003] Stack overflow risk from unbounded recursion
- **File**: `index.js:17-32`
- **Type**: Infinite recursion
- **Description**: `gameLoop` is a recursive function with no maximum iteration limit. If both players have high health and low-damage cards, this can exceed the call stack limit.
- **Impact**: `RangeError: Maximum call stack size exceeded`
- **Fix**: Convert to iterative approach using a `while` loop, or add a max-turns guard

### [BUG-004] Unused variable with stale state
- **File**: `index.js:28`
- **Type**: Dead code / potential logic error
- **Description**: `const state = createGameState(name1, health1, name2, health2)` is created but never used — only passed to `appendToLog`. The state reflects pre-damage health values, not the updated `newHealth`.
- **Impact**: Game state logged is stale/incorrect; misleading battle log
- **Fix**: Either remove `state` if not needed, or pass `newHealth` to reflect actual state

---

## 🧹 Code Quality Issues

### [QUAL-001] Duplicated card deck creation
- **File**: `play.js:9-14` and `test/test.js:9-14`
- **Issue**: Identical `createCardDeck`/`createTestDeck` functions with same 4 cards
- **Recommendation**: Extract to a shared `src/deck.js` module and import in both files

### [QUAL-002] Duplicated test utilities
- **File**: `tests/jokerDistribution.test.js:9-28` and `tests/cardDistribution2000.test.js:9-28`
- **Issue**: `CARD_NAMES`, `createCardPool()`, and `createDeckWithJoker()` are duplicated verbatim
- **Recommendation**: Move to `tests/helpers.js` or `tests/fixtures.js`

### [QUAL-003] Magic numbers throughout codebase
- **File**: Multiple files
- **Issue**: Hardcoded values without explanation:
  - `100` (deck size, percentage divisor) in `tests/jokerDistribution.test.js:43`, `tests/cardDistribution2000.test.js:74`, `src/percentCard.js:13`
  - `50`, `40`, `3` (card damage values) in `play.js`, `test/test.js`, both test files
  - `1000`, `2000` (draw counts) in test files
- **Recommendation**: Define as named constants: `const DECK_SIZE = 100;`, `const PERCENT_DIVISOR = 100;`

### [QUAL-004] Missing JSDoc on all exported functions
- **File**: All source files (`src/*.js`, `index.js`)
- **Issue**: No JSDoc annotations on any exported function (`getName`, `damage`, `defineMethod`, `make`, `run`, etc.)
- **Recommendation**: Add JSDoc blocks with `@param`, `@returns`, and descriptions

### [QUAL-005] Inconsistent data structure representation
- **File**: `src/simpleCard.js:9`, `src/percentCard.js:9`, `src/jokerCard.js:9`
- **Issue**: All card types use `cons(type, cons(name, data))` creating nested pairs, but `jokerCard` uses `null` for data while others use numbers. No type safety or validation.
- **Recommendation**: Create a unified card factory with validation, or use objects with a consistent schema

---

## ✅ Best Practice Violations

### [BP-001] Side effects in module scope
- **File**: `play.js:18-21`
- **Violation**: Module executes game logic and `console.log` at import time (top-level execution)
- **Recommendation**: Wrap in a `main()` function and use `if (process.argv[1] === fileURLToPath(import.meta.url))` guard

### [BP-002] Console.log in test assertions
- **File**: `test/test.js:21`
- **Violation**: `console.log(toString(reverse(log)))` in a test is a side effect, not an assertion. The test only checks `expect(log).toBeDefined()` which is trivially true.
- **Recommendation**: Remove `console.log` and add meaningful assertions about log content

---

## 🎯 Top 3 Priority Actions

1. **[`src/card.js:45`](src/card.js#L45)** — Null dereference will crash the game if an unregistered card type is used; this is the most likely runtime failure
2. **[`index.js:17-32`](index.js#L17)** — Unbounded recursion can cause stack overflow in longer games; convert to iterative loop
3. **[`index.js:28`](index.js#L28)** — Unused `state` variable indicates either dead code or a logic bug where stale health is logged

---

## 📈 Trends

- New TODOs since last audit: 0 (first audit)
- Resolved items: 0
- Total technical debt items: 14

---

*Generated by automated code audit on 2026-07-27*
