import { useEffect, useReducer, useRef } from "react";
import { StatefulComonent, type StatefulComponentState } from "../StatefulComponent/StatefulComponent";
import { ComponentStates } from "../../helper/types";

import { v4 as uuid } from "uuid";

import "./statefulComponentsParent.css";
import { chunkify, getRandomInt, getRandomIntFloating, weighted_random } from "../../helper/funcs";
import { StatesFlow, timerPerType_min, timersPerType_max } from "../../helper/consts";

type StatefulComponentsParentState = {
  elements_amount: number;
  timers_per_type: { min: number; max: number };
};

const stockComponentGenerator = () =>
  ({
    current_state: ComponentStates.initial_off,
    internal_timerGroup: -1,
    uuid: uuid(),
    animation_delay_s: getRandomIntFloating(0, 4) //getRandomInt(0, 3),
    // animation_duration_s: getRandomIntFloating(0.5, 2.5)
    // stateChange_offset_ms: getRandomInt(0, 9)
  } as StatefulComponentState);

export const StatefulComponentsParent = (state: StatefulComponentsParentState) => {
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  // const render_components = useRef<StatefulComponentState[]>(
  //   Array(state.elements_amount)
  //     .fill(null)
  //     .map(
  //       () =>
  //         ({
  //           current_state: ComponentStates.initial_off,
  //           internal_timerGroup: -1,
  //           uuid: uuid(),
  //           animation_delay_s: getRandomIntFloating(0, 4) //getRandomInt(0, 3),
  //           // animation_duration_s: getRandomIntFloating(0.5, 2.5)
  //           // stateChange_offset_ms: getRandomInt(0, 9)
  //         } as StatefulComponentState)
  //     )
  // );

  // function filterWhole(components: StatefulComponentState[]) {
  //   return Object.fromEntries(Object.keys(ComponentStates).map(state_name => [state_name, components.filter(c => c.current_state == state_name)])); // filter плохой ибо он каждый раз мапает вообще по всем компонентам
  // }

  // type ComponentGroups = { [key in ComponentStates]: StatefulComponentState[] };
  // const groups = useRef<ComponentGroups>(
  //   Object.fromEntries(Object.keys(ComponentStates).map(state_name => [state_name, []])) as unknown as ComponentGroups
  // );

  const timerGroups = useRef<{ [timerId: string]: StatefulComponentState[] }>({});

  // type TimersStatesArrays = { [key in ComponentStates]: ReturnType<typeof setInterval>[] };
  // const timers = useRef<TimersStatesArrays>(
  //   Object.fromEntries(Object.keys(ComponentStates).map(state_name => [state_name, []])) as unknown as TimersStatesArrays
  // );
  // const timers = useRef<ReturnType<typeof setInterval>[]>([]);

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
      .map(() => stockComponentGenerator());

    const currentTimerAmount = timerPerType_min; // (max is timersPerType_max)

    let subdivs = chunkify(components_setup, currentTimerAmount, true);
    for (let i = 0; i < currentTimerAmount; i++) {
      const timer_id = uuid();
      timerGroups.current[timer_id] = subdivs[i];
      handleItemsLoop(null, timer_id);
    }
    // console.log(render_components.current);
    // @ts-ignore
    // groups.current = filterWhole(render_components.current);
    // console.log(groups.current);

    // initial timers, 1 timer-interval per 1 type
    // Object.values(timers.current).map((timer_interval_arr, index) => {
    // for (let i = 0; i < 1; i++)
    // timer_interval_arr.push(
    //   setInterval(() => {
    //     let currentGroup = Object.values(groups.current)[index];
    //     // console.log(currentGroup);
    //     console.log({ gt: Object.keys(timers.current)[index], it: currentGroup });

    //     if (currentGroup.length > 0) {
    //       currentGroup.forEach((c, i) => {
    //         currentGroup[i] = triggerStateChange(c);
    //       });
    //     }
    //     // triggerStateChange
    //     // console.log(render_components.current);
    //   }, getRandomIntFloating(5, 15) * 100)
    // );
    // });

    // setTimeout(() => {
    setInterval(() => {
      forceUpdate();
    }, 1000);
    // }, 3000);

    // setTimeout(() => {
    //   render_components.current = render_components.current.slice(0, 5);
    // }, 2500);

    // // driver interval to control amount of subintervals (incr/decr depending on demand/obsoletion)
    // setInterval(() => {
    //   // maps each type, compares amount of statfulcomponents w/o inteval and checks amount of intervals w/o statfulcomponents
    //   // adds new interval add assignes it to components and deletes unused intervals

    //   // самое сложное это делить кол-во текущих чтобы уложиться в лимит 15 таймеров/тип
    // }, 5000)

    // Object.keys
    // triggerStateChange

    // console.log(timers.current);

    // return () => {
    //   Object.values(timers.current)
    //     .reduce((acc, curr) => [...acc, ...curr])
    //     .map(timer => clearInterval(timer));
    // };
  }, []);
  // лучше слделать prevState и назначать резлуьтат этой: функции в newStaate, обновлять новые состояния постоянно, но ререндерить только когда интервал+оффсет наступили

  // пока что я сделаю через setInterval напррямую, у меня немного компонентов пока что

  // первое ксттм ожно делать через useMemo prev new components и делать setTimeout для обновления пропсов кек, немного хак
  function triggerStateChange(component: StatefulComponentState): StatefulComponentState {
    console.log(component);
    // const possibleFutureStates = StatesFlow[component.current_state].map(state_name => ({
    //   name: state_name,
    //   chance: StatesChangeFromCurrentChance[state_name]
    // }));
    const possibleFutureStates = StatesFlow[component.current_state];
    const newState = weighted_random(possibleFutureStates.map(o => ({ item: o.state, weight: o.chance }))) as ComponentStates;
    //  вот это прям плохо выглядит, переназначение в массиве       ^

    let debug_prevState = component.current_state;
    component.current_state = newState;
    console.log({ uuid: component.uuid, state: `${debug_prevState} -> ${newState}` });
    return component;
  }

  return (
    <div className='statefulComponentsParent'>
      {/* {render_components.current.map(s => (
        <StatefulComonent {...s} key={s.uuid} />
      ))} */}

      {/* это неоптимизированный ужас, я знаю */}
      {Object.values(timerGroups.current)
        .reduce((acc, curr) => [...acc, ...curr], [])
        .map(s => (
          <StatefulComonent {...s} key={s.uuid} />
        ))}
    </div>
  );
};
