"use client";

import { PropsWithChildren, createContext, useState } from "react";

import { Post } from "@prisma/client";

import PublishSheet from "./PublishSheet";

export const SheetContext = createContext({
	openPublishSheet: () => {},
	publishSheetOpen: false,
});

type Props = {
	post: Post;
};

export default function Providers({
	post,
	children,
}: PropsWithChildren<Props>) {
	const [publishSheetOpen, setPublishSheetOpen] = useState(false);

	return (
		<SheetContext.Provider
			value={{
				openPublishSheet: () => setPublishSheetOpen(true),
				publishSheetOpen,
			}}
		>
			{children}
			<PublishSheet
				post={post}
				isOpen={publishSheetOpen}
				onClose={() => setPublishSheetOpen(false)}
			/>
		</SheetContext.Provider>
	);
}
