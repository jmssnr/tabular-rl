"use client";

import FactoryTopView from "@/components/factory-top-view";
import { SMALLFACTORY } from "@/core/examples/small-factory";
import { Position } from "@/core/types";
import { KeyValueStore } from "@/core/utils/key-value-store";
import { useRLAgent } from "@/hooks/use-rl-agent";

export default function Home() {
  const world = SMALLFACTORY;
  const result = useRLAgent(
    {
      position: [1, 1],
      hasItem: 0,
      buffers: new KeyValueStore<Position, number>([
        [[0, 4], 0],
        [[4, 0], 0],
      ]),
    } as const,
    world,
  );
  return (
    <main className="w-screen h-screen grid place-content-center">
      <FactoryTopView width={400} world={world} state={result.state} />
    </main>
  );
}
