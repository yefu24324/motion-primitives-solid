import { CursorFollow, CursorProvider } from "@/components/animate-ui/cursor";

export function CursorFollowOnlyDemo() {
  return (
    <div class="size-[400px] rounded-xl bg-muted flex items-center justify-center">
      <p class="font-medium">Move your mouse over the div</p>
      <CursorProvider>
        <CursorFollow>
          <div class="bg-blue-500 text-white px-2 py-1 rounded-lg text-sm shadow-lg">Designer</div>
        </CursorFollow>
      </CursorProvider>
    </div>
  );
}
