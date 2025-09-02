import { ColorModeProvider, ColorModeScript } from "@kobalte/core";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import Header from "@/components/website/header";
import "./app.css";

export default function App() {
  return (
    <>
      <ColorModeScript />
      <ColorModeProvider>
        <Router
          root={(props) => (
            <div class="text-foreground group/body overscroll-none font-sans antialiased [--footer-height:calc(var(--spacing)*14)] [--header-height:calc(var(--spacing)*14)]">
              <div class="bg-background relative flex min-h-svh flex-col">
                <Header />
                <main class="flex flex-1 flex-col">
                  <Suspense>{props.children}</Suspense>
                </main>
              </div>
            </div>
          )}
        >
          <FileRoutes />
        </Router>
      </ColorModeProvider>
    </>
  );
}
