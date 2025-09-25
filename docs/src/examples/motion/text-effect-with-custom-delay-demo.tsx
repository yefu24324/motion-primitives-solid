import { TextEffect } from "@/components/motion/text-effect";

export function TextEffectWithCustomDelayDemo() {
  return (
    <div class="flex flex-col space-y-0">
      <TextEffect
        delay={0.5}
        per="char"
        variants={{
          container: {
            hidden: {
              opacity: 0,
            },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.05,
              },
            },
          },
          item: {
            hidden: {
              opacity: 0,
              rotateX: 90,
              y: 10,
            },
            visible: {
              opacity: 1,
              rotateX: 0,
              transition: {
                duration: 0.2,
              },
              y: 0,
            },
          },
        }}
      >
        Animate your ideas
      </TextEffect>
      <TextEffect delay={1.5} per="char">
        with motion-primitives
      </TextEffect>
      <TextEffect class="pt-12 text-xs" delay={2.5} per="char" preset="blur">
        (and delay!)
      </TextEffect>
    </div>
  );
}
