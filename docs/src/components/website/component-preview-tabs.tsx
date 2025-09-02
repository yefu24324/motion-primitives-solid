import { RotateCw } from "lucide-solid";
import { type ComponentProps, createSignal, type JSX, mergeProps, Show, splitProps } from "solid-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cx } from "@/components/utils/cva";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type Props = ComponentProps<"div"> & {
  align?: "center" | "start" | "end";
  hideCode?: boolean;
  component: () => JSX.Element;
};

export const ComponentPreviewTabs = (props: Props) => {
  const merge = mergeProps(
    {
      align: "center",
      hideCode: false,
    } as Props,
    props,
  );
  const [, rest] = splitProps(merge, ["class", "align", "hideCode", "component", "children"]);
  const [render, setRender] = createSignal(true);

  function onClickRerender() {
    setRender(false);
    setTimeout(() => {
      setRender(true);
    });
  }

  return (
    <div class={cx("group relative my-4 flex flex-col gap-2", props.class)} {...rest}>
      <Show
        fallback={
          <div
            class="preview flex min-h-[450px] w-full justify-center rounded-lg border p-10 data-[align=center]:items-center data-[align=end]:items-end data-[align=start]:items-start"
            data-align={props.align}
          >
            {props.component()}
          </div>
        }
        when={!props.hideCode}
      >
        <Tabs class="relative mr-auto w-full">
          <div class="flex items-center justify-between">
            <TabsList class="justify-start gap-4 rounded-none bg-transparent px-2 ring-0 md:px-0">
              <TabsTrigger
                class="text-muted-foreground data-[selected]:text-foreground px-0 data-[selected]:shadow-none dark:data-[selected]:border-transparent dark:data-[selected]:bg-transparent"
                value="preview"
              >
                Preview
              </TabsTrigger>
              <TabsTrigger
                class="text-muted-foreground data-[selected]:text-foreground px-0 data-[selected]:shadow-none dark:data-[selected]:border-transparent dark:data-[selected]:bg-transparent"
                value="code"
              >
                Code
              </TabsTrigger>
            </TabsList>
          </div>
          <div class="relative md:-mx-4">
            <div class="absolute top-3 right-4">
              <div class="flex items-center gap-3 opacity-0 transition-opacity group-hover:opacity-100">
                <Tooltip>
                  <TooltipTrigger>
                    <button class="cursor-pointer" onClick={onClickRerender} type="button">
                      <RotateCw class="h-4 w-4 text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Re-trigger</TooltipContent>
                </Tooltip>
              </div>
            </div>

            <TabsContent value="preview">
              <div
                class="preview flex min-h-[450px] w-full justify-center rounded-lg border p-10 data-[align=center]:items-center data-[align=end]:items-end data-[align=start]:items-start"
                data-align={props.align}
              >
                {render() && props.component()}
              </div>
            </TabsContent>
            <TabsContent class="overflow-hidden **:[figure]:!m-0 **:[pre]:h-[450px]" value="code">
              {props.children}
            </TabsContent>
          </div>
        </Tabs>
      </Show>
    </div>
  );
};

export default ComponentPreviewTabs;
