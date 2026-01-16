/**
 * Task: T013
 * Spec: Phase 1 UI Enhancements
 */

import { useEffect, useState } from 'react';

/**
 * Custom hook to detect if user prefers reduced motion
 * @returns boolean indicating if reduced motion is preferred
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    // Check if window is available (client-side)
    if (typeof window === 'undefined') {
      return false;
    }

    // Check for the reduced motion media query
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Listen for changes to the preference
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup listener on unmount
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Function to conditionally apply animation styles based on user preference
 * @param animationStyles Styles to apply when animations are enabled
 * @param reducedMotionStyles Styles to apply when animations are disabled
 * @returns The appropriate styles based on user preference
 */
export function getAnimationStyles(
  animationStyles: React.CSSProperties,
  reducedMotionStyles: React.CSSProperties = {}
): React.CSSProperties {
  const prefersReducedMotion = useReducedMotion();
  return prefersReducedMotion ? reducedMotionStyles : animationStyles;
}

/**
 * Hook to manage focus trap for modal dialogs and other focus-controlling components
 * @param ref Reference to the element that should contain focus
 * @param isActive Whether the focus trap is currently active
 */
export function useFocusTrap(ref: React.RefObject<HTMLElement>, isActive: boolean) {
  useEffect(() => {
    if (!isActive || !ref.current) return;

    const focusableElements = ref.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    };

    // Focus the first element when trap activates
    firstElement?.focus();

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, ref]);
}

/**
 * Hook to announce changes to screen readers using an aria-live region
 */
export function useAriaAnnouncer() {
  const announce = (message: string, politeness: 'polite' | 'assertive' = 'polite') => {
    // Create announcement element if it doesn't exist
    let announcer = document.getElementById('aria-announcer');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.setAttribute('id', 'aria-announcer');
      announcer.setAttribute('aria-live', politeness);
      announcer.setAttribute('aria-atomic', 'true');
      announcer.setAttribute('style', `
        position: absolute;
        left: -9999px;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        clip-path: inset(50%);
        white-space: nowrap;
      `);
      document.body.appendChild(announcer);
    }

    // Update the announcement text
    announcer.textContent = message;

    // Clear the announcement after a delay to prevent repeated announcements
    setTimeout(() => {
      if (announcer) {
        announcer.textContent = '';
      }
    }, 1000);
  };

  return { announce };
}

/**
 * Utility function to generate proper ARIA attributes for drag and drop
 * @param id The ID of the draggable element
 * @param index The position index of the element
 * @param total Total number of draggable elements
 * @param isDragging Whether the element is currently being dragged
 * @returns ARIA attributes object
 */
export function getDragDropAriaAttributes(
  id: string,
  index: number,
  total: number,
  isDragging = false
): React.AriaAttributes & { role: string } {
  return {
    role: 'listitem',
    'aria-grabbed': isDragging,
    'aria-describedby': `${id}-description`,
    'aria-setsize': total,
    'aria-posinset': index + 1,
  };
}

/**
 * Utility function to generate ARIA description for drag and drop elements
 * @param label The label of the draggable element
 * @param index The position index of the element
 * @param total Total number of draggable elements
 * @returns ARIA description string
 */
export function getDragDropAriaDescription(
  label: string,
  index: number,
  total: number
): string {
  return `${label}. Item ${index + 1} of ${total}. Press spacebar to grab, arrow keys to move, enter to drop, escape to cancel.`;
}

/**
 * Hook to manage keyboard navigation for focusable elements
 * @param ref Reference to the container element
 * @param selector Selector for focusable child elements
 */
export function useKeyboardNavigation(
  ref: React.RefObject<HTMLElement>,
  selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
) {
  const focusNext = (current: HTMLElement) => {
    if (!ref.current) return;

    const focusable = Array.from(ref.current.querySelectorAll(selector)) as HTMLElement[];
    const currentIndex = focusable.indexOf(current);
    const nextIndex = (currentIndex + 1) % focusable.length;
    focusable[nextIndex]?.focus();
  };

  const focusPrev = (current: HTMLElement) => {
    if (!ref.current) return;

    const focusable = Array.from(ref.current.querySelectorAll(selector)) as HTMLElement[];
    const currentIndex = focusable.indexOf(current);
    const prevIndex = ((currentIndex - 1) + focusable.length) % focusable.length;
    focusable[prevIndex]?.focus();
  };

  return { focusNext, focusPrev };
}

/**
 * Hook to manage focus visibility for keyboard vs mouse navigation
 */
export function useFocusVisible() {
  const [isUsingKeyboard, setIsUsingKeyboard] = useState(false);

  useEffect(() => {
    const handleMouseDown = () => setIsUsingKeyboard(false);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') setIsUsingKeyboard(true);
    };

    document.addEventListener('mousedown', handleMouseDown, true);
    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown, true);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, []);

  return isUsingKeyboard;
}