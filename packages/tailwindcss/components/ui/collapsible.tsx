import { Collapsible as CollapsiblePrimitive, useCollapsibleContext } from "@kobalte/core/collapsible";
import type { ComponentProps, ValidComponent } from "solid-js";
import { Show, splitProps } from "solid-js";
import { Motion, Presence } from "solid-motion";

import { cx } from "@/components/utils/cva";

export type CollapsibleProps<T extends ValidComponent = "div"> = ComponentProps<typeof CollapsiblePrimitive<T>>;

export const Collapsible = <T extends ValidComponent = "div">(props: CollapsibleProps<T>) => {
  return <CollapsiblePrimitive data-slot="collapsible" {...props} />;
};

export type CollapsibleTriggerProps<T extends ValidComponent = "button"> = ComponentProps<typeof CollapsiblePrimitive.Trigger<T>>;

export const CollapsibleTrigger = <T extends ValidComponent = "button">(props: CollapsibleTriggerProps<T>) => {
  return <CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" {...props} />;
};

export type CollapsibleContentProps<T extends ValidComponent = "button"> = ComponentProps<typeof CollapsiblePrimitive.Content<T>>;

export const CollapsibleContent = <T extends ValidComponent = "button">(props: CollapsibleContentProps<T>) => {
  const [, rest] = splitProps(props as CollapsibleContentProps, ["class"]);
  const context = useCollapsibleContext();

  return (
    <Presence>
      <Show when={context.isOpen()}>
        <CollapsiblePrimitive.Content
          animate={{ height: "auto", opacity: 1, overflow: "hidden" }}
          as={Motion}
          class={cx("data-[closed]:animate-collapsible-up data-[expanded]:animate-collapsible-down overflow-hidden", props.class)}
          data-slot="collapsible-content"
          exit={{ height: 0, opacity: 0, overflow: "hidden" }}
          initial={{ height: 0, opacity: 0, overflow: "hidden" }}
          transition={{ damping: 22, stiffness: 150, type: "spring" }}
          {...rest}
        />
      </Show>
    </Presence>
  );
};
