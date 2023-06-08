"use client";

import { PropsWithChildren } from "react";

import { MultiBackend, getBackendOptions } from "@minoru/react-dnd-treeview";
import { DndProvider } from "react-dnd";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <DndProvider backend={MultiBackend} options={getBackendOptions()}>
      {children}
    </DndProvider>
  );
}
