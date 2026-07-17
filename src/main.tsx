import { createRoot } from "react-dom/client";
import "./index.css";
import { StatefulComponentsParent, type StatefulComponentsParentState } from "./components/StatefulComponentsParent/StatefulComponentsParent";
import GUI from "lil-gui"

let gui = new GUI()

const settings: StatefulComponentsParentState = {
  elements_amount: 100,
  sorted: true,
  debug: false,
  parent_width_px: 1000,
  rerender_speed_ms: 10,
  
  timers_amount: 2,
  component: { delay_s: { min: 0, max: 1 }, gap: 0, size: { width: 10, height: 10 }, animation: true },
  timer: { update_rate_s: { min: 0.01, max: 0.1 } },
};

const root = createRoot(document.getElementById("root")!)
const renderApp = () => root.render(<StatefulComponentsParent {...settings} />);
renderApp()

const render_properites_not_cool = () => { for(const propery of Object.keys(settings)) typeof settings[propery as keyof StatefulComponentsParentState] !== 'object' && gui.add(settings, propery as keyof StatefulComponentsParentState).onChange(renderApp) }

const fancyToggle = (fancy: boolean) => {
  gui.add({ fancy }, 'fancy').onChange((isFancy: boolean) => {
  gui.destroy(); gui = new GUI();fancyToggle(!fancy)
  if(isFancy) {
    gui.add(settings, 'elements_amount', 0, 10000, 1).onChange(renderApp)
    gui.add(settings, 'sorted').onChange(renderApp)
    gui.add(settings, 'debug').onChange(renderApp);
    gui.add(settings, 'parent_width_px', 0, window.innerWidth, 1).onChange(renderApp)
    gui.add(settings, 'rerender_speed_ms', 0, 10000, 500).onChange(renderApp)
    gui.add(settings, 'timers_amount', 0, 40, 1).onChange(renderApp)
  }
  else render_properites_not_cool()
})
}
fancyToggle(false)
render_properites_not_cool()

