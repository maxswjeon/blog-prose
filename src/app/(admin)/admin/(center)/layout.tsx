import { PropsWithChildren } from "react";

export default function CenterLayout({ children }: PropsWithChildren) {
	return (
		<div className="min-h-full flex flex-col p-3 justify-center items-center overflow-y-auto">
			{children}
		</div>
	);
}
