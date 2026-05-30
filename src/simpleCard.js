// @ts-check

import { cons, car, cdr } from '@hexlet/pairs';
import { defineMethod, validateString, validateNumber } from './card.js';

const type = 'SimpleCard';
const defmethod = defineMethod(type);

export const make = (name, damagePoints) => {
  validateString(name, 'name');
  validateNumber(damagePoints, 'damagePoints', { min: 0 });
  return cons(type, cons(name, damagePoints));
};

const getName = (card) => car(cdr(card));
const getDamage = (card) => cdr(cdr(card));

defmethod('getName', getName);
defmethod('damage', getDamage);
