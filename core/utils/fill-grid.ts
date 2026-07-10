import { Grid } from "@/core/types";

export function fillGrid(shape: [number, number], grid: Grid) {
  for (let row = 0; row < shape[0]; row++) {
    for (let col = 0; col < shape[1]; col++) {
      if (!grid.has([row, col])) {
        grid.set([row, col], { kind: "empty" });
      }
    }
  }
  return grid
}
