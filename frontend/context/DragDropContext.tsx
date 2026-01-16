/**
 * Task: T005
 * Spec: Phase 1 UI Enhancements
 */

'use client';

import { createContext, useContext, ReactNode } from 'react';

interface DragDropContextType {
  // Add any context values needed for drag-and-drop functionality
}

const DragDropContext = createContext<DragDropContextType | undefined>(undefined);

interface DragDropProviderProps {
  children: ReactNode;
}

export function DragDropProvider({ children }: DragDropProviderProps) {
  const contextValue: DragDropContextType = {};

  return (
    <DragDropContext.Provider value={contextValue}>
      {children}
    </DragDropContext.Provider>
  );
}

export function useDragDropContext() {
  const context = useContext(DragDropContext);
  if (context === undefined) {
    throw new Error('useDragDropContext must be used within a DragDropProvider');
  }
  return context;
}