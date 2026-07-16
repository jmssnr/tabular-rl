import { FactoryWorld } from "@/core/environments/factory-world";
import { KeyValueStore } from "@/core/utils/key-value-store";

export const SMALLFACTORY = new FactoryWorld(
  [5, 5],
  new KeyValueStore([
    [[0, 2], { kind: "obstacle" }],
    [[0, 1], { kind: "obstacle" }],
    [[2, 2], { kind: "obstacle" }],
    [[2, 0], { kind: "obstacle" }],
    [[2, 4], { kind: "obstacle" }],
    [[4, 2], { kind: "obstacle" }],
    [[4, 4], { kind: "pickup" }],
    [[0, 4], { kind: "machine", bufferCapacity: 1, rate: 0.01 }],
    [[4, 0], { kind: "machine", bufferCapacity: 1, rate: 0.01 }],
  ]),
);
