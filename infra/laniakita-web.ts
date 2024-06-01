const secrets = {
  tursoUrl: new sst.Secret("TursoUrl"),
  tursoAuth: new sst.Secret("TursoAuth"),
  sharpLayer: new sst.Secret("SharpLayer"),
};

const allSecrets = Object.values(secrets);

export const laniakitaWeb = new sst.aws.Nextjs("LaniAkitaWeb", {
  path: "apps/laniakita-web",
  openNextVersion: "3.0.2",
  link: [...allSecrets],
  buildCommand: "bun run open-next-build",
  domain: {
    name: $app.stage === "production" ? "laniakita.com" : `${$app.stage}.laniakita.com`,
    dns: sst.cloudflare.dns()
  },
  transform: {
    server: (args) => {
      args.nodejs = {
        esbuild: {
          external: ["sharp"],
        },
      };
      args.layers = [secrets.sharpLayer.value];
    },
  },
});
