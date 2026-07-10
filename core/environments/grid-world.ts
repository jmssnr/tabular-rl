import { Action, Cell, Grid, Position, StateReward } from "@/core/types";
import { ACTIONFOUR } from "@/core/utils/actions";
import { fillGrid } from "@/core/utils/fill-grid";
import { KeyValueStore } from "@/core/utils/key-value-store";

export abstract class GridWorld<State extends { position: Position }> {
  nrows: number;
  ncols: number;
  grid: KeyValueStore<Position, Cell>;
  action = ACTIONFOUR;

  constructor(shape: [number, number], grid: Grid) {
    this.nrows = shape[0];
    this.ncols = shape[1];
    this.grid = fillGrid(shape, grid);
  }

  protected getCell(position: Position): Cell {
    const cell = this.grid.get(position);
    return cell !== undefined ? cell : { kind: "empty" };
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

    const result: StateReward<State> = {
      state: { ...state, position: nextPosition },
      reward: 0,
    };

    return result;
  }
}
