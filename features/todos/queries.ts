import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { createTodo, getTodos } from "./api";
import type { CreateTodoInput } from "./types";

export const todoKeys = {
  all: ["todos"] as const
};

export function todosQueryOptions() {
  return queryOptions({
    queryKey: todoKeys.all,
    queryFn: getTodos
  });
}

export function useCreateTodoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTodoInput) => createTodo(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: todoKeys.all });
    }
  });
}
