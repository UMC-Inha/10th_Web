export interface Tag {
  id: number;
  name: string;
}

export interface Like {
  id: number;
  userId: number;
  lpId: number;
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

// 댓글 타입
export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  lpId: number;
  authorId: number;
  author: {
    id: number;
    name: string;
  };
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

// 댓글 목록 응답 타입
export interface CommentListResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    data: Comment[];
    nextCursor: number | null;
    hasNext: boolean;
  };
}