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
      label: "Keep showcase (deps) on Next.js 14",
      packages: ["@website/showcase"],
      dependencies: ["next", "@next/bundle-analyzer", "react", "react-dom", "@types/react", "@types/react-dom", "@react-three/drei", "@react-three/fiber", "three", "@types/three", "three-stdlib"],
      isIgnored: true
    },
  ],
};

module.exports = config;
