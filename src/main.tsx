import { createRoot } from "react-dom/client";
import "./index.css";
import { StatefulComponentsParent, type StatefulComponentsParentState } from "./components/StatefulComponentsParent/StatefulComponentsParent";

const settings: StatefulComponentsParentState = {
  elements_amount: 100,
  sorted: true,
  debug: true,
  parent_width_px: 150,
  rerender_speed_ms: 10,

  component: { delay_s: { min: 0, max: 1 }, gap: 0, size: { width: 10, height: 10 }, animation: true },
  timer: { update_rate_s: { min: 0.01, max: 0.1 } },
  timers_amount: 10
};

createRoot(document.getElementById("root")!).render(<StatefulComponentsParent {...settings} />);
