"use client";

import TopView from "@/components/top-view";
import { GridState } from "@/core/dynamics/types";
import { SMALL_MAZE_WORLD } from "@/core/examples/small-maze";
import { qLearning } from "@/core/rl/updates/q-learning";
import { useOnlineLearning } from "@/hooks/use-online-learning";

export default function Home() {
  const world = SMALL_MAZE_WORLD;
  const initialState: GridState = { position: [0, 0] };
  const result = useOnlineLearning(initialState, world, qLearning());

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
