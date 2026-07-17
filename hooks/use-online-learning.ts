import { Environment } from "@/core/dynamics/environment";
import { GridState } from "@/core/dynamics/types";
import { learning } from "@/core/rl/learning";
import { QTable } from "@/core/rl/q-table";
import { LearningConfig, ValueUpdate } from "@/core/rl/types";
import { useAnimation } from "@/hooks/use-animation";
import { useRef } from "react";

export function useOnlineLearning<State extends GridState>(
  startingState: State,
  environment: Environment<State>,
  update: ValueUpdate<State>,
  config: Partial<LearningConfig>,
  throttle = 50,
) {
  const agent = useRef(
    learning(environment, startingState, new QTable(), update, config),
  );

  const initial = {
    trajectory: [startingState],
    state: startingState,
  };

  return useAnimation(
    initial,
    (prev) => {
      const result = agent.current.next();
      return result.done ? prev : result.value;
    },
    throttle,
  );
}
