// import { memo, useMemo } from "react";
import { useMemo } from "react";
import type { ComponentStates } from "../../helper/consts";
import { StatesAnimationDuration_S } from "../../helper/consts";
import { getRandomArrayItem } from "../../helper/funcs";

import "./statefulComponent.css";

export type StatefulComponentState = {
  current_state: ComponentStates;
  // internal_timerGroup: number;

  uuid: string;

  animation_delay_s: number;

  styles?: React.CSSProperties;
  debug?: boolean;
  // animation_duration_s: number;
  // stateChange_offset_ms: number;
};

// memo(
export const StatefulComonent = (state: StatefulComponentState) => {
  const animationDuration = useMemo(() => getRandomArrayItem(StatesAnimationDuration_S[state.current_state]), []);
  const uuid_start = useMemo(() => state.uuid.slice(0, 3), []);

  return (
    <div
      data-id={state.uuid}
      data-state={state.current_state}
      className='stateful-component'
      style={{
        animationDelay: `${state.animation_delay_s}s`,
        animationDuration: `${animationDuration}s`,
        ...state.styles
      }}>
      {state.debug == true ? uuid_start : <></>}
    </div>
  );
};
//   (prev, next) => {
//     console.log(prev.current_state, next.current_state);
//     if (prev.current_state === next.current_state) return false;
//     // setTimeout?
//     return true;
//   }
// );
