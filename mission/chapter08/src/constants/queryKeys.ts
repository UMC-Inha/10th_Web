import type { LpSortOrder } from '../types/lp';

export const QUERY_KEYS = {
  lp: (id: number) => ['lp', id] as const,
  lps: (sort: LpSortOrder, search: string) => ['lps', sort, search] as const,
  lpsAll: ['lps'] as const,
  lpComments: (id: number, order: LpSortOrder) => ['lpComments', id, order] as const,
  lpCommentsAll: (id: number) => ['lpComments', id] as const,
  myInfo: ['myInfo'] as const,
  user: (userId: string) => ['user', userId] as const,
} as const;
