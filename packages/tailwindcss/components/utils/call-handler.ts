// https://github.com/kobaltedev/kobalte/blob/main/packages/utils/src/assertion.ts
// https://github.com/kobaltedev/kobalte/blob/main/packages/utils/src/events.ts

import type { JSX } from "solid-js";

// Function assertions
export const isFunction = (value: unknown): value is Function => typeof value === "function";

/** Call a JSX.EventHandlerUnion with the event. */
export const callHandler = <T, E extends Event>(event: E & { currentTarget: T; target: Element }, handler: JSX.EventHandlerUnion<T, E> | undefined) => {
  if (handler) {
    if (isFunction(handler)) {
      handler(event);
    } else {
      handler[0](handler[1], event);
    }
  }

  return event.defaultPrevented;
};
