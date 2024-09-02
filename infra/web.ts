const appUrl = new sst.Linkable("APP_URL", {
  properties: {
    url:
      $app.stage === "production"
        ? "https://laniakita.com"
        : `https://${$app.stage}.laniakita.com`,
  },
});

export const web = new sst.aws.Nextjs("Web", {
  path: "apps/web",
  openNextVersion: "3.1.1",
  buildCommand: "turbo build:open-next",
  link: [appUrl],
  server: {
    layers: [process.env.SHARP_ARN_01],
  },
  environment: {
    NEXT_PUBLIC_DEPLOYED_URL:
      $app.stage === "production"
        ? "https://laniakita.com"
        : `https://${$app.stage}.laniakita.com`,
  },
  domain: {
    name:
      $app.stage === "production"
        ? "laniakita.com"
        : `${$app.stage}.laniakita.com`,
    dns: sst.cloudflare.dns(),
  },
});
