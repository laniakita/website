/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: "website",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          region: "us-west-2",
          profile: input.stage === "production" ? "lani-production" : "lani-dev"
        },
        cloudflare: true,
      },
    };
  },
  async run() {
    await import("./infra");
  },
});
