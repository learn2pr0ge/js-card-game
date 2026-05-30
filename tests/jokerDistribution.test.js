// @ts-check

import { l, random } from '@hexlet/pairs-data';
import { getName } from '../src/card.js';
import * as percentCard from '../src/percentCard.js';
import * as simpleCard from '../src/simpleCard.js';
import * as jokerCard from '../src/jokerCard.js';

const CARD_NAMES = {
  joker: 'Джокер',
  bloodCutter: 'Проказливый рубитель крови',
  chyeongBong: 'Прохладный чыонг-бонг рыка',
  kite: 'Воздушный змей клеветы',
};

const createCardPool = () => [
  percentCard.make(CARD_NAMES.bloodCutter, 50),
  simpleCard.make(CARD_NAMES.chyeongBong, 3),
  percentCard.make(CARD_NAMES.kite, 40),
];

const createDeckWithJoker = (joker, pool, poolSize) => {
  const cardsArray = [joker];
  for (let i = 0; i < poolSize - 1; i++) {
    cardsArray.push(pool[i % pool.length]);
  }
  return l(...cardsArray);
};

const printJokerStats = (jokerCount, playerJokerCount, totalDraws) => {
  console.log(`\n=== Статистика за ${totalDraws} раздач ===`);
  console.log(`Joker выпал: ${jokerCount} раз`);
  console.log(`Игрок 1 получил Joker: ${playerJokerCount.player1} раз`);
  console.log(`Игрок 2 получил Joker: ${playerJokerCount.player2} раз`);
  console.log(`Ожидаемая частота: ~${(totalDraws / 100).toFixed(0)} раз (1 из 100)`);
  console.log(`Фактическая частота: ${((jokerCount / totalDraws) * 100).toFixed(2)}%`);
};

describe('Joker distribution test', () => {
  it('should simulate 1000 draws and count Joker appearances', () => {
    const pool = createCardPool();
    const joker = jokerCard.make(CARD_NAMES.joker);
    const deckSize = 100;
    const cards = createDeckWithJoker(joker, pool, deckSize);

    const totalDraws = 1000;
    let jokerCount = 0;
    const playerJokerCount = { player1: 0, player2: 0 };

    for (let i = 0; i < totalDraws; i++) {
      const card = random(cards);
      if (getName(card) === CARD_NAMES.joker) {
        jokerCount++;
        const player = i % 2 === 0 ? 'player1' : 'player2';
        playerJokerCount[player]++;
      }
    }

    printJokerStats(jokerCount, playerJokerCount, totalDraws);

    expect(jokerCount).toBeGreaterThan(0);
    expect(jokerCount).toBeLessThan(100);
  });
});
