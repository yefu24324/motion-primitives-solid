import { Music } from "lucide-solid";
import { createSignal } from "solid-js";

import { TextLoop } from "@/components/motion/text-loop";

export function TextLoopOnIndexChangeDemo() {
  const [direction, setDirection] = createSignal(1);

  return (
    <TextLoop
      class="text-sm"
      interval={2.5}
      onIndexChange={(index) => {
        setDirection(index === 0 ? -1 : 1);
      }}
      transition={{
        damping: 19,
        mass: 1.2,
        stiffness: 150,
        type: "spring",
      }}
      variants={{
        animate: {
          filter: "blur(0px)",
          opacity: 1,
          rotateX: 0,
          y: 0,
        },
        exit: {
          filter: "blur(4px)",
          opacity: 0,
          rotateX: -direction() * 90,
          y: -direction() * 20,
        },
        initial: {
          filter: "blur(4px)",
          opacity: 0,
          rotateX: direction() * 90,
          y: direction() * 20,
        },
      }}
    >
      <span>
        <Music class="mr-1 inline-block" size={12} />A Little Lost・Arthur Russell
      </span>
      <span>La Trinité, Martinique</span>
    </TextLoop>
  );
}
