import { Root as SeparatorPrimitive } from "@kobalte/core/separator";
import type { ComponentProps, ValidComponent } from "solid-js";
import { splitProps } from "solid-js";

import { cx } from "@/components/utils/cva";

export type SeparatorProps<T extends ValidComponent = "hr"> = ComponentProps<typeof SeparatorPrimitive<T>>;

export const Separator = <T extends ValidComponent = "hr">(props: SeparatorProps<T>) => {
  const [, rest] = splitProps(props as SeparatorProps, ["class"]);

  return (
    <SeparatorPrimitive
      class={cx(
        "bg-border shrink-0 border-none data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px",
        props.class,
      )}
      data-slot="separator"
      {...rest}
    />
  );
};
