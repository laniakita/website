import type { OpenNextConfig } from '@opennextjs/aws/types/open-next.js';

const config = {
  default: {
    install: {
      packages: ["sharp@0.33"],
      arch: "x64",
      nodeVersion: "22"
    },
  },
  imageOptimization: {
    install: {
      packages: ["sharp@0.33"],
      arch: "x64",
      nodeVersion: "22"
    },
  },
  buildCommand: 'exit 0', // in my example we set up Nx task distribution to handle the order of building.
} satisfies OpenNextConfig;

export default config;

