export const laniakitaWeb = new sst.aws.Nextjs("LaniAkitaWeb", {
  path: "apps/laniakita-web",
  openNextVersion: "3.0.2",
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
      args.layers = [$app.stage === "production" ? secrets.sharpLayer.value : secrets.devSharpLayer.value];
    },
  },
});
