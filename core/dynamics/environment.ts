import { ACTIONFOUR } from "@/core/dynamics/actions";
import { Grid } from "@/core/dynamics/grid";
import {
  Action,
  Cell,
  CellTransitions,
  GlobalTransitions,
  GridState,
  StateReward,
  Transition,
} from "@/core/dynamics/types";

export class Environment<State extends GridState> {
  grid: Grid;
  actions: Array<Action>;
  cellTransitions: CellTransitions<State>;
  globalTransitions: GlobalTransitions<State>;

  constructor({
    grid,
    cellTransitions,
    globalTransitions,
    actions,
  }: {
    grid: Grid;
    cellTransitions: CellTransitions<State>;
    globalTransitions: GlobalTransitions<State>;
    actions?: Array<Action>;
  }) {
    this.grid = grid;
    this.cellTransitions = cellTransitions;
    this.globalTransitions = globalTransitions;
    this.actions = actions ?? ACTIONFOUR;
  }

  private applyTransitions(
    initial: StateReward<State>,
    action: Action,
    cell: Cell,
  ) {
    let result = initial;

    const cellTransition = this.cellTransitions[cell.kind] as
      | Transition<State, typeof cell>
      | undefined;

    if (cellTransition) {
      result = cellTransition({ result, cell, action });
      if (result.stop) return result;
    }

    for (const transition of this.globalTransitions) {
      result = transition({ result, cell, action });
      if (result.stop) return result;
    }

    return result;
  }

  act(state: State, action: Action): StateReward<State> {
    const nextPosition = this.grid.move(state.position, action);
    const nextCell = this.grid.getCell(nextPosition);

    let result: StateReward<State> = {
      state: { ...state, position: nextPosition },
      reward: 0,
    };

    return this.applyTransitions(result, action, nextCell);
  }
}
