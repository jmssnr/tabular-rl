"use client";

import TopView from "@/components/top-view";
import { DeliveryState } from "@/core/dynamics/worlds/delivery";
import { LARGE_DELIVERY_WORLD } from "@/core/examples/large-delivery-maze";
import { prioritizedSweeping } from "@/core/rl/updates/prioritized-sweeping";
import { useOnlineLearning } from "@/hooks/use-online-learning";

export default function Home() {
  const world = LARGE_DELIVERY_WORLD;
  const initialState: DeliveryState = { position: [1, 1], hasItem: 0 };
  const result = useOnlineLearning(
    initialState,
    world,
    prioritizedSweeping({ numPlanningSteps: 50, theta: 0.1 }),
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
