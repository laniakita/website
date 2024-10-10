export const web = new sst.aws.Nextjs("Web", {
  path: "apps/showcase",
  buildCommand: "turbo build:open-next",
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
