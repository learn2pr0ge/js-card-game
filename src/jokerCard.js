// @ts-check

import { cons, car, cdr } from '@hexlet/pairs';
import { defineMethod } from './card.js';

const type = 'JokerCard';
const defmethod = defineMethod(type);

export const make = (name) => cons(type, cons(name, null));

const getName = (card) => car(cdr(card));
const calculateDamage = (_card, health) => health;

defmethod('getName', getName);
defmethod('damage', calculateDamage);
