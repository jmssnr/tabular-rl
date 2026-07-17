import { QTable } from "@/core/types";

export type Policy<State> = (state: State) => number;

export type UpdateContext<State> = {
  Q: QTable<State>;
  state: State;
  action: number;
  reward: number;
  statePrime: State;
  actionPrime: number;
  stop: boolean;
  gamma: number;
  alpha: number;
};

export type ValueUpdate<State> = (ctx: UpdateContext<State>) => void;

export type LearningConfig = {
  epsilon: number;
  gamma: number;
  alpha: number;
  numEpisodes: number;
  maxStepsPerEpisode: number;
  maxTrajectoryLength: number;
};
