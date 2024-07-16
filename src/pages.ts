import { literal } from 'lit/static-html.js';

export const PAGES = {
  population: {
    title: 'Population',
    path: '/',
    tag: literal`population-root`,
  },
  individual: {
    title: 'Individual',
    path: '/individual',
    tag: literal`individual-root`,
  },
  processing: {
    title: 'Add Patient',
    path: '/processing',
    tag: literal`processing-root`,
  },
} as const;

export const isOnPath = (path: string): boolean => {
  return window.location.pathname.endsWith(path);
};
