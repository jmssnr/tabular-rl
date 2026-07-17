import { Environment } from "@/core/dynamics/environment";
import { Cell, GridState } from "@/core/dynamics/types";

import { range } from "d3-array";
import { line } from "d3-shape";

const DEFAULT_PADDING = 2;

const cellStyle: Partial<Record<Cell["kind"], string>> = {
  empty: "fill-gray-100 stroke-gray-200",
  obstacle: "fill-gray-300 stroke-gray-400",
  terminal: "fill-teal-300 stroke-teal-400",
  pickup: "fill-amber-300 stroke-amber-400",
};

const TopView = <State extends GridState>(props: {
  width: number;
  world: Environment<State>;
  state: State;
  trajectory: Array<State>;
  padding?: number;
}) => {
  const { width, world, state, trajectory, padding = DEFAULT_PADDING } = props;
  const cellSize = width / world.grid.ncols;
  const height = cellSize * world.grid.nrows;

  const linePath = line<State>()
    .x((state) => state.position[1] * cellSize + cellSize / 2)
    .y((state) => state.position[0] * cellSize + cellSize / 2);

  const cells = range(world.grid.nrows).map((row) =>
    range(world.grid.ncols).map((col) => {
      const cell = world.grid.getCell([row, col]);

      return (
        <rect
          key={`row-${row}-col-${col}`}
          width={cellSize - padding}
          height={cellSize - padding}
          x={col * cellSize}
          y={row * cellSize}
          className={cellStyle[cell.kind]}
        />
      );
    }),
  );

  return (
    <svg width={width} height={height}>
      {cells}
      <path
        d={linePath(trajectory) ?? ""}
        className="fill-none stroke-1 stroke-violet-800"
      />
      <circle
        cx={state.position[1] * cellSize + cellSize / 2}
        cy={state.position[0] * cellSize + cellSize / 2}
        r={5}
        className="stroke-violet-900 fill-violet-500"
      />
    </svg>
  );
};

export default TopView;
