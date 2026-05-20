export interface Tag {
  id: number
  name: string
}

export interface Like {
  id: number
  userId: number
  lpId: number
}

export interface Lp {
  id: number
  title: string
  content: string
  thumbnail: string
  published: boolean
  authorId: number
  createdAt: string
  updatedAt: string
  tags: Tag[]
  likes: Like[]
}

export interface Author {
  id: number
  name: string
  email: string
  bio: string | null
  avatar: string | null
  createdAt: string
  updatedAt: string
}

export interface LpDetail extends Lp {
  author: Author
}

export interface LpListResponse {
  data: {
    data: Lp[]
    nextCursor: number
    hasNext: boolean
  }
}

export interface LpDetailResponse {
  data: LpDetail
}

export interface Comment {
  id: number
  content: string
  lpId: number
  authorId: number
  createdAt: string
  updatedAt: string
  author: Author
}

export interface CommentListResponse {
  data: {
    data: Comment[]
    nextCursor: number
    hasNext: boolean
  }
}

export type SortOrder = 'asc' | 'desc'

export interface UserToken {
  id?: number
  accessToken: string
  refreshToken: string
  name: string
}
