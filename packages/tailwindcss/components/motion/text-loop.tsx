import { resolveElements } from "@solid-primitives/refs";
import type { DOMKeyframesDefinition, Transition } from "motion";
import { createEffect, createSignal, For, type JSX, onCleanup, Show } from "solid-js";
import { AnimatePresence, Motion } from "solid-motion";

import { cx } from "@/components/utils/cva";

export type TextLoopProps = {
  children: JSX.Element;
  class?: string;
  interval?: number;
  initial?: DOMKeyframesDefinition;
  animate?: DOMKeyframesDefinition;
  exit?: DOMKeyframesDefinition;
  transition?: Transition;
  onIndexChange?: (index: number) => void;
  trigger?: boolean;
};

export function TextLoop(props: TextLoopProps) {
  const [currentIndex, setCurrentIndex] = createSignal(0);
  const items = resolveElements(() => props.children);

  function intervalMs() {
    return props.interval ? props.interval * 1000 : 2000;
  }
  let timer: number | undefined;

  createEffect(() => {
    if (timer) clearInterval(timer);

    timer = window.setInterval(() => {
      setCurrentIndex((current) => {
        const next = (current + 1) % items.toArray().length;
        props.onIndexChange?.(next);
        return next;
      });
    }, intervalMs());
  });

  onCleanup(() => {
    if (timer) clearInterval(timer);
  });

  return (
    <div class={cx("relative inline-block whitespace-nowrap", props.class)}>
      <AnimatePresence anchorX="left" mode="popLayout">
        <For each={items.toArray()}>
          {(child, index) => (
            <Show when={currentIndex() === index()}>
              <Motion
                animate={props.animate || { opacity: 1, y: 0 }}
                exit={props.exit || { opacity: 0, y: -20 }}
                initial={props.initial || { opacity: 0, y: 20 }}
                transition={props.transition || { duration: 0.3 }}
              >
                {child}
              </Motion>
            </Show>
          )}
        </For>
      </AnimatePresence>
    </div>
  );
}
