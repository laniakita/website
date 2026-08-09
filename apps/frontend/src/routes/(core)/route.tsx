import { createFileRoute, Outlet } from "@tanstack/react-router";
import { MAIN_PAGES, SOCIALS_NAVBAR } from "@/components/nav-constants";
import { Footer } from "@/components/navigation/footer";
import { Header } from "@/components/navigation/header";

export const Route = createFileRoute("/(core)")({
	staleTime: 300_000,
	gcTime: 300_000,
	component: () => (
		<>
			<Header navItems={MAIN_PAGES} socialItems={SOCIALS_NAVBAR} />
			<Outlet />
			<Footer />
		</>
	),
});
