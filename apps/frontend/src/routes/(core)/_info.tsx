import { createFileRoute, Outlet } from "@tanstack/react-router";
import { InfoLayout } from "@/stories/info/info-layout";

export const Route = createFileRoute("/(core)/_info")({
	component: () => (
		<InfoLayout>
			<Outlet />
		</InfoLayout>
	),
});
