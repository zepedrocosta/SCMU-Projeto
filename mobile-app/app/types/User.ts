export type User = {
	id: string;
	name: string;
	email: string;
	nickname: string;
};

export type UserResponse = {
	id: string;
	name: string;
	email: string;
	nickname: string;
};

export interface UserDefaults {
	darkMode: boolean;
}

export interface UserWithDefaults extends User {
	defaults: UserDefaults;
}

export type UserUpdateRequest = {
	name: string;
};
