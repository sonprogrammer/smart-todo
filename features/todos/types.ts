export type Priority = "low" | "medium" | "high";

export type TodoSubtask = {
  id: string;
  title: string;
  completed: boolean;
  position: number;
};

export type Todo = {
  id: string;
  title: string;
  description: string | null;
  priority: Priority;
  dueDate: string | null;
  completed: boolean;
  subtasks: TodoSubtask[];
  sourceTraceId: string | null;
  createdAt: string;
  updatedAt: string;
};
