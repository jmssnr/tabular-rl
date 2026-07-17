import { Action, Cell, Position } from "@/core/dynamics/types";

function positionKey([row, col]: Position, ncols: number): number {
  return row * ncols + col;
}

function positionFromKey(key: number, ncols: number): Position {
  return [Math.floor(key / ncols), key % ncols];
}

export class Grid {
  nrows: number;
  ncols: number;
  cells: Map<number, Cell>;

  constructor(shape: [number, number], entries: Array<[Position, Cell]>) {
    this.nrows = shape[0];
    this.ncols = shape[0];
    const mapped = new Map();
    for (const [position, cell] of entries) {
      mapped.set(positionKey(position, this.ncols), cell);
    }
    this.cells = mapped;
  }

  private clip([row, col]: Position): Position {
    return [
      Math.max(0, Math.min(row, this.nrows - 1)),
      Math.max(0, Math.min(col, this.ncols - 1)),
    ];
  }

  getAllCellsOfKind<Kind extends Cell["kind"]>(
    kind: Kind,
  ): Array<[Position, Extract<Cell, { kind: Kind }>]> {
    const cells: Array<[Position, Extract<Cell, { kind: Kind }>]> = [];

    for (const [key, cell] of this.cells) {
      if (cell.kind === kind) {
        cells.push([
          positionFromKey(key, this.ncols),
          cell as Extract<Cell, { kind: Kind }>,
        ]);
      }
    }

    return cells;
  }

  getCell(position: Position): Cell {
    return (
      this.cells.get(positionKey(position, this.ncols)) ?? { kind: "empty" }
    );
  }

  move(position: Position, action: Action) {
    const candidate: Position = [
      position[0] + action[0],
      position[1] + action[1],
    ];
    const clipped = this.clip(candidate);
    return this.getCell(clipped).kind === "obstacle" ? position : clipped;
  }
}
