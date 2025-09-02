import type { ElementOf } from "@kobalte/core";
import { Polymorphic } from "@kobalte/core";
import { Badge } from "@kobalte/core/badge";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { combineStyle } from "@solid-primitives/props";
import type { VariantProps } from "cva";
import type { Accessor, ComponentProps, JSX, Setter, ValidComponent } from "solid-js";
import { createContext, createEffect, createMemo, createSignal, Match, mergeProps, onCleanup, Show, Switch, splitProps, useContext } from "solid-js";

import { useIsMobile } from "@/components/hooks/use-mobile";
import { callHandler } from "@/components/utils/call-handler";
import { cva, cx } from "@/components/utils/cva";

import { Button } from "./button";
import { Drawer, DrawerContent } from "./drawer";
import { Separator } from "./separator";
import { Skeleton } from "./skeleton";
import { Tooltip, TooltipContent, TooltipPortal, TooltipTrigger } from "./tooltip";

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

interface SidebarContextProps {
  state: Accessor<"expanded" | "collapsed">;
  open: Accessor<boolean>;
  setOpen: Setter<boolean>;
  openMobile: Accessor<boolean>;
  setOpenMobile: Setter<boolean>;
  isMobile: Accessor<boolean>;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextProps | null>(null);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
};

export type SidebarProviderProps = ComponentProps<"div"> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const SidebarProvider = (props: SidebarProviderProps) => {
  const merge = mergeProps<SidebarProviderProps[]>(
    {
      defaultOpen: true,
    },
    props,
  );
  const [, rest] = splitProps(merge, ["defaultOpen", "open", "onOpenChange", "class", "style", "children"]);

  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = createSignal(false);

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = createSignal(merge.defaultOpen);
  const open = createMemo(() => merge.open ?? _open() ?? false);
  const setOpen = (value: boolean | ((value: boolean) => boolean)) => {
    const openState = typeof value === "function" ? value(open()) : value;
    if (merge.onOpenChange) {
      merge.onOpenChange(openState);
    } else {
      _setOpen(openState);
    }

    // This sets the cookie to keep the sidebar state.
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
  };

  // Helper to toggle the sidebar.
  const toggleSidebar = () => {
    if (isMobile()) {
      setOpenMobile((prev) => !prev);
    } else {
      setOpen((prev) => !prev);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      toggleSidebar();
    }
  };

  createEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    onCleanup(() => {
      window.removeEventListener("keydown", handleKeyDown);
    });
  });

  const state = createMemo(() => (open() ? "expanded" : "collapsed"));

  const contextValue: SidebarContextProps = {
    isMobile,
    open,
    openMobile,
    setOpen,
    setOpenMobile,
    state,
    toggleSidebar,
  };

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        class={cx("group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full", merge.class)}
        data-slot="sidebar-wrapper"
        style={combineStyle(
          {
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
          },
          merge.style,
        )}
        {...rest}
      >
        {merge.children}
      </div>
    </SidebarContext.Provider>
  );
};

export type SidebarProps = ComponentProps<"div"> & {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
};

