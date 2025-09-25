import type { Variants } from "solid-motion";

import { TextEffect } from "@/components/motion/text-effect";

export function TextEffectWithCustomVariantsDemo() {
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const fancyVariants = {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.05,
        },
      },
    } as Variants,
    item: {
      hidden: () => ({
        color: getRandomColor(),
        opacity: 0,
        rotate: Math.random() * 90 - 45,
        scale: 0.3,
        y: Math.random() * 100 - 50,
      }),
      visible: {
        color: getRandomColor(),
        opacity: 1,
        rotate: 0,
        scale: 1,
        transition: {
          damping: 12,
          stiffness: 200,
          type: "spring",
        },
        y: 0,
      },
    } as Variants,
  };

  return (
    <TextEffect per="word" variants={fancyVariants}>
      Animate your ideas with motion-primitives
    </TextEffect>
  );
}
