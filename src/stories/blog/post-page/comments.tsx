import Giscus from "@giscus/react";
import { useEffect, useState } from "react";
import { useThemeStore } from "@/lib/providers/theme-store-provider";

export function Comments() {
	const { theme } = useThemeStore((state) => state);
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		if (theme === "auto") {
			setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
		} else {
			setIsDark(theme === "dark");
		}
	}, [theme]);

	const themePref = isDark
		? "https://giscus.catppuccin.com/themes/mocha.css"
		: "https://giscus.catppuccin.com/themes/latte.css";

	return (
		<div className="p-6">
			<div className="mx-auto size-full max-w-3xl md:max-w-2xl" data-testid="comments-container">
				<Giscus
					id="comment"
					repo="laniakita/website"
					repoId="R_kgDOLYjaFQ"
					category="Announcements"
					categoryId="DIC_kwDOLYjaFc4Cf0F_"
					mapping="pathname"
					strict="0"
					reactionsEnabled="1"
					emitMetadata="1"
					inputPosition="top"
					theme={themePref}
					lang="en"
					loading="lazy"
				/>
			</div>
		</div>
	);
}

