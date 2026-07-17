"use client";

import TopView from "@/components/top-view";
import { MazeState } from "@/core/dynamics/worlds/maze";
import { LARGE_MAZE_WORLD } from "@/core/examples/large-maze";
import { dynaQ } from "@/core/rl/updates/dyna-q";
import { useOfflineLearning } from "@/hooks/use-offline-learning";

export default function Home() {
  const world = LARGE_MAZE_WORLD;
  const initialState: MazeState = { position: [1, 1] };
  const result = useOfflineLearning(
    initialState,
    world,
    dynaQ({ numPlanningSteps: 20 }),
  );

  return (
    <main className="w-screen h-screen grid place-content-center">
      <TopView
        width={400}
        world={world}
        state={result.state}
        trajectory={result.trajectory}
      />
    </main>
  );
}
