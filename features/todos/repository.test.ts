import { ApiError } from "@/lib/errors";
import { createTodoRepository } from "./repository";

function createSupabaseStub() {
  const state = {
    todosRows: [] as unknown[],
    subtaskRows: [] as unknown[],
    insertedTodoRows: [] as unknown[],
    insertedSubtaskRows: [] as unknown[]
  };

  const client = {
    from(table: string) {
      if (table === "todos") {
        return {
          select() {
            return {
              order() {
                return Promise.resolve({ data: state.todosRows, error: null });
              }
            };
          },
          insert(rows: unknown[]) {
            state.insertedTodoRows = rows;

            return {
              select() {
                return {
                  single() {
                    return Promise.resolve({ data: state.todosRows[0], error: null });
                  }
                };
              }
            };
          }
        };
      }

      if (table === "todo_subtasks") {
        return {
          insert(rows: unknown[]) {
            state.insertedSubtaskRows = rows;

            return {
              select() {
                return {
                  order() {
                    return Promise.resolve({ data: state.subtaskRows, error: null });
                  }
                };
              }
            };
          }
        };
      }

      throw new Error(`Unexpected table: ${table}`);
    }
  };

  return { client, state };
}

describe("todo repository", () => {
  it("maps todo and subtask rows to API-ready todo objects", async () => {
    const { client, state } = createSupabaseStub();
    state.todosRows = [
      {
        id: "todo-1",
        title: "서버 저장소 만들기",
        description: "Route Handler 연결 전 경계 준비",
        priority: "high",
        due_date: "2026-07-20T00:00:00.000Z",
        completed: false,
        source_trace_id: "trace-1",
        created_at: "2026-07-18T00:00:00.000Z",
        updated_at: "2026-07-18T00:00:00.000Z",
        todo_subtasks: [
          {
            id: "subtask-1",
            title: "타입 정리",
            completed: true,
            position: 0,
            created_at: "2026-07-18T00:00:00.000Z",
            updated_at: "2026-07-18T00:00:00.000Z"
          }
        ]
      }
    ];

    const repository = createTodoRepository(client);

    await expect(repository.listTodos()).resolves.toEqual([
      {
        id: "todo-1",
        title: "서버 저장소 만들기",
        description: "Route Handler 연결 전 경계 준비",
        priority: "high",
        dueDate: "2026-07-20T00:00:00.000Z",
        completed: false,
        sourceTraceId: "trace-1",
        createdAt: "2026-07-18T00:00:00.000Z",
        updatedAt: "2026-07-18T00:00:00.000Z",
        subtasks: [
          {
            id: "subtask-1",
            title: "타입 정리",
            completed: true,
            position: 0
          }
        ]
      }
    ]);
  });

  it("validates create input before inserting rows", async () => {
    const { client } = createSupabaseStub();
    const repository = createTodoRepository(client);

    await expect(
      repository.createTodo({
        title: "   ",
        priority: "medium",
        subtasks: [{ title: "테스트" }]
      })
    ).rejects.toMatchObject({
      code: "VALIDATION_ERROR",
      status: 400,
      message: "Todo title is required."
    });
  });

  it("inserts todo and normalized subtasks then returns the created todo", async () => {
    const { client, state } = createSupabaseStub();
    state.todosRows = [
      {
        id: "todo-2",
        title: "BE-01",
        description: null,
        priority: "medium",
        due_date: null,
        completed: false,
        source_trace_id: null,
        created_at: "2026-07-18T01:00:00.000Z",
        updated_at: "2026-07-18T01:00:00.000Z"
      }
    ];
    state.subtaskRows = [
      {
        id: "subtask-2",
        title: "저장소 테스트",
        completed: false,
        position: 0,
        created_at: "2026-07-18T01:00:00.000Z",
        updated_at: "2026-07-18T01:00:00.000Z"
      }
    ];

    const repository = createTodoRepository(client);
    const created = await repository.createTodo({
      title: "  BE-01  ",
      description: "   ",
      priority: "medium",
      subtasks: [{ title: " 저장소 테스트 " }, { title: "   " }]
    });

    expect(state.insertedTodoRows).toEqual([
      {
        title: "BE-01",
        description: null,
        priority: "medium",
        due_date: null,
        completed: false,
        source_trace_id: null
      }
    ]);
    expect(state.insertedSubtaskRows).toEqual([
      {
        todo_id: "todo-2",
        title: "저장소 테스트",
        completed: false,
        position: 0
      }
    ]);
    expect(created.subtasks).toEqual([
      {
        id: "subtask-2",
        title: "저장소 테스트",
        completed: false,
        position: 0
      }
    ]);
  });

  it("wraps Supabase failures as API errors", async () => {
    const repository = createTodoRepository({
      from() {
        return {
          select() {
            return {
              order() {
                return Promise.resolve({ data: null, error: { message: "database unavailable" } });
              }
            };
          }
        };
      }
    });

    await expect(repository.listTodos()).rejects.toBeInstanceOf(ApiError);
    await expect(repository.listTodos()).rejects.toMatchObject({
      code: "SUPABASE_ERROR",
      status: 500,
      message: "database unavailable"
    });
  });
});