export const Sidebar = (props: SidebarProps) => {
  const merge = mergeProps<SidebarProps[]>(
    {
      collapsible: "offcanvas",
      side: "left",
      variant: "sidebar",
    },
    props,
  );
  const [, rest] = splitProps(merge, ["side", "variant", "collapsible", "class", "children"]);

  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  return (
    <Switch
      fallback={
        <div
          class="text-sidebar-foreground group peer hidden md:block"
          data-collapsible={state() === "collapsed" ? merge.collapsible : ""}
          data-side={merge.side}
          data-slot="sidebar"
          data-state={state()}
          data-variant={merge.variant}
        >
          {/* This is what handles the sidebar gap on desktop */}
          <div
            class={cx(
              "w-(--sidebar-width) relative bg-transparent transition-[width] duration-200 ease-linear",
              "group-data-[collapsible=offcanvas]:w-0",
              "group-data-[side=right]:rotate-180",
              merge.variant === "floating" || merge.variant === "inset"
                ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
                : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)",
            )}
            data-slot="sidebar-gap"
          />
          <div
            class={cx(
              "w-(--sidebar-width) fixed inset-y-0 z-10 hidden h-svh transition-[left,right,width] duration-200 ease-linear md:flex",
              merge.side === "left"
                ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
                : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
              // Adjust the padding for floating and inset variants.
              merge.variant === "floating" || merge.variant === "inset"
                ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
                : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
              merge.class,
            )}
            data-slot="sidebar-container"
            {...rest}
          >
            <div
              class="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm"
              data-sidebar="sidebar"
              data-slot="sidebar-inner"
            >
              {merge.children}
            </div>
          </div>
        </div>
      }
    >
      <Match when={merge.collapsible === "none"}>
        <div class={cx("bg-sidebar text-sidebar-foreground w-(--sidebar-width) flex h-full flex-col", merge.class)} data-slot="sidebar" {...rest}>
          {merge.children}
        </div>
      </Match>
      <Match when={isMobile()}>
        <Drawer onOpenChange={setOpenMobile} open={openMobile()} side={merge.side}>
          <DrawerContent
            class="bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden"
            data-mobile="true"
            data-sidebar="sidebar"
            data-slot="sidebar"
            style={{
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
            }}
          >
            <div class="flex h-full w-full flex-col">{merge.children}</div>
          </DrawerContent>
        </Drawer>
      </Match>
    </Switch>
  );
};

export type SidebarTriggerProps<T extends ValidComponent = "button"> = ComponentProps<typeof Button<T>>;

export const SidebarTrigger = <T extends ValidComponent = "button">(props: SidebarTriggerProps<T>) => {
  const [, rest] = splitProps(props as SidebarTriggerProps, ["class", "onClick"]);
  const { toggleSidebar, open } = useSidebar();

  const handleOnclick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = (event) => {
    callHandler(event, props.onClick);
    toggleSidebar();
  };

  return (
    <Button class={cx("size-7", props.class)} data-sidebar="trigger" data-slot="sidebar-trigger" onClick={handleOnclick} size="icon" variant="ghost" {...rest}>
      <Show
        fallback={
          <svg class="size-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
              <rect height="18" rx="2" width="18" x="3" y="3" />
              <path d="M9 3v18m7-6l-3-3l3-3" />
            </g>
          </svg>
        }
        when={!open()}
      >
        <svg class="size-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <rect height="18" rx="2" width="18" x="3" y="3" />
            <path d="M9 3v18m5-12l3 3l-3 3" />
          </g>
        </svg>
      </Show>
    </Button>
  );
};

export type SidebarRailProps = ComponentProps<"button">;

export const SidebarRail = (props: SidebarRailProps) => {
  const { toggleSidebar } = useSidebar();
  const [, rest] = splitProps(props, ["class", "onClick"]);

  return (
    <button
      aria-label="Toggle Sidebar"
      class={cx(
        "hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        props.class,
      )}
      data-sidebar="rail"
      data-slot="sidebar-rail"
      onClick={toggleSidebar}
      tabIndex={-1}
      title="Toggle Sidebar"
      {...rest}
    />
  );
};

export type SidebarInsetProps = ComponentProps<"main">;

export const SidebarInset = (props: SidebarInsetProps) => {
  const [, rest] = splitProps(props, ["class"]);

  return (
    <main
      class={cx(
        "bg-background relative flex w-full flex-1 flex-col",
        "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm",
        props.class,
      )}
      data-slot="sidebar-inset"
      {...rest}
    />
  );
};

export type SidebarHeaderProps = ComponentProps<"div">;

export const SidebarHeader = (props: SidebarHeaderProps) => {
  const [, rest] = splitProps(props, ["class"]);

  return <div class={cx("flex flex-col gap-2 p-2", props.class)} data-sidebar="header" data-slot="sidebar-header" {...rest} />;
};

