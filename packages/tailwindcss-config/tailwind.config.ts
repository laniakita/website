import type { Config } from "tailwindcss";
import catppuccin from "@catppuccin/tailwindcss";
import tailwindProse from "@tailwindcss/typography";

const accent = "ctp-mauve";
const invertAccent = "ctp-orange";
const linkColor = "ctp-sky";
const invertLinkColor = "ctp-orange";

// We want each package to be responsible for its own content.
const config: Omit<Config, "content"> = {
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      typography: ({ theme }: { theme: any }) => ({
        catppuccin: {
          css: {
            "--tw-prose-body": theme(`colors.ctp-text.DEFAULT`),
            "--tw-prose-headings": theme("colors.ctp-text.DEFAULT"),
            "--tw-prose-lead": theme("colors.ctp-text.DEFAULT"),
            "--tw-prose-links": theme(`colors.${linkColor}.DEFAULT`),
            "--tw-prose-bold": theme("colors.ctp-text.DEFAULT"),
            "--tw-prose-counters": theme("colors.ctp-text.DEFAULT"),
            "--tw-prose-bullets": theme(`colors.ctp-text.DEFAULT`),
            "--tw-prose-hr": theme(`colors.${accent}.DEFAULT`),
            "--tw-prose-quotes": theme("colors.ctp-text.DEFAULT"),
            "--tw-prose-quote-borders": theme(`colors.${accent}.DEFAULT`),
            "--tw-prose-captions": theme("colors.ctp-text.DEFAULT"),
            "--tw-prose-code": theme("colors.ctp-text.DEFAULT"),
            "--tw-prose-pre-code": theme("colors.ctp-text.DEFAULT"),
            "--tw-prose-pre-bg": theme("colors.ctp-base.DEFAULT"),
            "--tw-prose-th-borders": theme(`colors.${accent}.DEFAULT`),
            "--tw-prose-td-borders": theme(`colors.${accent}.DEFAULT`),
            "--tw-prose-invert-body": theme("colors.ctp-text.DEFAULT"),
            "--tw-prose-invert-headings": theme("colors.ctp-text.DEFAULT"),
            "--tw-prose-invert-lead": theme("colors.ctp-text.DEFAULT"),
            "--tw-prose-invert-links": theme(
              `colors.${invertLinkColor}.DEFAULT`,
            ),
            "--tw-prose-invert-bold": theme("colors.ctp-text.DEFAULT"),
            "--tw-prose-invert-counters": theme("colors.ctp-text.DEFAULT"),
            "--tw-prose-invert-bullets": theme("colors.ctp-text.DEFAULT"),
            "--tw-prose-invert-hr": theme("colors.ctp-text.DEFAULT"),
            "--tw-prose-invert-quotes": theme("colors.ctp-text.DEFAULT"),
            "--tw-prose-invert-quote-borders": theme(
              `colors.${invertAccent}.DEFAULT`,
            ),
            "--tw-prose-invert-captions": theme("colors.ctp-text.DEFAULT"),
            "--tw-prose-invert-code": theme("colors.ctp-text.DEFAULT"),
            "--tw-prose-invert-pre-code": theme("colors.ctp-text.DEFAULT"),
            "--tw-prose-invert-pre-bg": theme("rgb(0 0 0 / 50%)"),
            "--tw-prose-invert-th-borders": theme(
              `colors.${invertAccent}.DEFAULT`,
            ),
            "--tw-prose-invert-td-borders": theme(
              `colors.${invertAccent}.DEFAULT`,
            ),
          },
        },
      }),
    },
  },
  plugins: [tailwindProse, catppuccin({ prefix: "ctp" })],
};
export default config;
