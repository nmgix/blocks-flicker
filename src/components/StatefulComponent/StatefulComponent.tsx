// import { memo, useMemo } from "react";
import { Colours, StatesAnimationDuration_S } from "../../helper/consts";
import { getRandomArrayItem } from "../../helper/funcs";
import type { ComponentStates } from "../../helper/types";

import "./statefulComponent.css";

export type StatefulComponentState = {
  current_state: ComponentStates;
  // internal_timerGroup: number;

  uuid: string;

  animation_delay_s: number;
  // animation_duration_s: number;
  // stateChange_offset_ms: number;
};

// memo(
export const StatefulComonent = (state: StatefulComponentState) => {
    return (
      <div
        data-id={state.uuid}
        className='stateful-component'
        style={{
          backgroundColor: `#${Colours[state.current_state]}`,
          animationDelay: `${state.animation_delay_s}s`,
          // animationDuration: `${
          //   Number(Number(getRandomArrayItem(StatesAnimationDuration_S[state.current_state]) + state.animation_duration_s).toFixed(3)) / 2
          // }s`,
          animationDuration: `${getRandomArrayItem(StatesAnimationDuration_S[state.current_state])}s`
        }}
      />
    );
  }
//   (prev, next) => {
//     console.log(prev.current_state, next.current_state);
//     if (prev.current_state === next.current_state) return false;
//     // setTimeout?
//     return true;
//   }
// );
