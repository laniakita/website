import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanstackProvider } from "fumadocs-core/framework/tanstack";
import { Header } from "@/components/navigation/header";
import {
	defaultNavItems,
	defaultSocialItems,
} from "@/components/navigation/header/data";
import { NavScrollViewStoreProvider } from "@/lib/providers/nav-scroll-view-store-provider";
import { ThemeStoreProvider } from "@/lib/providers/theme-store-provider";
import { ToCViewStoreProvider } from "@/lib/providers/toc-view-store-provider";
import appCss from "../styles.css?url";

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`;

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "TanStack Start Starter",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<TanstackProvider>
			<html lang="en" suppressHydrationWarning>
				<head>
					<script
						// biome-ignore lint/security/noDangerouslySetInnerHtml: This is ok.
						dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
					/>
					<HeadContent />
				</head>
				<body>
					<ThemeStoreProvider>
						<NavScrollViewStoreProvider>
							<ToCViewStoreProvider>
								<Header
									navItems={defaultNavItems}
									socialItems={defaultSocialItems}
								/>
								{children}
							</ToCViewStoreProvider>
						</NavScrollViewStoreProvider>
					</ThemeStoreProvider>
					<TanStackDevtools
						config={{
							position: "bottom-right",
						}}
						plugins={[
							{
								name: "Tanstack Router",
								render: <TanStackRouterDevtoolsPanel />,
							},
						]}
					/>
					<Scripts />
				</body>
			</html>
		</TanstackProvider>
	);
}
