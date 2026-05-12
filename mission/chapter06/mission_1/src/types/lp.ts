export interface Tag {
  id: number;
  name: string;
}

export interface Lp {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
  likes: Like[];
}

export interface Like {
  id: number;
  userId: number;
  lpId: number;
}

export interface LpListResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    data: Lp[];
    nextCursor: number | null;
    hasNext: boolean;
  };
}

export interface LpDetailResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: Lp;
}