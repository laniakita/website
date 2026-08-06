import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SOCIALS_NAVBAR } from "@/components/nav-constants";
import { Footer } from "@/components/navigation/footer";
import { Header } from "@/components/navigation/header";
import { defaultNavItems } from "@/components/navigation/header/data";

export const Route = createFileRoute("/(core)")({
	component: () => (
		<>
			<Header navItems={defaultNavItems} socialItems={SOCIALS_NAVBAR} />
			<Outlet />
			<Footer />
		</>
	),
});
