import { useEffect, useState } from "react";

const hasDeadlinePassed = (value?: string) => {
  if (!value) return false;
  const deadline = new Date(value).getTime();
  return Number.isFinite(deadline) && deadline <= Date.now();
};

export const useDeadlineStatus = (value?: string, refreshMs = 60_000) => {
  const [hasPassed, setHasPassed] = useState(() => hasDeadlinePassed(value));

  useEffect(() => {
    const updateStatus = () => setHasPassed(hasDeadlinePassed(value));
    updateStatus();
    const timer = window.setInterval(updateStatus, refreshMs);
    return () => window.clearInterval(timer);
  }, [refreshMs, value]);

  return hasPassed;
};
