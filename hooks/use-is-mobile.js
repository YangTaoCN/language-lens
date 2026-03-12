import { useState, useEffect } from 'react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // A simple check for touch support to detect mobile devices.
    // This runs only on the client-side.
    const mobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsMobile(mobile);
  }, []);

  return isMobile;
}
