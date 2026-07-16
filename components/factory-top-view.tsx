import { FactoryWorld, State } from "@/core/environments/factory-world";
import { GridWorld } from "@/core/environments/grid-world";
import { CellKind } from "@/core/types";
import { range } from "d3-array";

const DEFAULT_PADDING = 2;

const cellStyle: Partial<Record<CellKind, string>> = {
  empty: "fill-gray-100 stroke-gray-200",
  obstacle: "fill-gray-300 stroke-gray-400",
  terminal: "fill-teal-300 stroke-teal-400",
  pickup: "fill-amber-300 stroke-amber-400",
  machine: "fill-red-300 stroke-red-400",
};

const FactoryTopView = (props: {
  width: number;
  world: GridWorld<State>;
  state: State;
  padding?: number;
}) => {
  const { width, world, state, padding = DEFAULT_PADDING } = props;
  const cellSize = width / world.ncols;
  const height = cellSize * world.nrows;

  const cells = range(world.nrows).map((row) =>
    range(world.ncols).map((col) => {
      const cell = world.getCell([row, col]);
      const machineProgress =
        world instanceof FactoryWorld
          ? (world.progress.get([row, col]) ?? 0)
          : 0;

      return (
        <g key={`row-${row}-col-${col}`}>
          <rect
            width={cellSize - padding}
            height={cellSize - padding}
            x={col * cellSize}
            y={row * cellSize}
            className={cellStyle[cell.kind]}
          />
          {cell.kind === "pickup" && !state.hasItem && (
            <circle
              cx={col * cellSize + cellSize / 2}
              cy={row * cellSize + cellSize / 2}
              r={10}
              className="stroke-amber-400 fill-amber-200"
            />
          )}
          {cell.kind === "machine" && (
            <>
              <rect
                x={col * cellSize + padding / 2}
                y={row * cellSize + cellSize - 10}
                width={cellSize - padding - 2}
                height={4}
                rx={2}
                className="fill-red-100 stroke-red-300"
              />
              <rect
                x={col * cellSize + padding / 2}
                y={row * cellSize + cellSize - 10}
                width={Math.max(
                  0,
                  Math.min(1, machineProgress) * (cellSize - padding - 2),
                )}
                height={4}
                rx={2}
                className="fill-red-700 stroke-red-700"
              />
              {(() => {
                const buffer = state.buffers.get([row, col]) ?? 0;
                return range(cell.bufferCapacity).map((slot) => {
                  const filled = slot < buffer;
                  return (
                    <circle
                      key={slot}
                      cx={
                        col * cellSize +
                        ((slot + 1) * cellSize) / (cell.bufferCapacity + 1)
                      }
                      cy={row * cellSize + cellSize / 2}
                      r={5}
                      className={
                        filled
                          ? "stroke-red-900 fill-red-700"
                          : "stroke-red-700 fill-red-200"
                      }
                    />
                  );
                });
              })()}
            </>
          )}
        </g>
      );
    }),
  );

  return (
    <svg width={width} height={height}>
      {cells}
      <circle
        cx={state.position[1] * cellSize + cellSize / 2}
        cy={state.position[0] * cellSize + cellSize / 2}
        r={5}
        className="stroke-violet-900 fill-violet-500"
      />
    </svg>
  );
};

export default FactoryTopView;
