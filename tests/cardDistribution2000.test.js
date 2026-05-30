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

const initializeDistribution = (names) => {
  const distribution = {};
  for (const name of names) {
    distribution[name] = 0;
  }
  return distribution;
};

const initializePlayerDistribution = (playerNames, cardNames) => {
  const result = {};
  for (const player of playerNames) {
    result[player] = {};
    for (const card of cardNames) {
      result[player][card] = 0;
    }
  }
  return result;
};

const printDistribution = (distribution, playerDistribution, totalDraws) => {
  console.log(`\n=== Статистика за ${totalDraws} раздач ===`);
  console.log('Общее распределение карт:');
  for (const [name, count] of Object.entries(distribution)) {
    console.log(`  ${name}: ${count} (${((count / totalDraws) * 100).toFixed(2)}%)`);
  }

  console.log('\nРаспределение по игрокам:');
  for (const [player, counts] of Object.entries(playerDistribution)) {
    console.log(`\n  ${player}:`);
    for (const [cardName, count] of Object.entries(counts)) {
      console.log(`    ${cardName}: ${count} (${((count / totalDraws) * 100).toFixed(2)}%)`);
    }
  }

  const expectedJokerFrequency = totalDraws / 100;
  const actualJokerFrequency = (distribution[CARD_NAMES.joker] / totalDraws) * 100;
  console.log(`\nОжидаемая частота Джокера: ~${expectedJokerFrequency.toFixed(0)} раз (1 из 100)`);
  console.log(`Фактическая частота Джокера: ${actualJokerFrequency.toFixed(2)}%`);
};

describe('2000 card draws simulation', () => {
  it('should simulate 2000 draws and analyze card distribution', () => {
    const pool = createCardPool();
    const joker = jokerCard.make(CARD_NAMES.joker);
    const deckSize = 100;
    const cards = createDeckWithJoker(joker, pool, deckSize);

    const totalDraws = 2000;
    const distribution = initializeDistribution(Object.values(CARD_NAMES));
    const playerDistribution = initializePlayerDistribution(
      ['player1', 'player2'],
      Object.values(CARD_NAMES),
    );

    for (let i = 0; i < totalDraws; i++) {
      const card = random(cards);
      const cardName = getName(card);
      distribution[cardName]++;
      const player = i % 2 === 0 ? 'player1' : 'player2';
      playerDistribution[player][cardName]++;
    }

    printDistribution(distribution, playerDistribution, totalDraws);

    expect(distribution[CARD_NAMES.joker]).toBeGreaterThan(0);
    expect(distribution[CARD_NAMES.joker]).toBeLessThan(100);
    expect(Object.values(distribution).reduce((sum, count) => sum + count, 0)).toBe(totalDraws);
  });
});
