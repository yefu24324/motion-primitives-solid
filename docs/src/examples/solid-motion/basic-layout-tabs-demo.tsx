import { createSignal, For, type JSX, Show } from "solid-js";
import { AnimatePresence, animateView, Motion } from "solid-motion";

export function BasicLayoutTabsDemo() {
  const [selectedTab, setSelectedTab] = createSignal(tabs[0]);

  function handleClick(item: (typeof tabs)[number]) {
    animateView(() => {
      setSelectedTab(item);
    });
  }

  return (
    <div style={container}>
      <nav style={nav}>
        <ul style={tabsContainer}>
          <For each={tabs}>
            {(item) => (
              <>
                <Motion
                  animate={{
                    backgroundColor: item === selectedTab() ? "#eee" : "#eee0",
                  }}
                  as="li"
                  initial={false}
                  key={item.label}
                  onClick={() => handleClick(item)}
                  style={tab}
                >
                  {`${item.icon} ${item.label}`}
                  <Show when={item === selectedTab()}>
                    <Motion id="underline" layoutId="underline" style={underline} />
                  </Show>
                </Motion>
              </>
            )}
          </For>
        </ul>
      </nav>
      <main style={iconContainer}>
        <AnimatePresence mode="wait">
          <Motion
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            initial={{ opacity: 0, y: 10 }}
            key={selectedTab() ? selectedTab().label : "empty"}
            style={icon}
            transition={{ duration: 0.2 }}
          >
            {selectedTab() ? selectedTab().icon : "😋"}
          </Motion>
        </AnimatePresence>
      </main>
    </div>
  );
}

/**
 * ==============   Styles   ================
 */

const container: JSX.CSSProperties = {
  background: "white",
  "border-radius": "10px",
  "box-shadow":
    "0 1px 1px hsl(0deg 0% 0% / 0.075), 0 2px 2px hsl(0deg 0% 0% / 0.075), 0 4px 4px hsl(0deg 0% 0% / 0.075), 0 8px 8px hsl(0deg 0% 0% / 0.075), 0 16px 16px hsl(0deg 0% 0% / 0.075), 0 2px 2px hsl(0deg 0% 0% / 0.075), 0 4px 4px hsl(0deg 0% 0% / 0.075), 0 8px 8px hsl(0deg 0% 0% / 0.075), 0 16px 16px hsl(0deg 0% 0% / 0.075)",
  display: "flex",
  "flex-direction": "column",
  height: "60vh",
  "max-height": "360px",
  overflow: "hidden",
  width: "480px",
};

const nav: JSX.CSSProperties = {
  background: "#fdfdfd",
  "border-bottom": "1px solid #eeeeee",
  "border-bottom-left-radius": 0,
  "border-bottom-right-radius": 0,
  "border-radius": "10px",
  height: "44px",
  padding: "5px 5px 0",
};

const tabsStyles: JSX.CSSProperties = {
  "font-size": "14px",
  "font-weight": "500",
  "list-style": "none",
  margin: 0,
  padding: 0,
};

const tabsContainer: JSX.CSSProperties = {
  ...tabsStyles,
  display: "flex",
  width: "100%",
};

const tab: JSX.CSSProperties = {
  ...tabsStyles,
  "align-items": "center",
  background: "white",
  "border-bottom-left-radius": 0,
  "border-bottom-right-radius": 0,
  "border-radius": "5px",
  color: "#0f1115",
  cursor: "pointer",
  display: "flex",
  flex: 1,
  "justify-content": "space-between",
  "min-width": "0",
  padding: "10px 15px",
  position: "relative",
  "user-select": "none",
  width: "100%",
};

const underline: JSX.CSSProperties = {
  background: "var(--accent)",
  bottom: "-2px",
  height: "2px",
  left: 0,
  position: "absolute",
  right: 0,
};

const iconContainer: JSX.CSSProperties = {
  "align-items": "center",
  display: "flex",
  flex: 1,
  "justify-content": "center",
};

const icon: JSX.CSSProperties = {
  "font-size": "128px",
};

/**
 * ==============   Data   ================
 */

const allIngredients = [
  { icon: "🍅", label: "Tomato" },
  { icon: "🥬", label: "Lettuce" },
  { icon: "🧀", label: "Cheese" },
  { icon: "🥕", label: "Carrot" },
  { icon: "🍌", label: "Banana" },
  { icon: "🫐", label: "Blueberries" },
  { icon: "🥂", label: "Champers?" },
];

const [tomato, lettuce, cheese] = allIngredients;
const tabs = [tomato, lettuce, cheese];
