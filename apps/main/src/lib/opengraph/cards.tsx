import { OgVariant } from "./schema";

export interface OgCardProps {
	variant: OgVariant;
	title?: string;
	prefix?: string;
	twitter?: boolean;
	bgSrc?: string;
	logoSrc?: string;
}

export function OpenGraphCard({
	variant,
	title = "Lani Akita",
	prefix = "Lani Akita",
	twitter = false,
	bgSrc = "bg-default",
	logoSrc = "logo",
}: OgCardProps) {
	switch (variant) {
		case OgVariant.Image:
			return (
				<div
					style={{
						display: "flex",
						width: "100%",
						height: "100%",
						backgroundColor: "#07070D",
					}}
				>
					<img
						alt='Cover'
						src={bgSrc}
						style={{
							width: "100%",
							height: "100%",
							objectFit: "cover",
							objectPosition: "center",
						}}
					/>
				</div>
			);

		case OgVariant.Home:
			return (
				<div
					style={{
						position: "relative",
						display: "flex",
						flexDirection: "column",
						width: "100%",
						height: "100%",
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: "#07070D",
						fontFamily: "Inter Tight, sans-serif",
					}}
				>
					<img
						alt='Background Texture'
						src={bgSrc}
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							width: "100%",
							height: "100%",
							objectFit: "cover",
							opacity: 0.85,
						}}
					/>

					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							gap: "2rem",
							padding: "3rem",
							backgroundColor: "rgba(14, 14, 23, 0.75)",
							border: "2px solid #1e1e2e",
							borderRadius: "1.5rem",
						}}
					>
						<img
							src={logoSrc}
							alt='Lani Akita Logo'
							style={{
								height: twitter ? "220px" : "180px",
							}}
						/>
						<span
							style={{
								fontFamily: "0xProto, monospace",
								fontSize: twitter ? "36px" : "28px",
								color: "#a6adc8",
								letterSpacing: "0.08em",
							}}
						>
							laniakita.com
						</span>
					</div>
				</div>
			);

		case OgVariant.Dynamic:
			return (
				<div
					style={{
						position: "relative",
						display: "flex",
						width: "100%",
						height: "100%",
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: "#07070D",
						fontFamily: "Inter Tight, sans-serif",
					}}
				>
					<img
						alt='Background Texture'
						src={bgSrc}
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							width: "100%",
							height: "100%",
							objectFit: "cover",
							opacity: 0.85,
						}}
					/>

					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "flex-start",
							justifyContent: "center",
							backgroundColor: "#0e0e17",
							border: "2px solid #1e1e2e",
							borderRadius: "1.25rem",
							padding: twitter ? "3.5rem 4.5rem" : "2.75rem 3.5rem",
							maxWidth: "86%",
							color: "#cdd6f4",
						}}
					>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								width: "100%",
							}}
						>
							<span
								style={{
									fontFamily: "0xProto, monospace",
									fontSize: twitter ? "46px" : "36px",
									color: "#89b4fa",
									fontWeight: 400,
								}}
							>
								{prefix}:
							</span>
							<img
								src={logoSrc}
								alt='Logo'
								style={{
									height: twitter ? "52px" : "42px",
									opacity: 0.8,
								}}
							/>
						</div>

						<div
							style={{
								width: "100%",
								height: "2px",
								backgroundColor: "#313244",
								margin: twitter ? "1.75rem 0" : "1.25rem 0",
							}}
						/>

						<h1
							style={{
								display: "flex",
								fontWeight: 900,
								fontSize: twitter ? "76px" : "58px",
								lineHeight: 1.15,
								margin: 0,
								color: "#cdd6f4",
							}}
						>
							{title}
						</h1>
					</div>
				</div>
			);
		default:
			return (
				<div
					style={{
						position: "relative",
						display: "flex",
						width: "100%",
						height: "100%",
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: "#07070D",
						fontFamily: "Inter Tight, sans-serif",
					}}
				>
					<img
						alt='Background Texture'
						src={bgSrc}
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							width: "100%",
							height: "100%",
							objectFit: "cover",
							opacity: 0.85,
						}}
					/>

					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							backgroundColor: "#0e0e17",
							border: "2px solid #1e1e2e",
							borderRadius: "1.25rem",
							padding: twitter ? "4rem 5rem" : "3rem 4rem",
							maxWidth: "86%",
							color: "#cdd6f4",
							gap: "1.5rem",
						}}
					>
						<h1
							style={{
								display: "flex",
								textAlign: "center",
								fontWeight: 900,
								fontSize: twitter ? "82px" : "64px",
								lineHeight: 1.15,
								margin: 0,
								color: "#cdd6f4",
							}}
						>
							{title}
						</h1>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: "0.75rem",
								marginTop: "0.5rem",
							}}
						>
							<img
								src={logoSrc}
								alt='Logo'
								style={{
									height: "36px",
									opacity: 0.7,
								}}
							/>
							<span
								style={{
									fontFamily: "0xProto, monospace",
									fontSize: twitter ? "28px" : "22px",
									color: "#6c7086",
								}}
							>
								laniakita.com
							</span>
						</div>
					</div>
				</div>
			);
	}
}
