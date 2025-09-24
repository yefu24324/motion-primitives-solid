import { TextEffect } from "@/components/motion/text-effect";

export function TextEffectPerWordDemo() {
  return (
    <TextEffect as="h3" per="word" preset="blur">
      Animate your ideas with motion-primitives
    </TextEffect>
  );
}
