import { useLocation } from "@solidjs/router";
import type { ComponentProps } from "solid-js";
import { For, splitProps } from "solid-js";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cx } from "@/components/utils/cva";
import { docsConfig } from "@/config/docs";

const DocsSidebar = (props: ComponentProps<typeof Sidebar>) => {
  const location = useLocation();
  return (
    <Sidebar
      class="sticky top-[calc(var(--header-height)+1px)] z-30 hidden h-[calc(100svh-var(--header-height)-var(--footer-height))] bg-transparent lg:flex"
      collapsible="none"
      {...props}
    >
      <SidebarContent class="no-scrollbar px-2 pb-12">
        <div class="h-(--top-spacing) shrink-0" />
        <For each={docsConfig.sidebarNav}>
          {(item) => (
            <SidebarGroup>
              <SidebarGroupLabel class="text-muted-foreground font-medium">{item.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu class="gap-0.5">
                  <For each={item.items}>
                    {(item) => (
                      <SidebarMenuItem
                        class="data-[indicator]:before:ring-background w-fit data-[indicator]:before:absolute data-[indicator]:before:top-0 data-[indicator]:before:-right-0.5 data-[indicator]:before:z-10 data-[indicator]:before:size-1.5 data-[indicator]:before:rounded-full data-[indicator]:before:ring-2 data-[indicator=new]:before:bg-green-500 data-[indicator=updated]:before:bg-blue-500"
                        data-indicator={item.indicator}
                      >
                        <SidebarMenuButton<typeof SidebarMenuButton>
                          as={(props) => {
                            const [local, rest] = splitProps(props, ["class"]);

                            return (
                              <a
                                activeProps={{
                                  class: "bg-accent border-accent",
                                }}
                                class={cx(
                                  local.class,
                                  "relative h-[30px] overflow-visible border border-transparent text-[0.8rem] font-medium after:absolute after:inset-x-0 after:-inset-y-1 after:z-0 after:rounded-md aria-disabled:pointer-events-none aria-disabled:opacity-40 aria-disabled:select-none",
                                )}
                                disabled={item.disabled}
                                href={item.href}
                                {...rest}
                              >
                                {item.title}
                              </a>
                            );
                          }}
                          isActive={item.href === location.pathname}
                        />
                      </SidebarMenuItem>
                    )}
                  </For>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </For>
      </SidebarContent>
    </Sidebar>
  );
};

export default DocsSidebar;
