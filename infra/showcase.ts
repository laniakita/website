export const showcase = new sst.aws.Nextjs("Showcase", {
  path: "apps/showcase",
  buildCommand: "bun run build:open-next",
  server: {
    runtime: "nodejs22.x"
  },
  environment: {
    NEXT_PUBLIC_DEPLOYED_URL:
      $app.stage === "production"
        ? "https://showcase.laniakita.com"
        : `https://${$app.stage}.showcase.laniakita.com`,
  },
  domain: {
    name:
      $app.stage === "production"
        ? "showcase.laniakita.com"
        : `${$app.stage}.showcase.laniakita.com`,
    dns: sst.cloudflare.dns(),
  },
});
