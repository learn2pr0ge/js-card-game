---

# 🔍 Code Audit Report

## 📊 Summary
| Category | Count | Priority |
|----------|-------|----------|
| TODO/FIXME/HACK items | 3 | Review needed |
| Potential bugs | 5 | Fix ASAP |
| Code quality issues | 3 | Refactor |
| Best practice violations | 2 | Improve |

---

## 📝 TODO/FIXME/HACK Comments

### [FILE-001] `index.js:21`
- **Type**: HACK
- **Comment**: `// HACK`
- **Context**: `gameLoop` function — marks the random card draw line
- **Suggested action**: Explain why this is a hack or remove the comment if the code is intentional. The `random(cards)` call from `@hexlet/pairs-data` appears correct; if there is a known issue, document it.

### [FILE-002] `index.js:11`
- **Type**: FIX
- **Comment**: `// FIX`
- **Context**: Above `createGameState` function
- **Suggested action**: This comment says "FIX" but provides no detail. Either complete the fix or remove the comment. The function itself looks structurally fine.

### [FILE-003] `src/jokerCard.js:8`
- **Type**: HACK
- **Comment**: `// HACK`
- **Context**: `make` function — creates Joker card with `null` as third element
- **Suggested action**: The Joker uses `null` where other cards use a data value (damage/percent). This breaks the structural contract. Either store a sentinel value (e.g., `0` or `"joker"`) or document why `null` is intentional.

---

## 🐛 Potential Bugs

### [BUG-001] Stale game state in gameLoop
- **File**: `index.js:28`
- **Type**: Logic bug / stale data
- **Description**: `createGameState(name1, health1, name2, health2)` is called with the *old* health values, not the updated `newHealth`. The state is passed to `appendToLog`, but the logged state reflects pre-damage values.
- **Impact**: Battle log records incorrect health states for players
- **Fix**: Change line 28 to `const state = createGameState(name1, health1, name2, newHealth);` or swap the argument order in the recursive call (line 31) which already does `newHealth, name2, health1, name1`

### [BUG-002] Missing null guard on method registry lookup
- **File**: `src/card.js:45-46`
- **Type**: Null dereference
- **Description**: `registry.getMethod(card, "getName")(card)` calls the result as a function, but `getMethod` returns `null` when no method is registered. If a card type is used without registered methods, this throws `TypeError: null is not a function`.
- **Impact**: Unhandled runtime crash when an unregistered card type is used
- **Fix**: Add null check: `const method = registry.getMethod(card, "getName"); if (!method) throw new Error(...); return method(card);`

### [BUG-003] Only one player death check
- **File**: `index.js:18`
- **Type**: Missing condition
- **Description**: `gameLoop` only checks `if (health1 <= 0)` at the start. It never checks if `health2 <= 0`. The players swap roles on recursion, so the check happens eventually, but a player can go into negative health for an extra iteration.
- **Impact**: Incorrect game state and extra log entries after a player should have died
- **Fix**: Add check: `if (health1 <= 0 || health2 <= 0)` or check the current defender before applying damage

### [BUG-004] Inconsistent data structure for Joker cards
- **File**: `src/jokerCard.js:9`
- **Type**: Type inconsistency
- **Description**: Joker uses `cons(type, cons(name, null))` while other cards use `cons(type, cons(name, value))`. Code that calls `cdr(cdr(card))` on a Joker gets `null` while other cards get a number. If any code tries to use this value arithmetically (e.g., `null / 100` → `NaN`), it silently produces wrong results.
- **Impact**: Silent NaN propagation if Joker third-element is used in calculations
- **Fix**: Use a numeric sentinel like `0` or `-1` instead of `null`: `cons(type, cons(name, 0))`

### [BUG-005] Hardcoded health value used in recursive argument swap
- **File**: `index.js:31`
- **Type**: Argument ordering confusion
- **Description**: `gameLoop(newHealth, name2, health1, name1, newLog, cards)` — the parameter order is `(health1, name1, health2, name2, ...)`. This line passes `newHealth` as `health1`, `name2` as `name1`, `health1` as `health2`, `name1` as `name2`. This swaps players but the `health1` passed as `health2` is the *old* value, not the damaged value.
- **Impact**: Health tracking is incorrect across turns
- **Fix**: Should be `gameLoop(newHealth, name2, health1, name1, ...)` which appears to be the intent, but verify the death check on line 18 uses the right value

---

## 🧹 Code Quality Issues

### [QUAL-001] Duplicated test utility code
- **File**: `tests/jokerDistribution.test.js:9-28` and `tests/cardDistribution2000.test.js:9-28`
- **Issue**: `CARD_NAMES`, `createCardPool()`, and `createDeckWithJoker()` are identical in both files
- **Recommendation**: Extract to a shared `tests/fixtures.js` or `tests/testUtils.js` module

### [QUAL-002] Duplicated deck creation between play.js and test.js
- **File**: `play.js:9-14` and `test/test.js:9-14`
- **Issue**: `createCardDeck()` / `createTestDeck()` are identical
- **Recommendation**: Create a shared `src/testDeck.js` module or a factory function

### [QUAL-003] Magic numbers scattered throughout
- **File**: Multiple files
- **Issue**: `100` appears 10+ times (deck size, percentage divisor, frequency divisor), `50` and `40` as card percentages
- **Recommendation**: Define constants: `const DECK_SIZE = 100; const PERCENT_DIVISOR = 100;`

---

## ✅ Best Practice Violations

### [BP-001] Weak test assertions
- **File**: `test/test.js:22`
- **Violation**: Only assertion is `expect(log).toBeDefined()` — does not validate game logic, card effects, or death conditions
- **Recommendation**: Add assertions checking log contains expected card names, damage values, and a death message

### [BP-002] IO mixed with game logic
- **File**: `play.js:16`
- **Violation**: `printLog` calls `console.log` directly, coupling display to game execution
- **Recommendation**: Return the log from `game()` and let the caller decide how to render it (already done, but `printLog` should be separate from the game module)

---

## 🎯 Top 3 Priority Actions

1. **`src/card.js:45`** — Missing null guard on method registry can cause unhandled runtime crash with any unregistered card type. Add defensive check.
2. **`index.js:28`** — Game state logged with stale health values. Change to use `newHealth` so battle log is accurate.
3. **`src/jokerCard.js:9`** — Replace `null` with numeric sentinel to prevent silent NaN propagation if the value is ever used in arithmetic.

---

## 📈 Trends

- New TODOs since last audit: N/A (first audit)
- Resolved items: N/A
- Total technical debt items: 13

---

*Audit performed on 2026-08-24*
