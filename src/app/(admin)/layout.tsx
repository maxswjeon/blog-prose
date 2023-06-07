import { PropsWithChildren } from "react";

import "styles/globals.css";
import "./styles.css";

export const metadata = {};

export default function AdminRootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="ko" className="w-full h-full">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.6/dist/web/variable/pretendardvariable-dynamic-subset.css"
        />
      </head>
      <body className="w-full h-full overflow-auto">{children}</body>
    </html>
  );
}
