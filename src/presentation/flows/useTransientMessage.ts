import { useEffect, useState } from 'react';

export function useTransientMessage(duration = 2200) {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!message) return;
    const timeout = window.setTimeout(() => setMessage(null), duration);
    return () => window.clearTimeout(timeout);
  }, [duration, message]);

  return [message, setMessage] as const;
}
