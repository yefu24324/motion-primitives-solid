import { CopyButton, type CopyButtonProps } from "@/components/animate-ui/components/buttons/copy-button";

interface CopyButtonDemoProps {
  variant: CopyButtonProps["variant"];
  size: CopyButtonProps["size"];
}

export function CopyButtonDemo(props: CopyButtonDemoProps) {
  return <CopyButton content="Hello world!" />;
}
