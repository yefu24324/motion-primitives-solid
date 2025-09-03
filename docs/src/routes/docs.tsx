import type { RouteSectionProps } from "@solidjs/router";
import type { JSX } from "solid-js";
// @ts-expect-error
import { MDXProvider } from "solid-mdx";

import { SidebarProvider } from "@/components/ui/sidebar";
import DocsSidebar from "@/components/website/docs-sidebar";
import { mdxCustomComponents } from "@/components/website/mdx";

export default function DocsPage(props: RouteSectionProps) {
  return (
    <div class="container-wrapper flex flex-1 flex-col">
      <SidebarProvider class="min-h-min flex-1 items-start px-0 [--sidebar-width:220px] [--top-spacing:0] lg:grid lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)] lg:[--sidebar-width:240px] lg:[--top-spacing:calc(var(--spacing)*4)]">
        <DocsSidebar />
        <div class="size-full">
          <MDXProvider components={mdxCustomComponents}>
            <DocsMain>{props.children}</DocsMain>
          </MDXProvider>
        </div>
      </SidebarProvider>
    </div>
  );
}

function DocsMain(props: { children: JSX.Element }) {
  return (
    <div class="flex items-stretch text-[1.05rem] sm:text-[15px] xl:w-full" data-slot="docs">
      <div class="mx-auto flex w-full max-w-2xl min-w-0 flex-1 flex-col gap-8 px-4 py-6 text-neutral-800 md:px-0 lg:py-8 dark:text-neutral-300">
        <div class="w-full flex-1 *:data-[slot=alert]:first:mt-0">{props.children}</div>
      </div>
    </div>
  );
}
