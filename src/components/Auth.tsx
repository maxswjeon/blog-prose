"use client";

import { signIn, signOut } from "next-auth/react";

type ButtonProps = {
	className?: string;
	text?: string;
};

export function LoginButton({ className, text }: ButtonProps) {
	return (
		<button type="button" className={className} onClick={() => signIn()}>
			{text || "Sign in"}
		</button>
	);
}

export function LogoutButton({ className, text }: ButtonProps) {
	return (
		<button type="button" className={className} onClick={() => signOut()}>
			{text || "Sign out"}
		</button>
	);
}
