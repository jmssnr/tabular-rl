import { useEffect, useRef, useState } from "react";

export function useAnimation<T>(
  initial: T,
  callback: (prev: T) => T,
  throttle = 0,
) {
  const [state, setState] = useState<T>(initial);
  const stateRef = useRef<T>(initial);
  const frameIdRef = useRef(0);
  const lastUpdateRef = useRef(0);

  const frame = (time: number) => {
    if (time - lastUpdateRef.current >= throttle) {
      lastUpdateRef.current = time;
      stateRef.current = callback(stateRef.current);
      setState(stateRef.current);
      frameIdRef.current = requestAnimationFrame(frame);
    } else {
      frameIdRef.current = requestAnimationFrame(frame);
    }
  };

  useEffect(() => {
    frameIdRef.current = requestAnimationFrame(frame);

    return () => cancelAnimationFrame(frameIdRef.current);
  }, []);

  return state;
}
