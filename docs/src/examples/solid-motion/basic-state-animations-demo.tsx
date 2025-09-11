import { createSignal } from "solid-js";
import { Motion } from "solid-motion";

export function BasicStateAnimationsDemo() {
  const [x, setX] = createSignal(0);
  const [y, setY] = createSignal(0);
  const [rotate, setRotate] = createSignal(0);

  return (
    <div id="example">
      <div>
        <Motion animate={{ rotate: rotate(), x: x(), y: y() }} class="box" transition={{ type: "spring" }} />
      </div>
      <div class="inputs">
        <Input onChange={setX} value={x()}>
          x
        </Input>
        <Input onChange={setY} value={y()}>
          y
        </Input>
        <Input max={180} min={-180} onChange={setRotate} value={rotate()}>
          rotate
        </Input>
      </div>
      <StyleSheet />
    </div>
  );
}

interface InputProps {
  children: string;
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
}

function Input(props: InputProps) {
  return (
    <label>
      <code>{props.children}</code>
      <input max={props.max} min={props.min} onInput={(e) => props.onChange(parseFloat(e.currentTarget.value))} type="range" value={props.value} />
      <input max={props.max} min={props.min} onInput={(e) => props.onChange(parseFloat(e.currentTarget.value) || 0)} type="number" value={props.value} />
    </label>
  );
}

/**
 * ==============   Styles   ================
 */

function StyleSheet() {
  return (
    <style>{`
            #example .box {
                width: 200px;
                height: 200px;
                border-radius: 20px;
                border: 5px dotted #ff0088;
                pointer-events: none;
            }

            #example {
                display: flex;
                align-items: center;
            }

            #example input {
                accent-color: #ff0088;
                font-family: "Azeret Mono", monospace;
            }

            #example .inputs {
                display: flex;
                flex-direction: column;
                padding-left: 50px;
            }

            #example label {
                display: flex;
                align-items: center;
                margin: 10px 0;
            }

            #example label code {
                width: 100px;
            }

            #example input[type="number"] {
                border: 0;
                border-bottom: 1px dotted #ff0088;
                color: #ff0088;
                margin-left: 10px;
            }

            #example input[type="number"]:focus {
                outline: none;
                border-bottom: 2px solid #ff0088;
            }

            #example input[type="number"]::-webkit-inner-spin-button {
                -webkit-appearance: none;
            }

            input[type='range']::-webkit-slider-runnable-track {
                height: 10px;
                -webkit-appearance: none;
                background: #0b1011;
                border: 1px solid #1d2628;
                border-radius: 10px;
                margin-top: -1px;
            }

            input[type='range']::-webkit-slider-thumb {
                -webkit-appearance: none;
                height: 20px;
                width: 20px;
                border-radius: 50%;
                background: #ff0088;
                top: -4px;
                position: relative;
            }
        `}</style>
  );
}
