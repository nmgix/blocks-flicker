import { ComponentStates } from "./types";

export const Colours = {
  [ComponentStates.running_fine]: "08A045",
  [ComponentStates.backing_up]: "ffff00",
  [ComponentStates.starting]: "0000FF",
  [ComponentStates.error_stale]: "FF5C00",
  [ComponentStates.error_occuring]: "FF0000",
  [ComponentStates.dead]: "313335",
  [ComponentStates.initial_off]: "313335"
};

export const StatesFlow: { [key in ComponentStates]: { state: ComponentStates; chance: number }[] } = {
  [ComponentStates.initial_off]: [{ state: ComponentStates.starting, chance: 1 }],
  [ComponentStates.starting]: [
    { state: ComponentStates.running_fine, chance: 10 },
    { state: ComponentStates.error_occuring, chance: 5 },
    { state: ComponentStates.dead, chance: 1 }
  ],
  [ComponentStates.running_fine]: [
    { state: ComponentStates.running_fine, chance: 7 },
    { state: ComponentStates.error_occuring, chance: 2 },
    { state: ComponentStates.dead, chance: 1 }
  ],
  [ComponentStates.error_occuring]: [
    { state: ComponentStates.error_occuring, chance: 5 },
    { state: ComponentStates.error_stale, chance: 5 },
    { state: ComponentStates.dead, chance: 3 }
  ],
  [ComponentStates.dead]: [
    { state: ComponentStates.dead, chance: 3 },
    { state: ComponentStates.backing_up, chance: 3 }
  ],
  [ComponentStates.backing_up]: [
    { state: ComponentStates.running_fine, chance: 7 },
    { state: ComponentStates.error_occuring, chance: 2 }
  ],
  [ComponentStates.error_stale]: [
    { state: ComponentStates.error_stale, chance: 5 },
    { state: ComponentStates.backing_up, chance: 7 },
    { state: ComponentStates.dead, chance: 2 }
  ]
};

// export const StatesChangeFromCurrentChance = {
//   [ComponentStates.running_fine]: 30,
//   [ComponentStates.backing_up]: 100,
//   [ComponentStates.starting]: 100,
//   [ComponentStates.error_stale]: 70,
//   [ComponentStates.error_occuring]: 40,
//   [ComponentStates.dead]: 100,
//   [ComponentStates.initial_off]: 100
// };

export const StatesAnimationDuration_S = {
  [ComponentStates.running_fine]: [0, 1.5, 0.7],
  [ComponentStates.backing_up]: [0.5, 1],
  [ComponentStates.starting]: [0.7, 1.5],
  [ComponentStates.error_stale]: [0, 3],
  [ComponentStates.error_occuring]: [0, 0.5, 2, 5],
  [ComponentStates.dead]: [0],
  [ComponentStates.initial_off]: [0]
};

export const timerPerType_min = 10;
export const timersPerType_max = 15;
