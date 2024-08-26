import type { ReactNode } from "react";
import { DarkStoreProvider } from "@/providers/theme-store-provider";

export default function ContentLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <DarkStoreProvider>
      {children}
    </DarkStoreProvider>
  )
}

