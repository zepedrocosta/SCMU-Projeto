export type User = {
  nickname: string;
  name: string;
  email: string;
  role: string;
};

export type UserResponse = {
  nickname: string;
  name: string;
  email: string;
  role: string;
};

export interface UserDefaults {}

export interface UserWithDefaults extends User {
  defaults: UserDefaults;
}
