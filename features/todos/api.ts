import type { CreateTodoInput, Todo } from "./types";

const storageKey = "smart-todo:todos";

function canUseBrowserStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readTodos(): Todo[] {
  if (!canUseBrowserStorage()) {
    return [];
  }

  const stored = window.localStorage.getItem(storageKey);

  if (!stored) {
    return [];
  }

  return JSON.parse(stored) as Todo[];
}

function writeTodos(todos: Todo[]) {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(todos));
}

function toIsoDate(date: string | undefined) {
  if (!date) {
    return null;
  }

  return new Date(`${date}T00:00:00.000Z`).toISOString();
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `todo-${Date.now()}`;
}

function createSubtasks(subtasks: CreateTodoInput["subtasks"]): Todo["subtasks"] {
  return (subtasks ?? [])
    .map((subtask) => {
      if (typeof subtask === "string") {
        return {
          title: subtask.trim(),
          completed: false
        };
      }

      return {
        title: subtask.title.trim(),
        completed: subtask.completed ?? false
      };
    })
    .filter((subtask) => subtask.title)
    .map((subtask, index) => ({
      id: createId(),
      title: subtask.title,
      completed: subtask.completed,
      position: index + 1
    }));
}

export async function getTodos(): Promise<Todo[]> {
  return readTodos();
}

export async function createTodo(input: CreateTodoInput): Promise<Todo> {
  const now = new Date().toISOString();
  const todo: Todo = {
    id: createId(),
    title: input.title.trim(),
    description: input.description?.trim() || null,
    priority: input.priority,
    dueDate: toIsoDate(input.dueDate),
    completed: false,
    subtasks: createSubtasks(input.subtasks),
    sourceTraceId: null,
    createdAt: now,
    updatedAt: now
  };
  const todos = [...readTodos(), todo];

  writeTodos(todos);

  return todo;
}
