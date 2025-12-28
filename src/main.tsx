//import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { StatefulComponentsParent } from "./components/StatefulComponentsParent/StatefulComponentsParent";

createRoot(document.getElementById("root")!).render(<StatefulComponentsParent elements_amount={10} timers_per_type={{ min: 1, max: 3 }} />);
