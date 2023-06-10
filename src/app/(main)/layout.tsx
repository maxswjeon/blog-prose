import { PropsWithChildren } from "react";

import { getConfig } from "lib/config";
import ClientLayout from "./ClientLayout";

import "styles/globals.css";

export default async function RootLayout({ children }: PropsWithChildren) {
  const config = await getConfig();

  return (
    <html lang="en" className="w-full h-full">
      <body className="w-full h-full overflow-auto">
        <ClientLayout config={config}>{children}</ClientLayout>
      </body>
    </html>
  );
}

export async function generateMetadata() {
  const config = await getConfig();

  return {
    title: config.metadata.name,
    description: config.metadata.description,
  };
}
