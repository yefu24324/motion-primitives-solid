import { Accordion as AccordionPrimitive } from "@kobalte/core/accordion";
import type { ComponentProps, ValidComponent } from "solid-js";
import { splitProps } from "solid-js";

import { cx } from "@/components/utils/cva";

export type AccordionProps<T extends ValidComponent = "div"> = ComponentProps<typeof AccordionPrimitive<T>>;

export const Accordion = <T extends ValidComponent = "div">(props: AccordionProps<T>) => {
  return <AccordionPrimitive data-slot="accordion" {...props} />;
};

export type AccordionItemProps<T extends ValidComponent = "div"> = ComponentProps<typeof AccordionPrimitive.Item<T>>;

export const AccordionItem = <T extends ValidComponent = "div">(props: AccordionItemProps<T>) => {
  const [, rest] = splitProps(props as AccordionItemProps, ["class"]);

  return <AccordionPrimitive.Item class={cx("border-b last:border-b-0", props.class)} data-slot="accordion-item" {...rest} />;
};

export type AccordionTriggerProps<T extends ValidComponent = "button"> = ComponentProps<typeof AccordionPrimitive.Trigger<T>>;

export const AccordionTrigger = <T extends ValidComponent = "button">(props: AccordionTriggerProps<T>) => {
  const [, rest] = splitProps(props as AccordionTriggerProps, ["class", "children"]);

  return (
    <AccordionPrimitive.Header class="flex">
      <AccordionPrimitive.Trigger
        class={cx(
          "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium outline-none transition-all hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-expanded]>svg]:rotate-180",
          props.class,
        )}
        data-slot="accordion-trigger"
        {...rest}
      >
        {props.children}
        <svg
          class="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="m6 9l6 6l6-6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
        </svg>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
};

export type AccordionContentProps<T extends ValidComponent = "div"> = ComponentProps<typeof AccordionPrimitive.Content<T>>;

export const AccordionContent = <T extends ValidComponent = "div">(props: AccordionContentProps<T>) => {
  const [, rest] = splitProps(props as AccordionContentProps, ["class", "children"]);

  return (
    <AccordionPrimitive.Content
      class="data-[closed]:animate-accordion-up data-[expanded]:animate-accordion-down overflow-hidden text-sm"
      data-slot="accordion-content"
      {...rest}
    >
      <div class={cx("pb-4 pt-0", props.class)}>{props.children}</div>
    </AccordionPrimitive.Content>
  );
};
