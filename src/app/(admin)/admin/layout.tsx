import { Metadata } from "next";
import { PropsWithChildren } from "react";

export default function AdminLayout({ children }: PropsWithChildren) {
	return children;
}

export async function generateMetadata(): Promise<Metadata> {
	return {};
}
