import { Root as ButtonPrimitive } from "@kobalte/core/button";
import type { VariantProps } from "cva";
import { CheckIcon, CopyIcon } from "lucide-solid";
import { type ComponentProps, createSignal, Show, splitProps, type ValidComponent } from "solid-js";
import { AnimatePresence, Motion } from "solid-motion";

import { cva, cx } from "@/components/utils/cva";

export const buttonVariants = cva({
  base: "flex items-center justify-center rounded-md transition-[box-shadow,_color,_background-color,_border-color,_outline-color,_text-decoration-color,_fill,_stroke] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  defaultVariants: {
    size: "default",
    variant: "default",
  },
  variants: {
    size: {
      default: "size-9",
      lg: "size-10 rounded-md",
      sm: "size-8 rounded-md",
      xs: "size-7 [&_svg:not([class*='size-'])]:size-3.5 rounded-md",
    },
    variant: {
      accent: "bg-accent text-accent-foreground shadow-xs hover:bg-accent/90",
      default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
      destructive:
        "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
      ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
      link: "text-primary underline-offset-4 hover:underline",
      outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
      secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
    },
  },
});

export type CopyButtonProps<T extends ValidComponent = "button"> = ComponentProps<typeof ButtonPrimitive<T>> &
  VariantProps<typeof buttonVariants> & {
    content: string;
    copied?: boolean;
    onCopiedChange?: (copied: boolean, content?: string) => void;
    delay?: number;
  };

export function CopyButton<T extends ValidComponent = "button">(props: CopyButtonProps<T>) {
  const [_, rest] = splitProps(props as CopyButtonProps, ["content", "copied", "onCopiedChange", "delay", "class", "variant", "size", "style", "children"]);

  const [animate, setAnimate] = createSignal<"animate" | "tap" | "hover">("animate");
  const [isCopied, setIsCopied] = createSignal(false);

  const handleCopy = (e: MouseEvent) => {
    props.onClick?.(e);
    if (props.copied) return;
    if (props.content) {
      navigator.clipboard
        .writeText(props.content)
        .then(() => {
          setIsCopied(true);
          props.onCopiedChange?.(true, props.content);
          setTimeout(() => {
            setIsCopied(false);
            props.onCopiedChange?.(false);
          }, props.delay);
        })
        .catch((error) => {
          console.error("Error copying command", error);
        });
    }
  };

  return (
    <Motion
      animate={animate()}
      as={ButtonPrimitive}
      class={cx(buttonVariants({ class: props.class, size: props.size, variant: props.variant }))}
      data-slot="copy-button"
      onClick={handleCopy}
      onMouseDown={() => setAnimate("tap")}
      onMouseEnter={() => setAnimate("hover")}
      onMouseLeave={() => setAnimate("animate")}
      onMouseUp={() => setAnimate("animate")}
      variants={{
        animate: {
          scale: 1,
        },
        hover: {
          scale: 1.05,
        },
        tap: {
          scale: 0.95,
        },
      }}
      {...rest}
    >
      <AnimatePresence mode="popLayout">
        <Motion
          animate={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
          as="span"
          data-slot="copy-button-icon"
          exit={{ filter: "blur(4px)", opacity: 0.4, scale: 0 }}
          initial={{ filter: "blur(4px)", opacity: 0.4, scale: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Show fallback={<CopyIcon />} when={isCopied()}>
            <CheckIcon />
          </Show>
        </Motion>
      </AnimatePresence>
    </Motion>
  );
}
