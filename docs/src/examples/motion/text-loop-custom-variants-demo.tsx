import { TextLoop } from "@/components/motion/text-loop";

export function TextLoopCustomVariantsDemo() {
  return (
    <p class="inline-flex whitespace-pre-wrap text-sm">
      Beautiful templates for{" "}
      <TextLoop
        animate={{
          filter: "blur(0px)",
          opacity: 1,
          rotateX: 0,
          y: 0,
        }}
        class="overflow-y-clip"
        exit={{
          filter: "blur(4px)",
          opacity: 0,
          position: "absolute",
          rotateX: -90,
          top: 0,
          y: -20,
        }}
        initial={{
          filter: "blur(4px)",
          opacity: 0,
          rotateX: 90,
          y: 20,
        }}
        transition={{
          damping: 80,
          mass: 10,
          stiffness: 900,
          type: "spring",
        }}
      >
        <span>Founders</span>
        <span>Developers</span>
        <span>Designers</span>
        <span>Design Engineers</span>
      </TextLoop>
    </p>
  );
}
