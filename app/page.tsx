"use client";

import TopView from "@/components/top-view";
import { LARGEDELIVERYMAZE } from "@/core/examples/large-delivery-maze";
import { useRLAgent } from "@/hooks/use-rl-agent";

export default function Home() {
  const world = LARGEDELIVERYMAZE;
  const result = useRLAgent({ position: [1, 1], hasItem: 0 } as const, world);
  return (
    <main className="w-screen h-screen grid place-content-center">
      <TopView
        width={400}
        world={world}
        trajectory={result.trajectory}
        state={result.state}
      />
    </main>
  );
}
