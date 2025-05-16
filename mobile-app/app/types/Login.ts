export type LoginRequest = {
	email: string;
	password: string;
};

export type LoginResponse = {
	userId: string;
	accessToken: string;
	refreshToken: string;
};
