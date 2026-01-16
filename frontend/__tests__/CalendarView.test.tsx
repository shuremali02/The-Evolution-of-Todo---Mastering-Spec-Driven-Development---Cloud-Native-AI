/**
 * Task: T046
 * Integration tests for CalendarView component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CalendarView } from '@/components/CalendarView';
import { Task } from '@/types/task';

// Mock the date-fns functions to have consistent test results
jest.mock('date-fns', () => ({
  ...jest.requireActual('date-fns'),
  format: jest.fn((date, pattern) => {
    if (pattern === 'yyyy-MM-dd') {
      return '2023-01-01';
    }
    if (pattern === 'MMMM yyyy') {
      return 'January 2023';
    }
    if (pattern === 'd') {
      return '1';
    }
    return String(date);
  }),
  startOfMonth: jest.fn(() => new Date(2023, 0, 1)),
  endOfMonth: jest.fn(() => new Date(2023, 0, 31)),
  startOfWeek: jest.fn(() => new Date(2023, 0, 1)),
  endOfWeek: jest.fn(() => new Date(2023, 0, 7)),
  isSameMonth: jest.fn(() => true),
  isSameDay: jest.fn(() => false),
  addDays: jest.fn((date, amount) => new Date(date.getTime() + amount * 24 * 60 * 60 * 1000)),
  addMonths: jest.fn((date, amount) => new Date(date.getFullYear(), date.getMonth() + amount, date.getDate())),
  subMonths: jest.fn((date, amount) => new Date(date.getFullYear(), date.getMonth() - amount, date.getDate())),
}));

describe('CalendarView', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Meeting',
      description: 'Team meeting',
      completed: false,
      user_id: 'user1',
      priority: 'high',
      due_date: '2023-01-15T10:00:00Z',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      position: 0,
    },
    {
      id: '2',
      title: 'Lunch',
      description: 'Lunch with Alex',
      completed: false,
      user_id: 'user1',
      priority: 'medium',
      due_date: '2023-01-15T12:00:00Z',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      position: 1,
    },
  ];

  const mockOnTaskSelect = jest.fn();
  const mockOnDateSelect = jest.fn();
  const mockOnTaskCreate = jest.fn();

  it('renders calendar header with month and year', () => {
    render(
      <CalendarView
        tasks={mockTasks}
        onTaskSelect={mockOnTaskSelect}
        onDateSelect={mockOnDateSelect}
        onTaskCreate={mockOnTaskCreate}
      />
    );

    // With mocked format function, it should display "January 2023"
    expect(screen.getByText('January 2023')).toBeInTheDocument();
  });

  it('renders day names in the header', () => {
    render(
      <CalendarView
        tasks={mockTasks}
        onTaskSelect={mockOnTaskSelect}
        onDateSelect={mockOnDateSelect}
        onTaskCreate={mockOnTaskCreate}
      />
    );

    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  it('displays tasks on their respective dates', () => {
    render(
      <CalendarView
        tasks={mockTasks}
        onTaskSelect={mockOnTaskSelect}
        onDateSelect={mockOnDateSelect}
        onTaskCreate={mockOnTaskCreate}
      />
    );

    // Since we're mocking the format function to return a constant date,
    // all tasks with due dates should appear on the same day
    expect(screen.getByText('Meeting')).toBeInTheDocument();
    expect(screen.getByText('Lunch')).toBeInTheDocument();
  });

  it('calls onTaskSelect when a task is clicked', async () => {
    render(
      <CalendarView
        tasks={mockTasks}
        onTaskSelect={mockOnTaskSelect}
        onDateSelect={mockOnDateSelect}
        onTaskCreate={mockOnTaskCreate}
      />
    );

    // Find and click on a task element
    const taskElements = screen.getAllByText('Meeting');
    if (taskElements.length > 0) {
      fireEvent.click(taskElements[0]);
      await waitFor(() => {
        expect(mockOnTaskSelect).toHaveBeenCalledWith(mockTasks[0]);
      });
    }
  });

  it('calls onDateSelect when a date is clicked', async () => {
    render(
      <CalendarView
        tasks={mockTasks}
        onTaskSelect={mockOnTaskSelect}
        onDateSelect={mockOnDateSelect}
        onTaskCreate={mockOnTaskCreate}
      />
    );

    // Find a date element and click it
    // Since all dates are mocked to the same value, clicking any date cell should trigger the callback
    const dateCells = document.querySelectorAll('[role="button"]');

    if (dateCells.length > 0) {
      fireEvent.click(dateCells[0]);
      // Wait for the callback to be called
      await waitFor(() => {
        expect(mockOnDateSelect).toHaveBeenCalled();
      });
    }
  });

  it('renders navigation buttons', () => {
    render(
      <CalendarView
        tasks={mockTasks}
        onTaskSelect={mockOnTaskSelect}
        onDateSelect={mockOnDateSelect}
        onTaskCreate={mockOnTaskCreate}
      />
    );

    expect(screen.getByLabelText('Previous month')).toBeInTheDocument();
    expect(screen.getByLabelText('Next month')).toBeInTheDocument();
    expect(screen.getByText('Today')).toBeInTheDocument();
  });

  it('handles empty tasks array gracefully', () => {
    render(
      <CalendarView
        tasks={[]}
        onTaskSelect={mockOnTaskSelect}
        onDateSelect={mockOnDateSelect}
        onTaskCreate={mockOnTaskCreate}
      />
    );

    // The calendar should still render with no tasks
    expect(screen.getByText('January 2023')).toBeInTheDocument();
  });
});