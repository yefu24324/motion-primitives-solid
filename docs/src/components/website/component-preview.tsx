import type { JSX } from "solid-js";
import { type ComponentProps, Match, mergeProps, Switch, splitProps } from "solid-js";

import ComponentPreviewTabs from "./component-preview-tabs";

type Props = ComponentProps<"div"> & {
  name: string;
  align?: "center" | "start" | "end";
  description?: string;
  hideCode?: boolean;
  type?: "block" | "component" | "example";
  component: () => JSX.Element;
};

export const ComponentPreview = (props: Props) => {
  const merge = mergeProps(
    {
      align: "center",
      hideCode: false,
    } as Props,
    props,
  );
  const [local, rest] = splitProps(merge, ["name", "type", "align", "hideCode", "component"]);

  return (
    <Switch fallback={<ComponentPreviewTabs align={local.align} component={props.component} hideCode={local.hideCode} {...rest} />}>
      <Match when={!props.component}>
        <p class="text-muted-foreground text-sm">
          Component <code class="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm">{local.name}</code> not found in registry.
        </p>
      </Match>
      <Match when={local.type === "block"}>
        <div class="relative aspect-[4/2.5] w-full overflow-hidden rounded-md border md:-mx-1">
          <div class="bg-background absolute inset-0 hidden w-[1600px] md:block">
            <iframe class="size-full" src={`/view/${local.name}`} title="Block" />
          </div>
        </div>
      </Match>
    </Switch>
  );
};
