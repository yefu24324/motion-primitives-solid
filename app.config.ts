import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
/* @ts-expect-error */
import pkg from "@vinxi/plugin-mdx";
import { type Options, rehypePrettyCode } from "rehype-pretty-code";
import codeImport from "remark-code-import";
import remarkFrontmatter from "remark-frontmatter";
import remarkGFM from "remark-gfm";
import tsConfigPaths from "vite-tsconfig-paths";

const { default: mdx } = pkg;
export default defineConfig({
  appRoot: "./docs/src",
  extensions: ["mdx", "md"],
  server: {
    prerender: {
      crawlLinks: true,
    },
  },
  vite: {
    plugins: [
      tailwindcss(),
      tsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
      mdx.withImports({})({
        jsx: true,
        jsxImportSource: "solid-js",
        providerImportSource: "solid-mdx",
        rehypePlugins: [
          [
            rehypePrettyCode,
            {
              theme: {
                dark: "github-dark",
                light: "github-light-default",
              },
              transformers: [],
            } satisfies Options,
          ],
        ],
        remarkPlugins: [
          remarkGFM,
          remarkFrontmatter,
          [
            codeImport,
            {
              allowImportingFromOutside: true,
            } satisfies Parameters<typeof codeImport>[0],
          ],
        ],
      }),
    ],
  },
});
