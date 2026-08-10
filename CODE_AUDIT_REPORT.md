# 🔍 Weekly Code Audit Report

## 📊 Summary
| Category | Count | Priority |
|----------|-------|----------|
| TODO/FIXME/HACK items | 3 | Review needed |
| Code quality issues | 10 | Refactor |
| Potential bugs | 5 | Fix ASAP |
| Best practice violations | 10 | Improve |

---

## 📝 TODO/FIXME/HACK Comments

### [FILE-001] `index.js:11`
- **Type**: FIX
- **Comment**: `// FIX`
- **Context**: Game state creation function, left as a marker for unresolved issue
- **Suggested action**: Resolve the underlying issue or add a descriptive comment explaining what needs fixing

### [FILE-002] `index.js:21`
- **Type**: HACK
- **Comment**: `// HACK`
- **Context**: Random card selection in game loop without explanation
- **Suggested action**: Add documentation explaining why this is a workaround, or refactor to remove the hack

### [FILE-003] `src/jokerCard.js:8`
- **Type**: HACK
- **Comment**: `// HACK`
- **Context**: Joker card stores `null` as data field instead of a meaningful value
- **Suggested action**: Use a sentinel value or restructure the card data model to avoid null

---

## 🐛 Potential Bugs

### [BUG-001] Game loop dead-player attack window
- **File**: `index.js:18-31`
- **Type**: Logic bug / delayed death detection
- **Description**: `gameLoop` only checks `health1 <= 0` at entry. Arguments are swapped each recursive call (`newHealth, name2, health1, name1`), meaning player2 death is detected one turn late. A "dead" player can still attack for one extra iteration.
- **Impact**: Incorrect game outcome — dead player deals damage post-mortem
- **Fix**: Check both players health before each turn, or restructure to detect death immediately after damage is applied

### [BUG-002] Null dereference in card method calls
- **File**: `src/card.js:45-46`
- **Type**: Null access
- **Description**: `getName` and `damage` call `registry.getMethod(card, "methodName")(...)` with no null check. If a card type has no registered method, `getMethod` returns `null`, causing `TypeError: null is not a function`
- **Impact**: Runtime crash with unhelpful error message when encountering unregistered card types
- **Fix**: Add null guard: `const method = registry.getMethod(card, "getName"); if (!method) throw new Error(...); return method(card);`

### [BUG-003] CI/CD uses EOL Node.js version
- **File**: `.github/workflows/release.yml:16`
- **Type**: Outdated dependency
- **Description**: `node-version: "15.x"` — Node.js 15 has been EOL since June 2021. Also uses `actions/checkout@v2` and `actions/setup-node@v1` (current versions are v4)
- **Impact**: CI workflow will fail on modern GitHub runners; security vulnerabilities from outdated runtime
- **Fix**: Update to `node-version: "22.x"`, `actions/checkout@v4`, `actions/setup-node@v4`

### [BUG-004] Suppressed Node.js warnings
- **File**: `.npmrc:1`
- **Type**: Hidden runtime issues
- **Description**: `--no-warnings` flag suppresses all Node.js warnings, potentially hiding deprecation notices and runtime issues
- **Impact**: Critical warnings (e.g., MaxListenersExceeded, deprecation notices) are silently ignored
- **Fix**: Remove `--no-warnings` or selectively suppress only known-safe warnings

### [BUG-005] JokerCard null data causes NaN in arithmetic
- **File**: `src/jokerCard.js:9`
- **Type**: Type mismatch
- **Description**: `cons(type, cons(name, null))` stores `null` as data. If any code assumes this field is a number (like `simpleCard`/`percentCard` patterns using `cdr(cdr(card))`), arithmetic operations produce `NaN`
- **Impact**: Silent corruption of damage calculations if Joker is processed by wrong handler
- **Fix**: Use `0` or a sentinel value instead of `null`, or add type guards before arithmetic

---

## 🧹 Code Quality Issues

### [QUAL-001] Duplicated test code across test files
- **File**: `tests/jokerDistribution.test.js:9-28` and `tests/cardDistribution2000.test.js:9-28`
- **Issue**: `CARD_NAMES` constant, `createCardPool()`, and `createDeckWithJoker()` are **identical** in both test files
- **Recommendation**: Extract to a shared `tests/helpers.js` or `tests/fixtures.js` module

### [QUAL-002] Unused game state in game loop
- **File**: `index.js:12-13, 28`
- **Issue**: `createGameState` creates a state that is passed to `appendToLog` but never read or used for actual game logic — dead code
- **Recommendation**: Either use the state for meaningful game logic or remove the function entirely

### [QUAL-003] Magic number `100` in percent calculation
- **File**: `src/percentCard.js:13`
- **Issue**: `Math.round(health * (getPercent(card) / 100))` — hardcoded `100` with no named constant
- **Recommendation**: Define `const PERCENT_BASE = 100;` for clarity

### [QUAL-004] Magic numbers in test files
- **File**: `tests/jokerDistribution.test.js:43,46` and `tests/cardDistribution2000.test.js:74,77`
- **Issue**: Hardcoded `deckSize = 100`, `totalDraws = 1000/2000` without explanation
- **Recommendation**: Extract to named constants at the top of test files or a shared config

