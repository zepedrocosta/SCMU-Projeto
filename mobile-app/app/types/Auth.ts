export type LoginRequest = {
	email: string;
	password: string;
};

export type LoginResponse = {
	userId: string;
	accessToken: string;
	refreshToken: string;
};

export type RegisterRequest = {
	name: string;
	nickname: string;
	email: string;
	password: string;
	confirmPassword: string;
};

export type RegisterResponse = {
	userId: string;
	accessToken: string;
	refreshToken: string;
};
