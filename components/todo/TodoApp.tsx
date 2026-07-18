"use client";

import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { todosQueryOptions, useCreateTodoMutation } from "@/features/todos/queries";
import { TodoForm } from "./TodoForm";
import { TodoList } from "./TodoList";

function TodoAppContent() {
  const todosQuery = useQuery(todosQueryOptions());
  const createTodoMutation = useCreateTodoMutation();
  const todos = todosQuery.data ?? [];

  return (
    <>
      <TodoForm
        isSubmitting={createTodoMutation.isPending}
        onSubmit={async (input) => {
          await createTodoMutation.mutateAsync(input);
        }}
      />
      <TodoList todos={todos} />
    </>
  );
}

export function TodoApp() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TodoAppContent />
    </QueryClientProvider>
  );
}
