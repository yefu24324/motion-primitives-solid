import type { JSX } from "solid-js";

export function Steps(props: { children: JSX.Element }) {
  return <div class="relative pl-6 mt-2 ml-2 border-l sm:ml-4 sm:pl-7">{props.children}</div>;
}

export function Step(props: { children: JSX.Element }) {
  return <div>{props.children}</div>;
}

export function StepIcon(props: { children: JSX.Element }) {
  return <span class="bg-muted text-muted-foreground absolute -start-4 size-8 rounded-full flex items-center justify-center text-sm">{props.children}</span>;
}

export function StepTitle(props: { children: JSX.Element }) {
  return <h3 class="font-heading mt-8 scroll-m-20 text-xl font-semibold tracking-tight">{props.children}</h3>;
}
