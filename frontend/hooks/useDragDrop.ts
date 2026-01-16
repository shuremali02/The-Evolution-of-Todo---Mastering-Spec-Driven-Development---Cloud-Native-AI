/**
 * Task: T006
 * Spec: Phase 1 UI Enhancements
 */

import { useState, useCallback } from 'react';

interface DragDropState {
  isDragging: boolean;
  activeId: string | null;
  overId: string | null;
}

export function useDragDrop() {
  const [state, setState] = useState<DragDropState>({
    isDragging: false,
    activeId: null,
    overId: null,
  });

  const startDrag = useCallback((activeId: string) => {
    setState(prev => ({
      ...prev,
      isDragging: true,
      activeId,
    }));
  }, []);

  const overItem = useCallback((overId: string) => {
    setState(prev => ({
      ...prev,
      overId,
    }));
  }, []);

  const endDrag = useCallback(() => {
    setState({
      isDragging: false,
      activeId: null,
      overId: null,
    });
  }, []);

  const cancelDrag = useCallback(() => {
    setState({
      isDragging: false,
      activeId: null,
      overId: null,
    });
  }, []);

  return {
    state,
    startDrag,
    overItem,
    endDrag,
    cancelDrag,
  };
}