import { createRoot } from "react-dom/client";
import "./index.css";
import { StatefulComponentsParent, type StatefulComponentsParentState } from "./components/StatefulComponentsParent/StatefulComponentsParent";

// fast
const settings: StatefulComponentsParentState = {
  elements_amount: 5000,
  sorted: true,
  debug: false,
  parent_width_px: 1000,
  rerender_speed_ms: 1000,

  component: { delay_s: { min: 0, max: 1 }, gap: 0, size: { width: 20, height: 20 } /*, animation: true*/ },
  timer: { update_rate_s: { min: 2, max: 5 } },
  timers_amount: 10
};

// slow
// const settings: StatefulComponentsParentState = {
//   elements_amount: 50,
//   sorted: true,
//   debug: false,
//   parent_width_px: 150,
//   rerender_speed_ms: 1000,

//   component: { delay_s: { min: 0, max: 1 }, gap: 3, size: { width: 10, height: 10 } /*, animation: false*/ },
//   timer: { update_rate_s: { min: 2, max: 10 } },
//   timers_amount: 10
// };

createRoot(document.getElementById("root")!).render(<StatefulComponentsParent {...settings} />);
