import {
  Action,
  Cell,
  CellBasedTransitions,
  GlobalTransitions,
  Grid,
  Position,
  StateReward,
  Transition,
} from "@/core/types";
import { ACTIONFOUR } from "@/core/utils/actions";
import { addDefaults } from "@/core/utils/add-defaults";
import { fillGrid } from "@/core/utils/fill-grid";
import { KeyValueStore } from "@/core/utils/key-value-store";
import { range } from "d3-array";

export abstract class GridWorld<
  State extends { position: Position },
  Config extends object = object,
> {
  nrows: number;
  ncols: number;
  grid: KeyValueStore<Position, Cell>;
  actions = ACTIONFOUR;
  config: Config;
  abstract states: Array<State>;
  abstract cellBasedTransitions: CellBasedTransitions<State>;
  abstract globalTransitions: GlobalTransitions<State>;

  constructor(
    shape: [number, number],
    grid: Grid,
    config: Partial<Config> = {},
    defaults: Config,
  ) {
    this.nrows = shape[0];
    this.ncols = shape[1];
    this.grid = fillGrid(shape, grid);
    this.config = addDefaults(config, defaults);
  }

  getCell(position: Position): Cell {
    const cell = this.grid.get(position);
    return cell !== undefined ? cell : { kind: "empty" };
  }

  protected walkablePositions(): Array<Position> {
    return range(this.nrows)
      .flatMap((row) => range(this.ncols).map((col): Position => [row, col]))
      .filter((pos) => this.getCell(pos).kind !== "obstacle");
  }

  private clip(position: Position): Position {
    const [row, col] = position;
    return [
      Math.max(0, Math.min(this.nrows - 1, row)),
      Math.max(0, Math.min(this.ncols - 1, col)),
    ];
  }

  private move(position: Position, action: Action): Position {
    const candidatePosition: Position = [
      position[0] + action[0],
      position[1] + action[1],
    ];
    return this.getCell(candidatePosition).kind === "obstacle"
      ? position
      : this.clip(candidatePosition);
  }

  act(state: State, action: Action): StateReward<State> {
    const nextPosition = this.move(state.position, action);
    const nextCell = this.getCell(nextPosition);

    let result: StateReward<State> = {
      state: { ...state, position: nextPosition },
      reward: 0,
    };

    const cellTransition = this.cellBasedTransitions[nextCell.kind] as
      | Transition<State, typeof nextCell>
      | undefined;

    if (cellTransition) {
      result = cellTransition({ result, action, cell: nextCell });
      if (result.stop) return result;
    }

    for (const transition of this.globalTransitions) {
      result = transition({ result, action, cell: nextCell });
      if (result.stop) return result;
    }

    return result;
  }
}
