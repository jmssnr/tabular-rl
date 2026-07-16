import { sarsa, type SarsaConfig } from "@/core/algorithms/sarsa";
import { GridWorld } from "@/core/environments/grid-world";
import { Position } from "@/core/types";
import { useAnimation } from "@/hooks/use-animation";
import { useRef } from "react";

export function useRLAgent<State extends { position: Position }>(
  start: State,
  world: GridWorld<State>,
  config: SarsaConfig = {},
) {
  const algorithm = useRef(sarsa(start, world, config));

  const initial = {
    episode: 0,
    trajectory: [start],
    state: start,
  };

  return useAnimation(
    initial,
    (prev) => {
      const result = algorithm.current.next();
      return result.done ? prev : result.value;
    },
    50,
  );
}
