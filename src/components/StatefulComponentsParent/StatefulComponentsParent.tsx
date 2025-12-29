import { useEffect, useReducer, useRef } from "react";
import { StatefulComonent, type StatefulComponentState } from "../StatefulComponent/StatefulComponent";
import { ComponentStates } from "../../helper/types";

import { v4 as uuid } from "uuid";

import "./statefulComponentsParent.css";
import { chunkify, /*getRandomInt,*/ getRandomIntFloating, weighted_random } from "../../helper/funcs";
import { StatesFlow, timerPerType_min/*, timersPerType_max*/ } from "../../helper/consts";

type StatefulComponentsParentState = {
  elements_amount: number;
  timers_per_type: { min: number; max: number };
};

const stockComponentGenerator = () =>
  ({
    current_state: ComponentStates.initial_off,
    // internal_timerGroup: -1,
    uuid: uuid(),
    animation_delay_s: getRandomIntFloating(0, 4) //getRandomInt(0, 3),
    // animation_duration_s: getRandomIntFloating(0.5, 2.5)
    // stateChange_offset_ms: getRandomInt(0, 9)
  } as StatefulComponentState);

export const StatefulComponentsParent = (state: StatefulComponentsParentState) => {
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const timerGroups = useRef<{ [timerId: string]: StatefulComponentState[] }>({});

  type StateGroups = { [state in ComponentStates]: Map<string, StatefulComponentState> }
  // const stateType_groups = useRef<SG>()
  const stateType_groups = useRef<StateGroups>(Object.fromEntries(Object.keys(ComponentStates).map(s_n => [s_n, new Map<string, StatefulComponentState>([])])) as StateGroups)
  

  function handleItemsLoop(internal_timerId: number | null, app_timerId: string) {
    if (internal_timerId) clearInterval(internal_timerId);

    const currentGroup = timerGroups.current[app_timerId];

    if (currentGroup.length > 0) {
      currentGroup.forEach((c, i) => {
        currentGroup[i] = triggerStateChange(c);
      });
    }

    let currTimer = setTimeout(() => handleItemsLoop(currTimer, app_timerId), getRandomIntFloating(50, 100) * 100);
  }
  useEffect(() => {
    // groups.current.INITIAL_OFF
    const components_setup = Array(state.elements_amount)
      .fill(null)
      .map(() => {
        const component = stockComponentGenerator()
        return [component.uuid, component]
      });
      // @ts-ignore оно работает :d
      stateType_groups.current.INITIAL_OFF = new Map(components_setup)

    const currentTimerAmount = timerPerType_min; // (max is timersPerType_max)

    let subdivs = chunkify(components_setup, currentTimerAmount, true);
    for (let i = 0; i < currentTimerAmount; i++) {
      const timer_id = uuid();
      timerGroups.current[timer_id] = subdivs[i];
      handleItemsLoop(null, timer_id);
    }

    setInterval(() => {
      forceUpdate();
    }, 1000);

  }, []);
  // лучше слделать prevState и назначать резлуьтат этой: функции в newStaate, обновлять новые состояния постоянно, но ререндерить только когда интервал+оффсет наступили

  // пока что я сделаю через setInterval напррямую, у меня немного компонентов пока что

  // первое ксттм ожно делать через useMemo prev new components и делать setTimeout для обновления пропсов кек, немного хак
  function triggerStateChange(component: StatefulComponentState): StatefulComponentState {
    console.log(component);
    const possibleFutureStates = StatesFlow[component.current_state];
    const newState = weighted_random(possibleFutureStates.map(o => ({ item: o.state, weight: o.chance }))) as ComponentStates;
    //  вот это прям плохо выглядит, переназначение в массиве       ^

    let debug_prevState = component.current_state;
    component.current_state = newState;
    console.log({ uuid: component.uuid, state: `${debug_prevState} -> ${newState}` });

    // stateType_groups

    return component;
  }

  return (
    <div className='statefulComponentsParent'>
      {/* {render_components.current.map(s => (
        <StatefulComonent {...s} key={s.uuid} />
      ))} */}

      {/* это неоптимизированный ужас, я знаю */}
      {/* {Object.values(timerGroups.current)
        .reduce((acc, curr) => [...acc, ...curr], [])
        .map(s => (
          <StatefulComonent {...s} key={s.uuid} />
        ))} */}
    </div>
  );
};
