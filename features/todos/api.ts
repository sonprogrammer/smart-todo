import type { Todo } from "./types";

const todos: Todo[] = [];

export function getTodos(): Todo[] {
  return todos;
}
