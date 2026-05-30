// @ts-check

import { cons, car, cdr } from '@hexlet/pairs';
import { defineMethod, validateString } from './card.js';

const type = 'JokerCard';
const defmethod = defineMethod(type);

export const make = (name) => {
  validateString(name, 'name');
  return cons(type, cons(name, null));
};

const getName = (card) => car(cdr(card));
const calculateDamage = (_card, health) => health;

defmethod('getName', getName);
defmethod('damage', calculateDamage);
