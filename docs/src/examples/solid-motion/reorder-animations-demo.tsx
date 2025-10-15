import { createSignal, For, onCleanup, onMount } from "solid-js";
import { createStore, reconcile } from "solid-js/store";
import { Motion } from "solid-motion";

const initialOrder = ["#ff0088", "#dd00ee", "#9911ff", "#0d63f8"];

function shuffle([...array]: string[]) {
  return array.sort(() => Math.random() - 0.5);
}

export function ReorderAnimationsDemo() {
  const [order, setOrder] = createStore(initialOrder);

  onMount(() => {
    const timeout = setInterval(() => {
      setOrder(reconcile(shuffle(order)));
    }, 500);

    onCleanup(() => clearInterval(timeout));
  });

  return (
    <ul
      style={{
        "list-style": "none",
        padding: "0",
        margin: "0",
        position: "relative",
        display: "flex",
        "flex-wrap": "wrap",
        gap: "10px",
        width: "300px",
        "flex-direction": "row",
        "justify-content": "center",
        "align-items": "center",
      }}
    >
      <For each={order}>
        {(backgroundColor) => {
          return (
            // I do this to debug referential integrity: the count stays the same even if the order is different
            <Square backgroundColor={backgroundColor} />
            // Previous, without debugging referential integrity:
            // <Motion
            //   as="li"
            //   layout
            //   transition={{
            //     type: "spring",
            //     damping: 20,
            //     stiffness: 300,
            //   }}
            //   style={{
            //     width: "100px",
            //     height: "100px",
            //     "border-radius": "10px",
            //     "background-color": backgroundColor,
            //   }}
            // />
          );
        }}
      </For>
    </ul>
  );
}

function Square(props: { backgroundColor: string }) {
  const [count, setCount] = createSignal(0);

  return (
    <Motion
      as="li"
      layout
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 300,
      }}
      style={{
        width: "100px",
        height: "100px",
        "border-radius": "10px",
        "background-color": props.backgroundColor,
      }}
      onClick={() => setCount(count() + 1)}
    >
      {count()}
    </Motion>
  );
}