### [QUAL-005] Missing JSDoc on all exported functions
- **File**: `index.js:37`, `src/card.js:42-48`, `src/simpleCard.js:9`, `src/percentCard.js:9`, `src/jokerCard.js:9`
- **Issue**: No JSDoc or type annotations on any exported functions
- **Recommendation**: Add JSDoc comments describing parameters, return types, and purpose for all exports

### [QUAL-006] Empty package description
- **File**: `package.json:4`
- **Issue**: `"description": ""` — no package description
- **Recommendation**: Add a meaningful description for npm registry

### [QUAL-007] Probabilistic test assertions may flake
- **File**: `tests/jokerDistribution.test.js:61-62`, `tests/cardDistribution2000.test.js:94-95`
- **Issue**: `expect(jokerCount).toBeGreaterThan(0)` and `toBeLessThan(100)` are probabilistic — could randomly fail
- **Recommendation**: Use statistical bounds or increase sample size; add `jest.retryTimes()` for flaky tests

### [QUAL-008] Weak test assertions
- **File**: `test/test.js:17-23`
- **Issue**: Test only asserts `expect(log).toBeDefined()` — does not verify game logic, health calculations, or log content
- **Recommendation**: Add assertions that verify the game log contains expected battle messages and correct final state

### [QUAL-009] Mixed language in code
- **File**: `index.js`, `play.js`
- **Issue**: Variable names in English (`health1`, `name1`) but strings/messages in Russian (`"Начинаем бой!"`, `"Игрок"`)
- **Recommendation**: Standardize to one language (English recommended for codebase consistency)

### [QUAL-010] `no-console` lint rule disabled
- **File**: `eslint.config.js:19`
- **Issue**: `"no-console": "off"` allows `console.log` in production code
- **Recommendation**: Re-enable `no-console` and use a proper logging abstraction; allow only in test files

---

## ✅ Best Practice Violations

### [BP-001] Business logic mixed with IO
- **File**: `play.js:16`
- **Violation**: `printLog` uses `console.log` directly — IO is coupled to game output
- **Recommendation**: Separate game logic from presentation; accept a logger/callback as parameter

### [BP-002] Console output in test bodies
- **File**: `test/test.js:21`, `tests/jokerDistribution.test.js:30-37`, `tests/cardDistribution2000.test.js:49-68`
- **Violation**: Tests use `console.log` for output instead of assertions
- **Recommendation**: Replace `console.log` with proper assertions; use test reporters for debug output

### [BP-003] Mutable module-level state
- **File**: `src/card.js:34,40`
- **Violation**: `const registry = createMethodRegistry()` creates single mutable module-level state shared by all card types; `methods` variable is reassigned directly
- **Recommendation**: Consider immutable patterns or dependency injection for easier testing

### [BP-004] Default export is a curried factory
- **File**: `index.js:37`
- **Violation**: `export default (cards) => (name1, name2) => run(name1, name2, cards)` — triple-nested arrow functions are hard to read and debug
- **Recommendation**: Use named exports with explicit function signatures

### [BP-005] Inconsistent error handling patterns
- **File**: `src/card.js:16` (returns `null`), `index.js` (no error handling)
- **Violation**: Mixed use of null returns vs no error handling; no consistent error strategy
- **Recommendation**: Adopt a consistent pattern — either throw errors or use Result/Either types

### [BP-006] Side effects in `register` function
- **File**: `src/card.js:33-35`
- **Violation**: `register` mutates closure variable `methods` via reassignment — side effect in what appears to be a functional codebase
- **Recommendation**: Return new registry state instead of mutating, or document this as intentional imperative design

### [BP-007] No input validation on public APIs
- **File**: `src/simpleCard.js:9`, `src/percentCard.js:9`, `src/jokerCard.js:9`
- **Violation**: `make` functions accept any values without validation (e.g., negative damage, percent > 100)
- **Recommendation**: Add guards: `if (percent < 0 || percent > 100) throw new RangeError(...)`

### [BP-008] Game has no termination guarantee
- **File**: `index.js:17-32`
- **Violation**: `gameLoop` is recursive with random card selection — JokerCard deals damage equal to current health, but other cards may deal small fixed damage. With bad RNG, game could run indefinitely.
- **Recommendation**: Add a maximum turn counter or ensure minimum damage per turn

### [BP-009] No separation between game engine and runner
- **File**: `index.js`, `play.js`
- **Violation**: `index.js` exports a factory but `play.js` immediately executes it — no clear boundary between library and CLI
- **Recommendation**: Add a `bin/` or `cli.js` entry point; keep `index.js` as pure library

### [BP-010] Empty `.agents/SKILLS.md` file
- **File**: `.agents/SKILLS.md`
- **Violation**: Empty file serves no purpose
- **Recommendation**: Either populate with agent skill definitions or remove the file

---

## 🎯 Top 3 Priority Actions

1. **`index.js:18-31`** — Fix game loop dead-player attack bug. A dead player can still deal damage for one extra turn, producing incorrect game outcomes. This is the most critical logic bug.

2. **`.github/workflows/release.yml:12-16`** — Update CI/CD from EOL Node.js 15 to Node.js 22 and update action versions. The CI pipeline is broken on modern runners, blocking releases.

3. **`src/card.js:45-46`** — Add null guards before calling registry methods. Unregistered card types cause unhelpful `TypeError` crashes instead of graceful error messages.

---

## 📈 Trends

- New TODOs since last audit: N/A (first audit)
- Resolved items: N/A (first audit)
- Total technical debt items: 28

---

*Generated by automated code audit on 2026-08-10*
