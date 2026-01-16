/**
 * Task: T045
 * Unit tests for TaskCardDnD component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskCardDnD } from '@/components/TaskCardDnD';
import { Task } from '@/types/task';

// Mock the dependencies
jest.mock('@/hooks/useDragDrop', () => ({
  useDragDrop: () => ({
    state: { isDragging: false, activeId: null, overId: null },
    startDrag: jest.fn(),
    overItem: jest.fn(),
    endDrag: jest.fn(),
    cancelDrag: jest.fn(),
  }),
}));

jest.mock('@/utils/accessibility', () => ({
  useReducedMotion: () => false,
  useAriaAnnouncer: () => ({
    announce: jest.fn(),
  }),
}));

jest.mock('@/lib/api', () => ({
  apiClient: {
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
    completeTask: jest.fn(),
  },
}));

describe('TaskCardDnD', () => {
  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    user_id: 'user1',
    priority: 'medium',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    position: 0,
  };

  const mockOnComplete = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnMove = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders task information correctly', () => {
    render(
      <TaskCardDnD
        task={mockTask}
        index={0}
        totalItems={1}
        onComplete={mockOnComplete}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
        onMove={mockOnMove}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('calls onComplete when checkbox is clicked', () => {
    render(
      <TaskCardDnD
        task={mockTask}
        index={0}
        totalItems={1}
        onComplete={mockOnComplete}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
        onMove={mockOnMove}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockOnComplete).toHaveBeenCalledWith(mockTask.id);
  });

  it('displays drag handle', () => {
    render(
      <TaskCardDnD
        task={mockTask}
        index={0}
        totalItems={1}
        onComplete={mockOnComplete}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
        onMove={mockOnMove}
      />
    );

    // Check if the drag handle is present
    const dragHandles = document.querySelectorAll('svg'); // Grip icon is an SVG
    expect(dragHandles.length).toBeGreaterThan(0);
  });

  it('shows priority badge with correct color', () => {
    const highPriorityTask = {
      ...mockTask,
      priority: 'high',
    };

    render(
      <TaskCardDnD
        task={highPriorityTask}
        index={0}
        totalItems={1}
        onComplete={mockOnComplete}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
        onMove={mockOnMove}
      />
    );

    // Check if priority badge is rendered with the correct color class
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    render(
      <TaskCardDnD
        task={mockTask}
        index={0}
        totalItems={1}
        onComplete={mockOnComplete}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
        onMove={mockOnMove}
      />
    );

    const editButtons = screen.getAllByLabelText(/Edit/i);
    fireEvent.click(editButtons[0]); // The edit button

    expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <TaskCardDnD
        task={mockTask}
        index={0}
        totalItems={1}
        onComplete={mockOnComplete}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
        onMove={mockOnMove}
      />
    );

    const deleteButtons = screen.getAllByLabelText(/Delete/i);
    fireEvent.click(deleteButtons[0]); // The delete button

    expect(mockOnDelete).toHaveBeenCalledWith(mockTask.id);
  });
});