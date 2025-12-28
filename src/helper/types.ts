export enum ComponentStates {
  running_fine = "RUNNING_FINE", // GREEn
  backing_up = "BACKING_UP", // YELLOW
  error_stale = "ERROR_STALE", // dark ORANGE
  error_occuring = "ERROR_OCCURING", // RED
  starting = "STARTING", //blue
  dead = "DEAD",
  initial_off = "INITIAL_OFF"
}
