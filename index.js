// @ts-check

import { cons, l, random } from '@hexlet/pairs-data';
import { getName, damage } from './src/card.js';

const INITIAL_HEALTH = 10;
const START_MESSAGE = '\nНачинаем бой!';

const createBattleMessage = (attacker, cardName, defender, points) =>
  `\nИгрок '${attacker}' применил '${cardName}' против '${defender}' и нанес урон '${points}'`;

const createGameState = (name1, health1, name2, health2) =>
  l(l(name1, health1), l(name2, health2));

const appendToLog = (state, message, log) => cons(l(state, message), log);

const gameLoop = (health1, name1, health2, name2, log, cards) => {
  let h1 = health1;
  let n1 = name1;
  let h2 = health2;
  let n2 = name2;
  let currentLog = log;

  while (true) {
    if (h1 <= 0) {
      return cons(`${n1} был убит`, currentLog);
    }

    const card = random(cards);
    const cardName = getName(card);
    const points = damage(card, h2);
    const newHealth = h2 - points;

    const message = createBattleMessage(n1, cardName, n2, points);
    const state = createGameState(n1, h1, n2, h2);
    currentLog = appendToLog(state, message, currentLog);

    const tempH = h1;
    h1 = newHealth;
    h2 = tempH;
    const tempN = n1;
    n1 = n2;
    n2 = tempN;
  }
};

const run = (player1, player2, cards) =>
  gameLoop(INITIAL_HEALTH, player1, INITIAL_HEALTH, player2, l(START_MESSAGE), cards);

export default (cards) => (name1, name2) => run(name1, name2, cards);
