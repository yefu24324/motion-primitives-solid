export interface TNavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  indicator?: "new" | "updated";
}

export type TSidebarNavItem = TNavItem & {
  items: TSidebarNavItem[];
};

export type TNavItemWithChildren = TNavItem & {
  items: TNavItemWithChildren[];
};

export interface TDocsConfig {
  mainNav: TNavItem[];
  sidebarNav: TSidebarNavItem[];
}

export const docsConfig: TDocsConfig = {
  mainNav: [
    {
      href: "/docs/introduction",
      title: "Docs",
    },
    {
      href: "/docs/components/accordion",
      title: "Components",
    },
    // {
    //   title: "Blocks",
    //   href: "/blocks",
    // },
    {
      href: "/charts/area",
      title: "Charts",
    },
  ],
  sidebarNav: [
    {
      items: [
        {
          href: "/docs/introduction",
          items: [],
          title: "Introduction",
        },
      ],
      title: "Get Started",
    },
    {
      items: [
        {
          href: "/docs/solid-motion/overview",
          items: [],
          title: "Overview",
        },
        {
          href: "/docs/solid-motion/layout-animations",
          items: [],
          title: "Layout",
        },
      ],
      title: "Solid Motion",
    },
    {
      items: [
        {
          href: "/docs/animate-ui/components/cursor",
          items: [],
          title: "Cursor",
        },
        {
          href: "/docs/animate-ui/effects/motion-effect",
          items: [],
          title: "Motion Effect",
        },
      ],
      title: "Animate UI",
    },
    {
      items: [
        {
          href: "/docs/shadcn-ui/accordion",
          items: [],
          title: "Accordion",
        },
        {
          href: "/docs/shadcn-ui/collapsible",
          items: [],
          title: "Collapsible",
        },
      ],
      title: "Animate UI / Shadcn",
    },
    {
      items: [
        {
          href: "/docs/motion/text-loop",
          items: [],
          title: "Text Loop",
        },
      ],
      title: "Motion Primitives",
    },
  ],
};
