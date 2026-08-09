import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(core)/_blog-meta")({
	component: () => <Outlet />,
});
