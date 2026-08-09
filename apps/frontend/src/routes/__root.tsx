import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanstackProvider } from "fumadocs-core/framework/tanstack";
import { NavScrollViewStoreProvider } from "@/lib/providers/nav-scroll-view-store-provider";
import { ThemeStoreProvider } from "@/lib/providers/theme-store-provider";
import { ToCViewStoreProvider } from "@/lib/providers/toc-view-store-provider";
import { getSeoMeta } from "../lib/utils/seo";
import { APP_DEFAULT_TITLE, APP_DESCRIPTION } from "../manifest";
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
			...getSeoMeta({
				title: APP_DEFAULT_TITLE,
				description: APP_DESCRIPTION,
				image: "/opengraph/home",
			}),
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "apple-touch-icon",
				sizes: "512x512",
				href: "/apple-icon-1.png",
			},
			{
				rel: "apple-touch-icon",
				sizes: "384x384",
				href: "/apple-icon-2.png",
			},
			{
				rel: "apple-touch-icon",
				sizes: "192x192",
				href: "/apple-icon3.png",
			},
			{
				rel: "icon",
				type: "image/svg",
				href: "/icon1.svg",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "512x512",
				href: "/icon2.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "192x192",
				href: "/icon3.png",
			},
			{
				rel: "icon",
				type: "image/x-icon",
				sizes: "256x256",
				href: "/favicon.ico",
			},
			{ rel: "manifest", href: "/site.webmanifest", color: "#11111b" },
		],
	}),
	shellComponent: RootDocument,
	errorComponent: ({ error }) => {
		return <div>An error occurred: {error.message}</div>;
	},
	notFoundComponent: () => {
		return <div>404</div>;
	},
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en' suppressHydrationWarning>
			<head>
				<script
					// biome-ignore lint/security/noDangerouslySetInnerHtml: This is ok.
					dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
				/>
				<HeadContent />
			</head>
			<body className='bg-background dark:bg-muted'>
				<TanstackProvider>
					<ThemeStoreProvider>
						<NavScrollViewStoreProvider>
							<ToCViewStoreProvider>{children}</ToCViewStoreProvider>
						</NavScrollViewStoreProvider>
					</ThemeStoreProvider>
				</TanstackProvider>
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
	);
}
