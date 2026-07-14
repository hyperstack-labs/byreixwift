" use client";

import { useRef, useEffect } from "react";

export interface Adimpression {
  adId: string;
  timestamp: number;
}

export interface AdClick {
  adId: string;
  timestamp: number;
}

export const useAdTracking = (adId: string) => {
  const hasTrackedImpression = useRef(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasTrackedImpression.current) {
        hasTrackedImpression.current = true;

        const impression: Adimpression = {
          adId,
          timestamp: Date.now(),
        };

        console.log("Ad Impression Tracked:", impression);
      }
    });

    observer.observe(elementRef.current);

    return () => {
      observer.disconnect();
    };
  }, [adId]);

  const trackAdClick = () => {
    const click: AdClick = {
      adId,
      timestamp: Date.now(),
    };

    console.log("Ad Click Tracked:", click);
  };

  return { elementRef, trackAdClick };
};
