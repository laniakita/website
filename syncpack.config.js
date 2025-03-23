// @ts-check

/** @type {import("syncpack").RcFile} */
const config = {
  versionGroups: [
    {
      label: "Use workspace protocol when developing local packages",
      dependencies: ["$LOCAL"],
      dependencyTypes: ["dev"],
      pinVersion: "workspace:*",
    },
    {
      label: "Keep showcase on Next.js 14",
      packages: ["@website/showcase"],
      dependencies: ["next", "@next/bundle-analyzer"],
      pinVersion: "^14.2.25"
    },
    {
      label: "Keep showcase on react 18",
      packages: ["@website/showcase"],
      dependencies: ["react", "react-dom", "@types/react", "@types/react-dom"],
      pinVersion: "18.3.x"
    },
    {
      label: "Keep showcase on pinned three.js",
      packages: ["@website/showcase"],
      dependencies: ["three", "@types/three"],
      pinVersion: "0.169.0"
    },
    {
      label: "Keep showcase on pinned three-stdlib",
      packages: ["@website/showcase"],
      dependencies: ["three-stdlib"],
      pinVersion: "2.32.2"
    },
    {
      label: "Keep showcase on pinned react-three/drei",
      packages: ["@website/showcase"],
      dependencies: ["@react-three/drei"],
      pinVersion: "9.114.3"
    },
    {
      label: "Keep showcase on pinned react-three/fiber",
      packages: ["@website/showcase"],
      dependencies: ["@react-three/fiber"],
      pinVersion: "8.17.10"
    },
    {
      label: "Keep showcase on pinned react-three/a11y",
      packages: ["@website/showcase"],
      dependencies: ["@react-three/a11y"],
      pinVersion: "^3.0.0"
    },
    {
      label: "Keep showcase on pinned react-three/postprocessing",
      packages: ["@website/showcase"],
      dependencies: ["@react-three/postprocessing"],
      pinVersion: "^2.16.5"
    },
  ],
};

module.exports = config;
