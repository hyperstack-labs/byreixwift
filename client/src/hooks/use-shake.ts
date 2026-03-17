import { useState } from "react";

export function useShake() {
  const [shakeTrigger, setShakeTrigger] = useState(0);

  const triggerShake = () => {
    setShakeTrigger((prev) => prev + 1);
  };

  return { shakeTrigger, triggerShake };
}
