import { createSignal } from "solid-js";
import { animateView, Motion } from "solid-motion";

import { cx } from "@/components/utils/cva";

export function BasicLayoutFlexSwitchDemo() {
  const [isOn, setIsOn] = createSignal(false);
  return (
    <button
      class={cx("w-24 h-12 bg-white/40 p-2 rounded-full flex items-center", isOn() ? "justify-end" : "justify-start")}
      onClick={() =>
        animateView(() => {
          setIsOn(!isOn());
        })
      }
    >
      <Motion
        class="w-10 h-10 bg-white rounded-full"
        layout
        transition={{
          bounce: 0.2,
          type: "spring",
          visualDuration: 0.2,
        }}
      />
    </button>
  );
}
