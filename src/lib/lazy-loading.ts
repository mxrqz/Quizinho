import { lazy, ComponentType } from 'react';

export function createLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) {
  return lazy(importFunc);
}