export type SidebarFooterProps = ComponentProps<"div">;

export const SidebarFooter = (props: SidebarFooterProps) => {
  const [, rest] = splitProps(props, ["class"]);

  return <div class={cx("flex flex-col gap-2 p-2", props.class)} data-sidebar="footer" data-slot="sidebar-footer" {...rest} />;
};

export type SidebarSeparatorProps<T extends ValidComponent = "hr"> = ComponentProps<typeof Separator<T>>;

export const SidebarSeparator = (props: SidebarSeparatorProps) => {
  const [, rest] = splitProps(props, ["class"]);

  return <Separator class={cx("flex flex-col gap-2 p-2", props.class)} data-sidebar="header" data-slot="sidebar-separator" {...rest} />;
};

export type SidebarContentProps = ComponentProps<"div">;

export const SidebarContent = (props: SidebarContentProps) => {
  const [, rest] = splitProps(props, ["class"]);

  return (
    <div
      class={cx("flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden", props.class)}
      data-sidebar="content"
      data-slot="sidebar-content"
      {...rest}
    />
  );
};

export type SidebarGroupProps = ComponentProps<"div">;

export const SidebarGroup = (props: SidebarGroupProps) => {
  const [, rest] = splitProps(props, ["class"]);

  return <div class={cx("relative flex w-full min-w-0 flex-col p-2", props.class)} data-sidebar="group" data-slot="sidebar-group" {...rest} />;
};

export interface SidebarGroupLabelCommonProps<_T extends HTMLElement = HTMLElement> {
  class?: string;
}

export type SidebarGroupLabelProps<T extends ValidComponent | HTMLElement = HTMLElement> = Partial<SidebarGroupLabelCommonProps<ElementOf<T>>>;

export const SidebarGroupLabel = <T extends ValidComponent = "div">(props: PolymorphicProps<T, SidebarGroupLabelProps<T>>) => {
  const merge = mergeProps(
    {
      as: "div",
    } as PolymorphicProps<T, SidebarGroupLabelProps<T>>,
    props,
  );
  const [, rest] = splitProps(merge, ["as", "class"]);

  return (
    <Polymorphic
      as={merge.as}
      class={cx(
        "text-sidebar-foreground/70 ring-sidebar-ring outline-hidden flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        merge.class,
      )}
      data-sidebar="group-label"
      data-slot="sidebar-group-label"
      {...rest}
    />
  );
};

export interface SidebarGroupActionCommonProps<_T extends HTMLElement = HTMLElement> {
  class?: string;
}

export type SidebarGroupActionProps<T extends ValidComponent | HTMLElement = HTMLElement> = Partial<SidebarGroupActionCommonProps<ElementOf<T>>>;

export const SidebarGroupAction = <T extends ValidComponent = "button">(props: PolymorphicProps<T, SidebarGroupActionProps<T>>) => {
  const merge = mergeProps(
    {
      as: "button",
    } as PolymorphicProps<T, SidebarGroupActionProps<T>>,
    props,
  );
  const [, rest] = splitProps(merge, ["as", "class"]);

  return (
    <Polymorphic
      as={merge.as}
      class={cx(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground outline-hidden absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 md:after:hidden",
        "group-data-[collapsible=icon]:hidden",
        merge.class,
      )}
      data-sidebar="group-action"
      data-slot="sidebar-group-action"
      {...rest}
    />
  );
};

export type SidebarGroupContentProps = ComponentProps<"div">;

export const SidebarGroupContent = (props: SidebarGroupContentProps) => {
  const [, rest] = splitProps(props, ["class"]);

  return <div class={cx("w-full text-sm", props.class)} data-sidebar="group-content" data-slot="sidebar-group-content" {...rest} />;
};

export type SidebarMenuProps = ComponentProps<"ul">;

