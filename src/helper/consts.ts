export enum ComponentStates {
  running_fine = "RUNNING_FINE", // GREEn
  backing_up = "BACKING_UP", // YELLOW
  error_stale = "ERROR_STALE", // dark ORANGE
  error_occuring = "ERROR_OCCURING", // RED
  starting = "STARTING", //blue
  dead = "DEAD",
  initial_off = "INITIAL_OFF"
}

export const StatesFlow: { [key in ComponentStates]: { item: ComponentStates; weight: number }[] } = {
  [ComponentStates.initial_off]: [
    { item: ComponentStates.initial_off, weight: 1 },
    { item: ComponentStates.starting, weight: 3 }
  ],
  [ComponentStates.starting]: [
    { item: ComponentStates.running_fine, weight: 10 },
    { item: ComponentStates.error_occuring, weight: 5 },
    { item: ComponentStates.dead, weight: 1 }
  ],
  [ComponentStates.running_fine]: [
    { item: ComponentStates.running_fine, weight: 7 },
    { item: ComponentStates.error_occuring, weight: 2 },
    { item: ComponentStates.dead, weight: 1 }
  ],
  [ComponentStates.error_occuring]: [
    { item: ComponentStates.error_occuring, weight: 5 },
    { item: ComponentStates.error_stale, weight: 5 },
    { item: ComponentStates.dead, weight: 3 }
  ],
  [ComponentStates.dead]: [
    { item: ComponentStates.dead, weight: 1 },
    { item: ComponentStates.backing_up, weight: 5 }
  ],
  [ComponentStates.backing_up]: [
    { item: ComponentStates.running_fine, weight: 7 },
    { item: ComponentStates.error_occuring, weight: 2 }
  ],
  [ComponentStates.error_stale]: [
    { item: ComponentStates.error_stale, weight: 5 },
    { item: ComponentStates.backing_up, weight: 7 },
    { item: ComponentStates.dead, weight: 2 }
  ]
};

export const StatesAnimationDuration_S = {
  [ComponentStates.running_fine]: [0, 1.5, 0.7],
  [ComponentStates.backing_up]: [0.5, 1],
  [ComponentStates.starting]: [0.7, 1.5],
  [ComponentStates.error_stale]: [0, 3],
  [ComponentStates.error_occuring]: [0, 0.5, 2, 5],
  [ComponentStates.dead]: [0],
  [ComponentStates.initial_off]: [0]
};
