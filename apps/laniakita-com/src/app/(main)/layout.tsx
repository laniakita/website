import type { ReactNode } from "react";
import Footer from "@/components/footer/footer";

export default function MainLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
    <main>{children}</main>
    <Footer />
    </>
  )
}
