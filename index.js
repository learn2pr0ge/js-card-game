// @ts-check

import { cons, l, random, isEmpty } from '@hexlet/pairs-data';
import { getName, damage, validateString } from './src/card.js';

const INITIAL_HEALTH = 10;
const START_MESSAGE = '\nНачинаем бой!';

const createBattleMessage = (attacker, cardName, defender, points) =>
  `\nИгрок '${attacker}' применил '${cardName}' против '${defender}' и нанес урон '${points}'`;

const createGameState = (name1, health1, name2, health2) =>
  l(l(name1, health1), l(name2, health2));

const appendToLog = (state, message, log) => cons(l(state, message), log);

const gameLoop = (health1, name1, health2, name2, log, cards) => {
  if (health1 <= 0) {
    return cons(`${name1} был убит`, log);
  }

  const card = random(cards);
  const cardName = getName(card);
  const points = damage(card, health2);
  const newHealth = health2 - points;

  const message = createBattleMessage(name1, cardName, name2, points);
  const state = createGameState(name1, health1, name2, health2);
  const newLog = appendToLog(state, message, log);

  return gameLoop(newHealth, name2, health1, name1, newLog, cards);
};

const run = (player1, player2, cards) => {
  validateString(player1, 'player1');
  validateString(player2, 'player2');
  if (isEmpty(cards)) {
    throw new Error('cards must not be empty');
  }
  return gameLoop(INITIAL_HEALTH, player1, INITIAL_HEALTH, player2, l(START_MESSAGE), cards);
};

export default (cards) => (name1, name2) => run(name1, name2, cards);
