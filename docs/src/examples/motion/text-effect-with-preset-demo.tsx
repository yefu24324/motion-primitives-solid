import { TextEffect } from "@/components/motion/text-effect";

export function TextEffectWithPresetDemo() {
  return (
    <TextEffect as="h3" per="word" preset="slide">
      Animate your ideas with motion-primitives
    </TextEffect>
  );
}
