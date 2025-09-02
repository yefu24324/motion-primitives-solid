import { Button } from "@/components/ui/button";
import { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/website/page-header";

const title = "The Foundation for your Design System";
const description =
  "A set of beautifully designed components that you can customize, extend, and build on. Start here then make it your own. Open Source. Open Code.";

export default function Home() {
  return (
    <PageHeader>
      <PageHeaderHeading>{title}</PageHeaderHeading>
      <PageHeaderDescription>{description}</PageHeaderDescription>
      <PageActions>
        <Button as="a" href="/docs/introduction" size="sm">
          Get Started
        </Button>
        <Button as="a" href="/docs/animate-ui/components/cursor" size="sm" variant="ghost">
          View Components
        </Button>
      </PageActions>
    </PageHeader>
  );
}