export const SidebarMenu = (props: SidebarMenuProps) => {
  const [, rest] = splitProps(props, ["class"]);

  return <ul class={cx("flex w-full min-w-0 flex-col gap-1", props.class)} data-sidebar="menu" data-slot="sidebar-menu" {...rest} />;
};

export type SidebarMenuItemProps = ComponentProps<"li">;

export const SidebarMenuItem = (props: SidebarMenuItemProps) => {
  const [, rest] = splitProps(props, ["class"]);

  return <li class={cx("group/menu-item relative", props.class)} data-sidebar="menu-item" data-slot="sidebar-menu-item" {...rest} />;
};

export const SidebarMenuButtonVariants = cva({
  base: "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  defaultVariants: {
    size: "default",
    variant: "default",
  },
  variants: {
    size: {
      default: "h-8 text-sm",
      lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!",
      sm: "h-7 text-xs",
    },
    variant: {
      default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      outline:
        "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
    },
  },
});

export type SidebarMenuButtonOptions = VariantProps<typeof SidebarMenuButtonVariants> & {
  isActive?: boolean;
  tooltip?: string | ComponentProps<typeof TooltipContent>;
};

export interface SidebarMenuButtonCommonProps<_T extends HTMLElement = HTMLElement> {
  class?: string;
}

export type SidebarMenuButtonProps<T extends ValidComponent = "button"> = SidebarMenuButtonOptions & Partial<SidebarMenuButtonCommonProps<ElementOf<T>>>;

export const SidebarMenuButton = <T extends ValidComponent = "button">(props: PolymorphicProps<T, SidebarMenuButtonProps<T>>) => {
  const merge = mergeProps(
    {
      as: "button",
      isActive: false,
    } as PolymorphicProps<T, SidebarMenuButtonProps<T>>,
    props,
  );
  const [, rest] = splitProps(merge, ["as", "class", "isActive", "size", "variant", "tooltip"]);
  const { isMobile, state } = useSidebar();

  return (
    <Show
      fallback={
        <Tooltip placement="right">
          <TooltipTrigger
            as={merge.as}
            class={SidebarMenuButtonVariants({
              class: merge.class,
              size: merge.size,
              variant: merge.variant,
            })}
            data-active={merge.isActive}
            data-sidebar="menu-button"
            data-size={merge.size}
            data-slot="sidebar-menu-button"
            {...rest}
          />
          <TooltipPortal>
            <TooltipContent
              hidden={state() === "expanded" || isMobile()}
              {...(typeof merge.tooltip === "string" ? { children: merge.tooltip } : merge.tooltip)}
            />
          </TooltipPortal>
        </Tooltip>
      }
      when={!merge.tooltip && state() === "collapsed"}
    >
      <Polymorphic
        as={merge.as}
        class={SidebarMenuButtonVariants({
          class: merge.class,
          size: merge.size,
          variant: merge.variant,
        })}
        data-active={merge.isActive}
        data-sidebar="menu-button"
        data-size={merge.size}
        data-slot="sidebar-menu-button"
        {...rest}
      />
    </Show>
  );
};

export interface SidebarMenuActionOptions {
  showOnHover?: boolean;
}

export interface SidebarMenuActionCommonProps<_T extends HTMLElement = HTMLElement> {
  class?: string;
}

export type SidebarMenuActionProps<T extends ValidComponent = "button"> = SidebarMenuActionOptions & Partial<SidebarMenuActionCommonProps<ElementOf<T>>>;

export const SidebarMenuAction = <T extends ValidComponent = "button">(props: PolymorphicProps<T, SidebarMenuActionProps<T>>) => {
  const merge = mergeProps(
    {
      as: "button",
      showOnHover: false,
    } as PolymorphicProps<T, SidebarMenuActionProps<T>>,
    props,
  );
  const [, rest] = splitProps(merge, ["as", "class", "showOnHover"]);

  return (
    <Polymorphic
      as={merge.as}
      class={cx(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground outline-hidden absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 md:after:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        merge.showOnHover &&
          "peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0",
        merge.class,
      )}
      data-sidebar="menu-action"
      data-slot="sidebar-menu-action"
      {...rest}
    />
  );
};

