import { supabaseError, validationError } from "@/lib/errors";
import type { CreateTodoInput, Priority, Todo, TodoSubtask } from "./types";

type SupabaseResult<T> = {
  data: T | null;
  error: { message: string } | null;
};

type TodoSubtaskRow = {
  id: string;
  title: string;
  completed: boolean | null;
  position: number | null;
  created_at?: string;
  updated_at?: string;
};

type TodoRow = {
  id: string;
  title: string;
  description: string | null;
  priority: Priority | null;
  due_date: string | null;
  completed: boolean | null;
  source_trace_id: string | null;
  created_at: string;
  updated_at: string;
  todo_subtasks?: TodoSubtaskRow[] | null;
};

type TodoInsertRow = {
  title: string;
  description: string | null;
  priority: Priority;
  due_date: string | null;
  completed: boolean;
  source_trace_id: string | null;
};

type TodoSubtaskInsertRow = {
  todo_id: string;
  title: string;
  completed: boolean;
  position: number;
};

type TodoQueryBuilder = {
  select(columns?: string): {
    order(column: string, options?: { ascending?: boolean; foreignTable?: string }): Promise<SupabaseResult<TodoRow[]>>;
  };
  insert(rows: TodoInsertRow[]): {
    select(columns?: string): {
      single(): Promise<SupabaseResult<TodoRow>>;
    };
  };
};

type TodoSubtaskQueryBuilder = {
  insert(rows: TodoSubtaskInsertRow[]): {
    select(columns?: string): {
      order(column: string, options?: { ascending?: boolean }): Promise<SupabaseResult<TodoSubtaskRow[]>>;
    };
  };
};

export type TodoSupabaseClient = {
  from(table: "todos"): TodoQueryBuilder;
  from(table: "todo_subtasks"): TodoSubtaskQueryBuilder;
};

export type TodoRepository = {
  listTodos: () => Promise<Todo[]>;
  createTodo: (input: CreateTodoInput) => Promise<Todo>;
};

const todoSelectColumns = `
  id,
  title,
  description,
  priority,
  due_date,
  completed,
  source_trace_id,
  created_at,
  updated_at,
  todo_subtasks (
    id,
    title,
    completed,
    position,
    created_at,
    updated_at
  )
`;

function ensureNoError<T>(result: SupabaseResult<T>): T {
  if (result.error) {
    throw supabaseError(result.error.message);
  }

  if (result.data === null) {
    throw supabaseError("Supabase returned no data.");
  }

  return result.data;
}

function normalizeDueDate(dueDate: string | undefined) {
  if (!dueDate) {
    return null;
  }

  return new Date(dueDate).toISOString();
}

function normalizeSubtask(subtask: string | { title: string; completed?: boolean }, index: number) {
  if (typeof subtask === "string") {
    return {
      title: subtask.trim(),
      completed: false,
      position: index
    };
  }

  return {
    title: subtask.title.trim(),
    completed: subtask.completed ?? false,
    position: index
  };
}

function normalizeCreateInput(input: CreateTodoInput) {
  const title = input.title.trim();

  if (!title) {
    throw validationError("Todo title is required.");
  }

  const subtasks = (input.subtasks ?? [])
    .map(normalizeSubtask)
    .filter((subtask) => subtask.title.length > 0)
    .map((subtask, position) => ({ ...subtask, position }));

  return {
    todo: {
      title,
      description: input.description?.trim() || null,
      priority: input.priority,
      due_date: normalizeDueDate(input.dueDate),
      completed: input.completed ?? false,
      source_trace_id: input.sourceTraceId ?? null
    },
    subtasks
  };
}

function mapSubtaskRow(row: TodoSubtaskRow): TodoSubtask {
  return {
    id: row.id,
    title: row.title,
    completed: row.completed ?? false,
    position: row.position ?? 0
  };
}

function mapTodoRow(row: TodoRow, subtasks = row.todo_subtasks ?? []): Todo {
  const orderedSubtasks = [...subtasks].sort((left, right) => (left.position ?? 0) - (right.position ?? 0));

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    priority: row.priority ?? "medium",
    dueDate: row.due_date,
    completed: row.completed ?? false,
    subtasks: orderedSubtasks.map(mapSubtaskRow),
    sourceTraceId: row.source_trace_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function createTodoRepository(supabase: TodoSupabaseClient): TodoRepository {
  return {
    async listTodos() {
      const result = await supabase
        .from("todos")
        .select(todoSelectColumns)
        .order("created_at", { ascending: false });
      const rows = ensureNoError(result);

      return rows.map((row) => mapTodoRow(row));
    },

    async createTodo(input) {
      const normalized = normalizeCreateInput(input);
      const createdTodo = ensureNoError(
        await supabase.from("todos").insert([normalized.todo]).select(todoSelectColumns).single()
      );

      if (normalized.subtasks.length === 0) {
        return mapTodoRow(createdTodo, []);
      }

      const insertedSubtasks = ensureNoError(
        await supabase
          .from("todo_subtasks")
          .insert(normalized.subtasks.map((subtask) => ({ ...subtask, todo_id: createdTodo.id })))
          .select("id, title, completed, position, created_at, updated_at")
          .order("position", { ascending: true })
      );

      return mapTodoRow(createdTodo, insertedSubtasks);
    }
  };
}
