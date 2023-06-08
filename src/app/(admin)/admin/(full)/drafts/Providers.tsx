"use client";

import NextAdapterApp from "next-query-params/app";
import { PropsWithChildren } from "react";
import { QueryParamProvider } from "use-query-params";

export default function Providers({ children }: PropsWithChildren) {
	return (
		<QueryParamProvider adapter={NextAdapterApp}>{children}</QueryParamProvider>
	);
}
