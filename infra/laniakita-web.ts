export const laniakitaWeb = new sst.aws.Nextjs("LaniAkitaWeb", {
  path: "apps/laniakita-web",
  environment: {
    TURSO_CONNECTION_URL: process.env.TURSO_CONNECTION_URL!,
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN!
  }
});
