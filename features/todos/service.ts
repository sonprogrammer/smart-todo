import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createTodoRepository } from "./repository";
import type { TodoRepository, TodoSupabaseClient } from "./repository";

export type TodoService = TodoRepository;

export function createTodoService(repository: TodoRepository = createTodoRepository(createDefaultTodoClient())): TodoService {
  return {
    listTodos: () => repository.listTodos(),
    createTodo: (input) => repository.createTodo(input)
  };
}

function createDefaultTodoClient() {
  return createSupabaseServerClient() as unknown as TodoSupabaseClient;
}

export const todoService = createTodoService;
