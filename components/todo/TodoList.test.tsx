import React from "react";
import { render, screen } from "@testing-library/react";
import { TodoList } from "./TodoList";
import type { Todo } from "@/features/todos/types";

const todos: Todo[] = [
  {
    id: "todo-1",
    title: "아키텍처 문서 검토",
    description: "초기 구현 전에 시스템 경계를 확인한다.",
    priority: "high",
    dueDate: "2026-07-18T09:00:00.000Z",
    completed: false,
    subtasks: [{ id: "subtask-1", title: "TASKS.md 확인", completed: false, position: 1 }],
    sourceTraceId: null,
    createdAt: "2026-07-18T08:00:00.000Z",
    updatedAt: "2026-07-18T08:00:00.000Z"
  }
];

describe("TodoList", () => {
  it("renders saved todos with priority, due date, and subtasks", () => {
    render(<TodoList todos={todos} />);

    expect(screen.getByRole("list", { name: "Todo 목록" })).toBeInTheDocument();
    expect(screen.getByText("아키텍처 문서 검토")).toBeInTheDocument();
    expect(screen.getByText("높음")).toBeInTheDocument();
    expect(screen.getByText("2026. 07. 18.")).toBeInTheDocument();
    expect(screen.getByText("TASKS.md 확인")).toBeInTheDocument();
  });
});
