import { readFileSync } from "node:fs";
import path from "node:path";
import type { FeaturedImageR1 } from "../image-process";

export function normalizePath(pathStr: string) {
	const filePath = pathStr.split(`${process.cwd()}/`).pop();
	const fileName = filePath?.split("/").pop();
	const fileDir = filePath
		?.split(`/${fileName}`)
		.shift()
		?.split("content/")
		.pop();
	const slug = fileName?.split(".").shift();
	return {
		_file: {
			abs: pathStr,
			path: filePath,
			name: fileName,
			dir: fileDir,
			slug,
		},
	};
}

export function fetchData(pathStr: string) {
	const file = normalizePath(pathStr);
	const { dir, slug } = file._file;
	const dataPath = path.join(
		process.cwd(),
		"content/assets/data",
		`${dir}/${slug}.json`,
	);

	return JSON.parse(readFileSync(dataPath, { encoding: "utf-8" })) as {
		data: { featured_image: FeaturedImageR1 };
	};
}
