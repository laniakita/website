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
      label: "eslint compatible with turbo/next.js",
      dependencies: ["eslint"],
      pinVersion: "^8.57.0"
    },
    {
      label: "eslint types compatible with turbo/next.js",
      dependencies: ["@types/eslint"],
      pinVersion: "^8.56.10"
    }
  ],
};

module.exports = config;
