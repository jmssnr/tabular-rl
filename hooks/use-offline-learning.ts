import { Environment } from "@/core/dynamics/environment";
import { GridState } from "@/core/dynamics/types";
import { learning } from "@/core/rl/learning";
import { playing } from "@/core/rl/playing";
import { QTable } from "@/core/rl/q-table";
import { LearningConfig, ValueUpdate } from "@/core/rl/types";
import { useAnimation } from "@/hooks/use-animation";
import { useEffect, useRef } from "react";

export function useOfflineLearning<State extends GridState>(
  startingState: State,
  environment: Environment<State>,
  update: ValueUpdate<State>,
  config: Partial<LearningConfig> = {},
  throttle = 50,
) {
  const agent = useRef<ReturnType<typeof playing<State>>>(null);

  useEffect(() => {
    const Q = new QTable<State>();
    const learningGenerator = learning(
      environment,
      startingState,
      Q,
      update,
      config,
    );
    for (const _ of learningGenerator) {
    }
    agent.current = playing(environment, Q, startingState);
  }, []);

  const initial = {
    trajectory: [startingState],
    state: startingState,
  };

  return useAnimation(
    initial,
    (prev) => {
      if (!agent.current) return prev;
      const result = agent.current.next();
      return result.done ? prev : result.value;
    },
    throttle,
  );
}
