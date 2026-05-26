export type TagDto = {
  id: number;
  name: string;
};

export type LikeDto = {
  id: number;
  userId: number;
  lpId: number;
};

export type AuthorDto = {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LpDto = {
  id: number;
  title: string;
  content: string;
  thumbnail: string | null;
  published: boolean;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  tags: TagDto[];
  likes: LikeDto[];
};

export type LpDetailDto = LpDto & {
  author: AuthorDto;
};

export type LpListData = {
  data: LpDto[];
  nextCursor: number | null;
  hasNext: boolean;
};

export const LP_SORT_ORDER_LABELS = {
  asc: '오래된순',
  desc: '최신순',
} as const;

export type LpSortOrder = keyof typeof LP_SORT_ORDER_LABELS;

export const DEFAULT_LP_SORT_ORDER: LpSortOrder = 'desc';

export type GetLpsParams = {
  cursor?: number;
  limit?: number;
  search?: string;
  order?: LpSortOrder;
};

export type CreateLpRequest = {
  title: string;
  content: string;
  thumbnail?: string | null;
  published?: boolean;
  tags?: string[];
};

export type UpdateLpRequest = {
  title?: string;
  content?: string;
  thumbnail?: string | null;
  published?: boolean;
  tags?: string[];
};

// ── 댓글 ───────────────────────────────────────────────

export type CommentDto = {
  id: number;
  content: string;
  lpId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
};

export type CommentListData = {
  data: CommentDto[];
  nextCursor: number | null;
  hasNext: boolean;
};

export type GetCommentsParams = {
  cursor?: number;
  limit?: number;
  order?: LpSortOrder;
};
