import type { CreateTodoInput, Todo } from "./types";
import { createTodoService } from "./service";

const todo: Todo = {
  id: "todo-1",
  title: "서비스 경계",
  description: null,
  priority: "medium",
  dueDate: null,
  completed: false,
  subtasks: [],
  sourceTraceId: null,
  createdAt: "2026-07-18T00:00:00.000Z",
  updatedAt: "2026-07-18T00:00:00.000Z"
};

describe("todo service", () => {
  it("exposes list and create signatures that delegate to the repository", async () => {
    const calls: CreateTodoInput[] = [];
    const service = createTodoService({
      listTodos: () => Promise.resolve([todo]),
      createTodo: (input) => {
        calls.push(input);
        return Promise.resolve(todo);
      }
    });

    await expect(service.listTodos()).resolves.toEqual([todo]);
    await expect(
      service.createTodo({
        title: "서비스 경계",
        priority: "medium",
        subtasks: ["저장소 연결"]
      })
    ).resolves.toEqual(todo);
    expect(calls).toEqual([
      {
        title: "서비스 경계",
        priority: "medium",
        subtasks: ["저장소 연결"]
      }
    ]);
  });
});