export type SidebarMenuBadgeProps<T extends ValidComponent = "span"> = ComponentProps<typeof Badge<T>>;

export const SidebarMenuBadge = <T extends ValidComponent = "span">(props: SidebarMenuBadgeProps<T>) => {
  const [, rest] = splitProps(props as SidebarMenuBadgeProps, ["class"]);

  return (
    <Badge
      class={cx(
        "text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums",
        "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        props.class,
      )}
      data-sidebar="menu-badge"
      data-slot="sidebar-menu-badge"
      {...rest}
    />
  );
};

export type SidebarMenuSkeletonProps = ComponentProps<"div"> & {
  showIcon?: boolean;
};

export const SidebarMenuSkeleton = (props: SidebarMenuSkeletonProps) => {
  const merge = mergeProps(
    {
      showIcon: false,
    } as SidebarMenuSkeletonProps,
    props,
  );
  const [, rest] = splitProps(merge, ["class", "showIcon"]);

  const width = createMemo(() => `${Math.floor(Math.random() * 40) + 50}%`);

  return (
    <div class={cx("flex h-8 items-center gap-2 rounded-md px-2", props.class)} data-sidebar="menu-skeleton" data-slot="sidebar-menu-skeleton" {...rest}>
      <Show when={merge.showIcon}>
        <Skeleton class="size-4 rounded-md" data-sidebar="menu-skeleton-icon" />
      </Show>
      <Skeleton
        class="max-w-(--skeleton-width) h-4 flex-1"
        data-sidebar="menu-skeleton-text"
        style={{
          "--skeleton-width": width(),
        }}
      />
    </div>
  );
};

export type SidebarMenuSub = ComponentProps<"ul">;

export const SidebarMenuSub = (props: SidebarMenuSub) => {
  const [, rest] = splitProps(props, ["class"]);

  return (
    <ul
      class={cx(
        "border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5",
        "group-data-[collapsible=icon]:hidden",
        props.class,
      )}
      data-sidebar="menu-sub"
      data-slot="sidebar-menu-sub"
      {...rest}
    />
  );
};

export type SidebarMenuSubItem = ComponentProps<"li">;

export const SidebarMenuSubItem = (props: SidebarMenuSubItem) => {
  const [, rest] = splitProps(props, ["class"]);

  return <li class={cx("group/menu-sub-item relative", props.class)} data-sidebar="menu-sub-item" data-slot="sidebar-menu-sub-item" {...rest} />;
};

export interface SidebarMenuSubButtonOptions {
  isActive?: boolean;
  size?: "sm" | "md";
}

export interface SidebarMenuSubButtonCommonProps<_T extends HTMLElement = HTMLElement> {
  class?: string;
}

export type SidebarMenuSubButtonProps<T extends ValidComponent = "a"> = SidebarMenuSubButtonOptions & Partial<SidebarMenuSubButtonCommonProps<ElementOf<T>>>;

export const SidebarMenuSubButton = <T extends ValidComponent = "a">(props: PolymorphicProps<T, SidebarMenuSubButtonProps<T>>) => {
  const merge = mergeProps(
    {
      as: "a",
      isActive: false,
      size: "md",
    } as PolymorphicProps<T, SidebarMenuSubButtonProps<T>>,
    props,
  );
  const [, rest] = splitProps(merge, ["as", "class", "isActive", "size"]);

  return (
    <Polymorphic
      as={merge.as}
      class={cx(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground outline-hidden flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        merge.size === "sm" && "text-xs",
        merge.size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        merge.class,
      )}
      data-active={merge.isActive}
      data-sidebar="menu-sub-button"
      data-size={merge.size}
      data-slot="sidebar-menu-sub-button"
      {...rest}
    />
  );
};
