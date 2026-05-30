// @ts-check

import { l, reverse, toString } from '@hexlet/pairs-data';
import makeGame from '../index.js';
import * as percentCard from '../src/percentCard.js';
import * as simpleCard from '../src/simpleCard.js';
import * as jokerCard from '../src/jokerCard.js';

const createTestDeck = () => l(
  percentCard.make('Проказливый рубитель крови', 50),
  simpleCard.make('Прохладный чыонг-бонг рыка', 3),
  percentCard.make('Воздушный змей клеветы', 40),
  jokerCard.make('Джокер'),
);

describe('CardGame', () => {
  it('should run a game and produce a log', () => {
    const deck = createTestDeck();
    const game = makeGame(deck);
    const log = game('John', 'Ada');
    console.log(toString(reverse(log)));
    expect(log).toBeDefined();
  });
});
