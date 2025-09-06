import type { JSX } from "solid-js";

export function Steps(props: { children: JSX.Element }) {
  return <div class="relative pl-6 ml-2 border-l sm:ml-4 sm:pl-7">{props.children}</div>;
}

export function Step(props: { children: JSX.Element }) {
  return <div>{props.children}</div>;
}

export function StepIcon(props: { children: JSX.Element }) {
  return <span class="bg-muted text-muted-foreground absolute -start-4 size-8 rounded-full flex items-center justify-center text-sm">{props.children}</span>;
}
