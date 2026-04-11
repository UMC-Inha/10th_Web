export type SignInRequest = {
  email: string;
  password: string;
};

export type SignInResponse = {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    id: number;
    name: string;
    accessToken: string;
    refreshToken: string;
  };
};

export type SignOutResponse = {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    description: null;
  };
};

export type RefreshRequest = {
  refresh: string;
};

export type SignUpRequest = {
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  password: string;
};

export type SignUpResponse = {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    id: number;
    name: string;
    email: string;
    bio: string;
    avatar: string;
    createdAt: string;
    updatedAt: string;
  };
};
