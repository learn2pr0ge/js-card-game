// @ts-check

import { cons, car, cdr } from '@hexlet/pairs';
import { defineMethod } from './card.js';

const type = 'PercentCard';
const defmethod = defineMethod(type);

export const make = (name, percent) => cons(type, cons(name, percent));

const getName = (card) => car(cdr(card));
const getPercent = (card) => cdr(cdr(card));
const calculateDamage = (card, health) => Math.round(health * (getPercent(card) / 100));

defmethod('getName', getName);
defmethod('damage', calculateDamage);
