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
							gap: "-1rem",
						}}
					>
						<img src={logoSrc} alt='Logo for lanaiakita.com' style={{ height: "50%" }} />
					</div>
				</div>
			);

		case OgVariant.Dynamic:
			return (
				<div
					style={{
						width: "100%",
						height: "100%",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						position: "relative",
						fontFamily: "Inter Tight",
						backgroundColor: "black",
					}}
				>
					<img
						alt='background'
						src={bgSrc}
						style={{
							opacity: 0.8,
							position: "absolute",
							top: 0,
							left: 0,
							bottom: 0,
							right: 0,
							objectFit: "cover",
						}}
					/>

					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: "-2.25rem",
							alignItems: "flex-start",
							justifyContent: "center",
							color: "#cdd6f4",
							padding: "1.25rem 3rem",
							backgroundColor: "#07070D",
							border: "0.15rem solid #1e1e2e",
							borderRadius: "0.375rem",
							maxWidth: "80%",
						}}
					>
						<h2
							style={{
								fontWeight: 400,
								fontFamily: "monospace",
								fontSize: twitter ? "50px" : "40px",
								textTransform: "lowercase",
							}}
						>
							{prefix}:
						</h2>
						<div
							style={{
								width: "100%",
								height: "0.15rem",
								backgroundColor: "#1e1e2e",
								borderRadius: "0.375rem",
							}}
						/>
						<h1
							style={{
								display: "flex",
								fontWeight: 900,
								fontSize: twitter ? "80px" : "60px",
								textWrap: title.length > 14 ? "balance" : "wrap",
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
						width: "100%",
						height: "100%",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						position: "relative",
						fontFamily: "Inter Tight",
						backgroundColor: "black",
					}}
				>
					<img
						alt='background'
						src={bgSrc}
						style={{
							opacity: 0.8,
							position: "absolute",
							top: 0,
							left: 0,
							bottom: 0,
							right: 0,
							objectFit: "cover",
						}}
					/>

					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							color: "#cdd6f4",
							padding: "1.25rem 3rem",
							backgroundColor: "#07070D",
							border: "0.15rem solid #1e1e2e",
							borderRadius: "0.375rem",
							maxWidth: "80%",
						}}
					>
						<h1 style={{ fontWeight: 900, fontSize: twitter ? "80px" : "60px" }}>{title}</h1>
					</div>
				</div>
			);
	}
}
