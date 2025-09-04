import { resolveElements } from "@solid-primitives/refs";
import type { AnimatePresenceProps, Transition, Variants } from "motion/react";
import { createEffect, createSignal, For, type JSX, onCleanup, Show } from "solid-js";
import { Motion, Presence } from "solid-motion";

import { cx } from "@/components/utils/cva";

export type TextLoopProps = {
  children: JSX.Element;
  class?: string;
  interval?: number;
  transition?: Transition;
  onIndexChange?: (index: number) => void;
  trigger?: boolean;
  mode?: AnimatePresenceProps["mode"];
};

export function TextLoop(props: TextLoopProps) {
  const [currentIndex, setCurrentIndex] = createSignal(0);
  const items = resolveElements(() => props.children);

  //   useEffect(() => {
  //     if (!trigger) return;

  //     const intervalMs = interval * 1000;
  //     const timer = setInterval(() => {
  //       setCurrentIndex((current) => {
  //         const next = (current + 1) % items.length;
  //         onIndexChange?.(next);
  //         return next;
  //       });
  //     }, intervalMs);
  //     return () => clearInterval(timer);
  //   }, [items.length, interval, onIndexChange, trigger]);
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

  const motionVariants: Variants = {
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    initial: { opacity: 0, y: 20 },
  };

  const childrens = items.toArray();

  createEffect(() => {
    // console.log(currentIndex());
    // console.log(childrens);
    // console.log(childrens[currentIndex()]);
  });

  function child() {
    return (
      <Presence>
        <Motion animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} initial={{ opacity: 0, y: 20 }} transition={props.transition || { duration: 0.3 }}>
          {childrens[currentIndex()]}
        </Motion>
      </Presence>
    );
  }

  return (
    <div class={cx("relative inline-block whitespace-nowrap", props.class)}>
      <For each={childrens}>
        {(child, index) => (
          <Presence exitBeforeEnter={true}>
            <Show when={currentIndex() === index()}>
              <Motion
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                initial={{ opacity: 0, y: 20 }}
                transition={props.transition || { duration: 0.3 }}
              >
                {child}
              </Motion>
            </Show>
          </Presence>
        )}
      </For>
      {/* {child()} */}
      {/* <Motion animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} initial={{ opacity: 0, y: 20 }} transition={props.transition || { duration: 0.3 }}>
          <Show when={currentIndex() === 0}>{childrens[0]}</Show>
        </Motion> */}
    </div>
  );
}
