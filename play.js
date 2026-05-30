// @ts-check

import { l, toString, reverse } from '@hexlet/pairs-data';
import makeGame from './index.js';
import * as percentCard from './src/percentCard.js';
import * as simpleCard from './src/simpleCard.js';
import * as jokerCard from './src/jokerCard.js';

const createCardDeck = () => l(
  percentCard.make('Проказливый рубитель крови', 50),
  simpleCard.make('Прохладный чыонг-бонг рыка', 3),
  percentCard.make('Воздушный змей клеветы', 40),
  jokerCard.make('Джокер'),
);

const printLog = (log) => console.log(toString(reverse(log)));

const deck = createCardDeck();
const game = makeGame(deck);
const log = game('John', 'Ada');
printLog(log);
