// @ts-check

import * as pairs from '@hexlet/pairs';
import {
  l, isEmpty, cons, head, tail,
} from '@hexlet/pairs-data';

export const validateString = (value, paramName) => {
  if (typeof value !== 'string') {
    throw new TypeError(`${paramName} must be a string`);
  }
  if (value.length === 0) {
    throw new Error(`${paramName} must not be empty`);
  }
};

export const validateNumber = (value, paramName, { min, max } = {}) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new TypeError(`${paramName} must be a number`);
  }
  if (min !== undefined && value < min) {
    throw new Error(`${paramName} must be at least ${min}`);
  }
  if (max !== undefined && value > max) {
    throw new Error(`${paramName} must be at most ${max}`);
  }
};

export const validateList = (value, paramName) => {
  if (isEmpty(value) && pairs.car(value) === undefined && pairs.cdr(value) === undefined) {
    throw new Error(`${paramName} must not be empty`);
  }
};

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

export const getName = (card) => {
  const method = registry.getMethod(card, 'getName');
  if (!method) {
    throw new Error(`Unknown card type: ${getType(card)}`);
  }
  return method(card);
};

export const damage = (card, health) => {
  const method = registry.getMethod(card, 'damage');
  if (!method) {
    throw new Error(`Unknown card type: ${getType(card)}`);
  }
  return method(card, health);
};

export const defineMethod = (type) => (methodName, fn) => {
  registry.register(type, methodName, fn);
};
