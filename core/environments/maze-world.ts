import { GridWorld } from "@/core/environments/grid-world";
import {
  CellBasedTransitions,
  GlobalTransitions,
  Grid,
  Position,
} from "@/core/types";

const DEFAULTS = {
  stepPenalty: -1,
  terminalReward: 0,
};

type Config = typeof DEFAULTS;
type State = { position: Position };

export class MazeWorld extends GridWorld<State, Config> {
  states: State[];
  cellBasedTransitions: CellBasedTransitions<State>;
  globalTransitions: GlobalTransitions<State>;

  constructor(
    shape: [number, number],
    grid: Grid,
    config: Partial<Config> = {},
  ) {
    super(shape, grid, config, DEFAULTS);

    this.states = this.walkablePositions().map((position) => ({
      position,
    }));

    this.cellBasedTransitions = {
      terminal: (ctx) => ({
        ...ctx.result,
        reward: ctx.result.reward + this.config.terminalReward,
        stop: true,
      }),
    };

    this.globalTransitions = [
      (ctx) => ({
        ...ctx.result,
        reward: ctx.result.reward + this.config.stepPenalty,
      }),
    ];
  }
}
