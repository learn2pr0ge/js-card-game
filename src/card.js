// @ts-check

import * as pairs from '@hexlet/pairs';
import {
  l, isEmpty, cons, head, tail,
} from '@hexlet/pairs-data';

const createMethodRegistry = () => {
  let methods = l();

  const getMethod = (obj, methodName) => {
    const currentType = pairs.car(obj);

    const iter = (elements) => {
      if (isEmpty(elements)) {
        return null;
      }

      const element = head(elements);
      if (currentType === pairs.car(element)) {
        const method = pairs.cdr(element);
        if (methodName === pairs.car(method)) {
          return pairs.cdr(method);
        }
      }

      return iter(tail(elements));
    };

    return iter(methods);
  };

  const register = (type, methodName, fn) => {
    methods = cons(pairs.cons(type, pairs.cons(methodName, fn)), methods);
  };

  return { getMethod, register };
};

const registry = createMethodRegistry();

export const getType = (obj) => pairs.car(obj);
export const getData = (obj) => pairs.cdr(obj);

export const getName = (card) => registry.getMethod(card, 'getName')(card);
export const damage = (card, health) => registry.getMethod(card, 'damage')(card, health);

export const defineMethod = (type) => (methodName, fn) => {
  registry.register(type, methodName, fn);
};
