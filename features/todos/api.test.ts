import { createTodo, getTodos } from "./api";

describe("todo api", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("creates a manual todo and returns it in the saved todo list", async () => {
    const created = await createTodo({
      title: "수동 todo 작성",
      description: "폼에서 직접 입력한다.",
      priority: "high",
      dueDate: "2026-07-19",
      subtasks: ["TASKS.md 확인", " ", "화면에서 저장 확인"]
    });

    await expect(getTodos()).resolves.toEqual([created]);
    expect(created).toMatchObject({
      title: "수동 todo 작성",
      description: "폼에서 직접 입력한다.",
      priority: "high",
      completed: false,
      sourceTraceId: null,
      subtasks: [
        {
          title: "TASKS.md 확인",
          completed: false,
          position: 1
        },
        {
          title: "화면에서 저장 확인",
          completed: false,
          position: 2
        }
      ]
    });
    expect(created.subtasks[0]?.id).toEqual(expect.any(String));
    expect(created.subtasks[1]?.id).toEqual(expect.any(String));
    expect(created.dueDate).toBe("2026-07-19T00:00:00.000Z");
  });
});
