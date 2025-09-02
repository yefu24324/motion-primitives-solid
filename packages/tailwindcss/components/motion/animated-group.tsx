import { resolveElements } from "@solid-primitives/refs";
import type { Variants } from "motion/react";
import { createMemo, For, type JSX } from "solid-js";
import { Motion } from "solid-motion";

export type PresetType = "fade" | "slide" | "scale" | "blur" | "blur-slide" | "zoom" | "flip" | "bounce" | "rotate" | "swing";

export type AnimatedGroupProps = {
  class?: string;
  children: JSX.Element;
  // variants?: {
  //   container?: Variants;
  //   item?: Variants;
  // };
  preset?: PresetType;
  // as?: React.ElementType;
  // asChild?: React.ElementType;
};

const defaultContainerVariants: Variants = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const defaultItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const presetVariants: Record<PresetType, Variants> = {
  blur: {
    hidden: { filter: "blur(4px)" },
    visible: { filter: "blur(0px)" },
  },
  "blur-slide": {
    hidden: { filter: "blur(4px)", y: 20 },
    visible: { filter: "blur(0px)", y: 0 },
  },
  bounce: {
    hidden: { y: -50 },
    visible: {
      transition: { damping: 10, stiffness: 400, type: "spring" },
      y: 0,
    },
  },
  fade: {},
  flip: {
    hidden: { rotateX: -90 },
    visible: {
      rotateX: 0,
      transition: { damping: 20, stiffness: 300, type: "spring" },
    },
  },
  rotate: {
    hidden: { rotate: -180 },
    visible: {
      rotate: 0,
      transition: { damping: 15, stiffness: 200, type: "spring" },
    },
  },
  scale: {
    hidden: { scale: 0.8 },
    visible: { scale: 1 },
  },
  slide: {
    hidden: { y: 20 },
    visible: { y: 0 },
  },
  swing: {
    hidden: { rotate: -10 },
    visible: {
      rotate: 0,
      transition: { damping: 8, stiffness: 300, type: "spring" },
    },
  },
  zoom: {
    hidden: { scale: 0.5 },
    visible: {
      scale: 1,
      transition: { damping: 20, stiffness: 300, type: "spring" },
    },
  },
};

const addDefaultVariants = (variants: Variants) => ({
  hidden: { ...defaultItemVariants.hidden, ...variants.hidden },
  visible: { ...defaultItemVariants.visible, ...variants.visible },
});

function AnimatedGroup(props: AnimatedGroupProps) {
  // const selectedVariants = {
  //   item: addDefaultVariants(preset ? presetVariants[preset] : {}),
  //   container: addDefaultVariants(defaultContainerVariants),
  // };
  // const containerVariants = variants?.container || selectedVariants.container;
  // const itemVariants = variants?.item || selectedVariants.item;

  // const MotionComponent = React.useMemo(
  //   () => motion.create(as as keyof JSX.IntrinsicElements),
  //   [as]
  // );
  // const MotionChild = React.useMemo(
  //   () => motion.create(asChild as keyof JSX.IntrinsicElements),
  //   [asChild]
  // );
  const selectedVariants = createMemo(() => {
    return {
      container: addDefaultVariants(defaultContainerVariants),
      item: addDefaultVariants(props.preset ? presetVariants[props.preset] : {}),
    };
  });
  const children = resolveElements(() => props.children);

  return (
    <Motion animate={selectedVariants().container.visible} class={props.class} initial={selectedVariants().container.hidden}>
      <For each={children.toArray()}>
        {(child) => (
          <Motion animate={selectedVariants().item.visible} initial={selectedVariants().item.hidden}>
            {child.localName}: {child}
          </Motion>
        )}
      </For>
    </Motion>
  );
}

export { AnimatedGroup };
