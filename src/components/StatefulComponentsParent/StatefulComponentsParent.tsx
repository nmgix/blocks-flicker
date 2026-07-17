import { useEffect, useReducer, useRef } from "react";
import { StatefulComonent, type StatefulComponentState } from "../StatefulComponent/StatefulComponent";
import { ComponentStates } from "../../helper/consts";

import { v4 as uuid } from "uuid";

import "./statefulComponentsParent.css";
import { chunkify, /*getRandomInt,*/ getRandomIntFloating, weighted_random } from "../../helper/funcs";
import { StatesFlow } from "../../helper/consts";

export type StatefulComponentsParentState = {
  elements_amount: number;
  timers_amount: number;
  sorted: boolean;

  debug: boolean;

  rerender_speed_ms: number;

  component: {
    delay_s: { min: number; max: number };
    size: { width: number; height: number };
    gap: { row: number; column: number } | number;
    animation: boolean;
  };
  timer: {
    update_rate_s: { min: number; max: number };
  };

  parent_width_px: number;
};


export const StatefulComponentsParent = ({
  elements_amount,
  sorted = true,
  timers_amount,
  debug = false,
  parent_width_px = 400,
  rerender_speed_ms = 1000,
  component,
  timer
}: StatefulComponentsParentState) => {
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const timerGroups = useRef<{ [timerId: string]: StatefulComponentState[] }>({});

  type StateGroups = { [state in ComponentStates]: Map<string, StatefulComponentState> };
  const createEmptyStateGroups = () => Object.fromEntries(Object.values(ComponentStates).map(s_n => [s_n, new Map<string, StatefulComponentState>([])])) as StateGroups
  const stateType_groups = useRef<StateGroups>(createEmptyStateGroups());
  if (debug == true) console.log(stateType_groups.current);

  const stockComponentGenerator = () =>
    ({
      current_state: ComponentStates.initial_off,
      uuid: uuid(),
      animation_delay_s: getRandomIntFloating(component.delay_s.min, component.delay_s.max) //getRandomInt(0, 3),
    } as StatefulComponentState);

  const loopTimers = useRef(new Set<number>())
  function handleItemsLoop(internal_timerId: number | null, app_timerId: string) {
    if (internal_timerId) { clearInterval(internal_timerId);loopTimers.current.delete(internal_timerId) }

    const currentGroup = timerGroups.current[app_timerId];

    if (currentGroup.length > 0) {
      currentGroup.forEach((c, i) => {
        currentGroup[i] = triggerStateChange(c);
      });
    }

    let currTimer = setTimeout(
      () => handleItemsLoop(currTimer, app_timerId),
      getRandomIntFloating(timer.update_rate_s.min, timer.update_rate_s.max) * 1000
    );
    loopTimers.current.add(currTimer)
    if(debug) console.log(loopTimers)
  }
  useEffect(() => {
    // for(const state of Object.keys(stateType_groups.current)) stateType_groups.current[state as keyof typeof stateType_groups.current].clear()
    stateType_groups.current = createEmptyStateGroups()
    let components_setup = Array(elements_amount)
      .fill(null)
      .map(() => stockComponentGenerator());
    // @ts-ignore оно работает :d
    stateType_groups.current.INITIAL_OFF = new Map(components_setup.map(c => [c.uuid, c]));

    let subdivs = chunkify(components_setup, timers_amount, true);
    const timeouts: number[] = []
    for (let i = 0; i < timers_amount; i++) {
      const timer_id = uuid();
      timerGroups.current[timer_id] = subdivs[i];
      timeouts.push(setTimeout(() => handleItemsLoop(null, timer_id), 0)); // 0 был 2000 (2сек)
    }

    const forcedRerenderInterval = setInterval(() => {
      forceUpdate();
    }, rerender_speed_ms ?? 1000);

    if(debug) {
      console.group('try')
      console.log(elements_amount)
      console.log(timerGroups)
      console.log(Object.values(stateType_groups.current).reduce((acc, curr) => acc+curr.size, 0))
      console.groupEnd()
    }
    return () => {
      for (const timeout of timeouts) clearTimeout(timeout);
      components_setup = [];
      for(const state of Object.keys(stateType_groups.current)) stateType_groups.current[state as keyof typeof stateType_groups.current].clear()
      clearInterval(forcedRerenderInterval)
      for(const timer of loopTimers.current) clearTimeout(timer)
      timerGroups.current = {}
    }
  }, [elements_amount, rerender_speed_ms, debug, timers_amount, parent_width_px, sorted]); // лмао если чёто не тоглится в ререндере из-за lil gui, добавь сюда :kekw:

  function triggerStateChange(component: StatefulComponentState): StatefulComponentState {
    if (debug == true) console.log(component);
    const possibleFutureStates = StatesFlow[component.current_state];
    const newState = weighted_random(possibleFutureStates) as ComponentStates;

    if (debug == true) console.log({ uuid: component.uuid, state: `${component.current_state} -> ${newState}` });

    stateType_groups.current[component.current_state].delete(component.uuid);
    stateType_groups.current[newState].set(component.uuid, component);
    component.current_state = newState;

    return component;
  }

  function renderGroup(s: StatefulComponentState) {
    return (
      <StatefulComonent
        {...s}
        key={s.uuid}
        styles={{ width: component.size.width, height: component.size.height, ...(component.animation == false && { animation: undefined }) }}
        debug={debug}
      />
    );
  }

  const styles_gap = typeof component.gap == "number" ? { gap: component.gap } : { row_gap: component.gap.row, column_gap: component.gap.column };

  if(debug) console.log(stateType_groups.current)
  return (
    <div className='statefulComponentsParent' style={{ width: parent_width_px, ...styles_gap }}>
      {!sorted ? (
        Object.values(timerGroups.current)
          .reduce((acc, curr) => [...acc, ...curr], [])
          .map(renderGroup)
      ) : (
        <>
          {[...stateType_groups.current.RUNNING_FINE.values()].map(renderGroup)}
          {[...stateType_groups.current.BACKING_UP.values()].map(renderGroup)}
          {[...stateType_groups.current.ERROR_OCCURING.values()].map(renderGroup)}
          {[...stateType_groups.current.ERROR_STALE.values()].map(renderGroup)}
          {[...stateType_groups.current.STARTING.values()].map(renderGroup)}
          {[...stateType_groups.current.DEAD.values()].map(renderGroup)}
          {[...stateType_groups.current.INITIAL_OFF.values()].map(renderGroup)}
        </>
      )}
    </div>
  );
};
