import type { ReactNode } from "react";
import { DarkStoreProvider } from "@/providers/theme-store-provider";
import { ToCViewStoreProvider } from "@/providers/toc-view-store-provider";
import { NavScrollViewStoreProvider } from "@/providers/nav-scroll-view-store-provider";
import { FootnotesStoreProvider } from "@/providers/footnotes-store-provider";

export default function ZustandWrappersCore({ children }: { children: ReactNode }) {
  return (
    <DarkStoreProvider>
      <ToCViewStoreProvider>
        <NavScrollViewStoreProvider>
          <FootnotesStoreProvider>
            {children}
          </FootnotesStoreProvider>
        </NavScrollViewStoreProvider>
      </ToCViewStoreProvider>
    </DarkStoreProvider>
  );
}

