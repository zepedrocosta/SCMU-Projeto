export type User = {
	id: string;
	name: string;
	email: string;
};

export type UserResponse = {
	id: string;
	name: string;
	email: string;
};

export interface UserDefaults {
	darkMode: boolean;
}

export interface UserWithDefaults extends User {
	defaults: UserDefaults;
}
