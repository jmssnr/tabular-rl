import { GridWorld } from "@/core/environments/grid-world";
import { CellKind, Position } from "@/core/types";
import { range } from "d3-array";
import { line } from "d3-shape";

const DEFAULT_PADDING = 2;

const cellStyle: Partial<Record<CellKind, string>> = {
  empty: "fill-gray-100 stroke-gray-200",
  obstacle: "fill-gray-300 stroke-gray-400",
  terminal: "fill-teal-300 stroke-teal-400",
  pickup: "fill-amber-300 stroke-amber-400",
};

const TopView = <State extends { position: Position }>(props: {
  width: number;
  world: GridWorld<State>;
  state: State;
  trajectory: Array<State>;
  padding?: number;
}) => {
  const { width, world, state, trajectory, padding = DEFAULT_PADDING } = props;
  const cellSize = width / world.ncols;
  const height = cellSize * world.nrows;

  const linePath = line<State>()
    .x((state) => state.position[1] * cellSize + cellSize / 2)
    .y((state) => state.position[0] * cellSize + cellSize / 2);

  const cells = range(world.nrows).map((row) =>
    range(world.ncols).map((col) => {
      const cell = world.getCell([row, col]);

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
