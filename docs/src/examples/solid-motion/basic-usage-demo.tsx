import { Motion } from "solid-motion";

export function BasicUsageDemo() {
  return (
    <Motion animate={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ duration: 2 }}>
      Hello World
    </Motion>
  );
}
