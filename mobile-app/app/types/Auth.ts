export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  nickname: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type RegisterResponse = {
  nickname: string;
  name: string;
  email: string;
  role: string;
  token: string;
};
