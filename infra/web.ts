export const web = new sst.aws.Nextjs("Web", {
  path: "apps/web",
  openNextVersion: "3.1.1",
  buildCommand: "bun run build:open-next",
  server: {
    install: ["sharp"]
  },
  environment: {
    DEPLOYED_URL: $app.stage === "production" ? "https://laniakita.com" : `https://${$app.stage}.laniakita.com`,
  },
  domain: {
    name: $app.stage === "production" ? "laniakita.com" : `${$app.stage}.laniakita.com`,
    dns: sst.cloudflare.dns()
  },
});
