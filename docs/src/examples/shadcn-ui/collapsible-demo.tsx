import { ChevronsUpDownIcon } from "lucide-solid";

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export const CollapsibleDemo = () => {
  return (
    <Collapsible class="w-[350px]">
      <div class="space-y-2 mb-2">
        <div class="flex items-center justify-between space-x-4">
          <h4 class="text-sm font-semibold">@peduarte starred 3 repositories</h4>
          <CollapsibleTrigger>
            <Button class="w-9 p-0" size="sm" variant="outline">
              <ChevronsUpDownIcon class="h-4 w-4" />
              <span class="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <div class="rounded-md border px-4 py-3 font-mono text-sm">@radix-ui/primitives</div>
      </div>
      <CollapsibleContent class="space-y-2">
        <div class="rounded-md border px-4 py-3 font-mono text-sm">@radix-ui/colors</div>
        <div class="rounded-md border px-4 py-3 font-mono text-sm">@stitches/react</div>
      </CollapsibleContent>
    </Collapsible>
  );
};
