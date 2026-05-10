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
  thumbnail: string;
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

export type LpSortOrder = 'asc' | 'desc';

export type GetLpsParams = {
  cursor?: number;
  limit?: number;
  search?: string;
  order?: LpSortOrder;
};
