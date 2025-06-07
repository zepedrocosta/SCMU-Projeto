export type User = {
	name: string;
	email: string;
	nickname: string;
};

export type UserResponse = {
	name: string;
	email: string;
	nickname: string;
};

export interface UserDefaults {
	darkMode: boolean;
	receiveNotifications: boolean;
}

export interface UserWithDefaults extends User {
	defaults: UserDefaults;
}

export type UserUpdateRequest = {
	name: string;
};
