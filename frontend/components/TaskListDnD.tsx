/**
 * Task: T015, T041
 * Spec: Phase 1 UI Enhancements
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import { Task } from '@/types/task';
import { TaskCardDnD } from './TaskCardDnD';
import { AnimatedList } from './AnimatedComponents';

interface TaskListDnDProps {
  tasks: Task[];
  onTaskComplete: (id: string) => void;
  onTaskDelete: (id: string) => void;
  onTaskEdit: (task: Task) => void;
  onTaskReorder: (tasks: Task[]) => void;
}

export function TaskListDnD({
  tasks,
  onTaskComplete,
  onTaskDelete,
  onTaskEdit,
  onTaskReorder
}: TaskListDnDProps) {
  const [reorderedTasks, setReorderedTasks] = useState<Task[]>(tasks);

  // Update the local state when tasks prop changes
  if (JSON.stringify(reorderedTasks.map(t => t.id)) !== JSON.stringify(tasks.map(t => t.id))) {
    setReorderedTasks(tasks);
  }

  const handleMove = useCallback((fromIndex: number, toIndex: number) => {
    const newTasks = [...reorderedTasks];
    const [movedTask] = newTasks.splice(fromIndex, 1);
    newTasks.splice(toIndex, 0, movedTask);

    setReorderedTasks(newTasks);
    onTaskReorder(newTasks);
  }, [reorderedTasks, onTaskReorder]);

  // Memoize the task components to prevent unnecessary re-renders
  const taskComponents = useMemo(() => {
    return reorderedTasks.map((task, index) => (
      <TaskCardDnD
        key={task.id}
        task={task}
        index={index}
        totalItems={reorderedTasks.length}
        onComplete={onTaskComplete}
        onDelete={onTaskDelete}
        onEdit={onTaskEdit}
        onMove={handleMove}
      />
    ));
  }, [reorderedTasks, onTaskComplete, onTaskDelete, onTaskEdit, handleMove]);

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No tasks yet. Add a new task to get started!</p>
      </div>
    );
  }

  return (
    <AnimatedList
      className="space-y-3"
      itemClassName="mb-3"
      stagger={0.05}
      delay={0.1}
    >
      {taskComponents}
    </AnimatedList>
  );
}