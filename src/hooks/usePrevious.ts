import { useEffect, useRef } from "react";

export const usePrevious = <T>(state: T) => {
  const valueRef = useRef<T>(state);
  useEffect(() => {
    valueRef.current = state;
  }, [state]);
  return valueRef.current;
};
