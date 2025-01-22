import { DarkStoreProvider } from "@/providers/theme-store-provider";
import NavbarCore from "./navbar";

export default function Navbar() {
  return (
    <DarkStoreProvider>
      <NavbarCore />
    </DarkStoreProvider>
  );
}
