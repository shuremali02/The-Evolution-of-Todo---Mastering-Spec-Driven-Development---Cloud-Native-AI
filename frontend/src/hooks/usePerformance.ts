/**
 * Task: T026
 * Spec: Phase 1 UI Enhancements
 */

import { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsed?: number;
  timestamp: number;
}

interface UsePerformanceOptions {
  interval?: number; // Interval in milliseconds to measure performance
  threshold?: number; // Threshold in FPS below which to trigger callback
  onLowPerformance?: (metrics: PerformanceMetrics) => void;
}

export function usePerformance(options: UsePerformanceOptions = {}) {
  const {
    interval = 1000, // Default to measuring every second
    threshold = 30, // Default to 30 FPS threshold
    onLowPerformance
  } = options;

  const frameCount = useRef(0);
  const startTime = useRef(performance.now());
  const lastTime = useRef(performance.now());
  const animationFrameRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const measurePerformance = () => {
      const currentTime = performance.now();
      frameCount.current += 1;

      // Calculate FPS every interval
      if (currentTime - startTime.current >= interval) {
        const elapsed = currentTime - startTime.current;
        const fps = Math.round((frameCount.current * 1000) / elapsed);
        const avgFrameTime = elapsed / frameCount.current;

        // Get memory info if available
        let memoryUsed: number | undefined;
        if ('memory' in performance) {
          memoryUsed = (performance as any).memory.usedJSHeapSize;
        }

        const metrics: PerformanceMetrics = {
          fps,
          frameTime: avgFrameTime,
          memoryUsed,
          timestamp: Date.now(),
        };

        // Check if performance is below threshold
        if (fps < threshold && onLowPerformance) {
          onLowPerformance(metrics);
        }

        // Reset counters
        frameCount.current = 0;
        startTime.current = currentTime;
      }

      lastTime.current = currentTime;
      animationFrameRef.current = requestAnimationFrame(measurePerformance);
    };

    animationFrameRef.current = requestAnimationFrame(measurePerformance);

    // Clean up
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [interval, threshold, onLowPerformance]);

  // Function to manually measure performance
  const measure = (): PerformanceMetrics => {
    const currentTime = performance.now();
    const elapsed = currentTime - lastTime.current;
    const fps = elapsed > 0 ? Math.round(1000 / elapsed) : 0;

    let memoryUsed: number | undefined;
    if ('memory' in performance) {
      memoryUsed = (performance as any).memory.usedJSHeapSize;
    }

    return {
      fps,
      frameTime: elapsed,
      memoryUsed,
      timestamp: Date.now(),
    };
  };

  return {
    measure,
  };
}

// Hook to monitor animation performance specifically
export function useAnimationPerformance() {
  const [fps, setFps] = useState(60);
  const [isHighPerformance, setIsHighPerformance] = useState(true);

  usePerformance({
    interval: 500, // Check every half second
    threshold: 30,
    onLowPerformance: (metrics) => {
      setFps(metrics.fps);
      setIsHighPerformance(metrics.fps >= 30);
    }
  });

  return { fps, isHighPerformance };
}

// Hook to monitor rendering performance
export function useRenderPerformance(componentName: string) {
  const renderStartTime = useRef<number | null>(null);
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    console.debug(`[${componentName}] Render #${renderCount.current}, Time: ${Date.now()}`);
  });

  const startRenderTiming = () => {
    renderStartTime.current = performance.now();
  };

  const endRenderTiming = () => {
    if (renderStartTime.current) {
      const renderTime = performance.now() - renderStartTime.current;
      console.debug(`[${componentName}] Render time: ${renderTime.toFixed(2)}ms`);
      renderStartTime.current = null;

      // Log warning if render is taking too long
      if (renderTime > 16.67) { // More than one frame at 60fps
        console.warn(`[${componentName}] Slow render detected: ${renderTime.toFixed(2)}ms`);
      }
    }
  };

  return { startRenderTiming, endRenderTiming };
}