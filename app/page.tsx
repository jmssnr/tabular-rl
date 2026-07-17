"use client";

import TopView from "@/components/top-view";
import { DeliveryState } from "@/core/dynamics/worlds/delivery";
import { MazeState } from "@/core/dynamics/worlds/maze";
import { LARGE_DELIVERY_WORLD } from "@/core/examples/large-delivery-maze";
import { LARGE_MAZE_WORLD } from "@/core/examples/large-maze";
import { dynaQ } from "@/core/rl/updates/dyna-q";
import { useOnlineLearning } from "@/hooks/use-online-learning";

export default function Home() {
  const world = LARGE_DELIVERY_WORLD;
  const initialState: DeliveryState = { position: [1, 1], hasItem: 0 };
  const result = useOnlineLearning(
    initialState,
    world,
    dynaQ({ numPlanningSteps: 20 }),
  );

  return (
    <main className="w-screen h-screen grid place-content-center bg-white">
      <TopView
        width={400}
        world={world}
        state={result.state}
        trajectory={result.trajectory}
      />
    </main>
  );
}
