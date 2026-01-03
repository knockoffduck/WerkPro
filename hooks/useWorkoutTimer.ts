import { useState, useEffect } from 'react';

/**
 * Hook to calculate and format the duration of a workout.
 * @param startTime The start time of the workout.
 * @returns Formatted duration string (e.g., "12:34" or "1:02:34").
 */
export function useWorkoutTimer(startTime: Date | string | null) {
  const [duration, setDuration] = useState('0:00');

  useEffect(() => {
    if (!startTime) {
      setDuration('0:00');
      return;
    }

    const start = typeof startTime === 'string' ? new Date(startTime) : startTime;

    const updateTimer = () => {
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - start.getTime()) / 1000);

      if (diffInSeconds < 0) {
        setDuration('0:00');
        return;
      }

      const hours = Math.floor(diffInSeconds / 3600);
      const minutes = Math.floor((diffInSeconds % 3600) / 60);
      const seconds = diffInSeconds % 60;

      const paddedMinutes = minutes.toString().padStart(2, '0');
      const paddedSeconds = seconds.toString().padStart(2, '0');

      if (hours > 0) {
        setDuration(`${hours}:${paddedMinutes}:${paddedSeconds}`);
      } else {
        // For minutes, we don't necessarily need to pad the first digit if it's < 10,
        // but often apps show 0:01, 1:00 etc. 
        // Let's go with M:SS for minutes < 60 and H:MM:SS for hours > 0.
        // If minutes < 10, it's just M:SS.
        setDuration(`${minutes}:${paddedSeconds}`);
      }
    };

    updateTimer(); // Initial call
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return duration;
}
