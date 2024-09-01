export const web = new sst.aws.Nextjs("Web", {
  path: "apps/web",
  openNextVersion: "3.1.1",
  buildCommand: "bun run build:open-next",
  server: {
    install: ["sharp"],
  },
  /*transform: {
    server: {
      url: true,
      nodejs: {
        install: ["plaiceholder", "sharp"]
      },
      copyFiles: [
        {from: "public/assets/images/blog"}
      ],
    },
  }*/
  environment: {
    DEPLOYED_URL: $app.stage === "production" ? "https://laniakita.com" : `https://${$app.stage}.laniakita.com`,
  },
  domain: {
    name: $app.stage === "production" ? "laniakita.com" : `${$app.stage}.laniakita.com`,
    dns: sst.cloudflare.dns()
  },
});
