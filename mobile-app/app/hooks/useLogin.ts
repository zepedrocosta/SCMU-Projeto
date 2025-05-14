import { useMutation } from "@tanstack/react-query";

type LoginInput = {
	email: string;
	password: string;
};

export function useLogin() {
	return useMutation({
		mutationFn: async ({ email, password }: LoginInput) => {
			await new Promise((res) => setTimeout(res, 1000));
			if (email === "user@example.com" && password === "password")
				return { success: true };
			throw new Error("Invalid credentials");
		},
	});
}
