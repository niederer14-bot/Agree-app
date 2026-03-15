import React from 'react';

export function useSessionCountdown(initialSeconds: number, isRunning: boolean) {
  const [secondsLeft, setSecondsLeft] = React.useState(initialSeconds);

  React.useEffect(() => {
    setSecondsLeft(initialSeconds);
  }, [initialSeconds]);

  React.useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [isRunning, secondsLeft]);

  return {
    secondsLeft,
    isExpired: secondsLeft <= 0,
    reset: () => setSecondsLeft(initialSeconds)
  };
}
