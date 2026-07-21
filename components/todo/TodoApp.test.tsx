import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { TodoApp } from "./TodoApp";

describe("TodoApp", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("creates a manual todo and shows it in the list", async () => {
    render(<TodoApp />);

    fireEvent.change(screen.getByLabelText("제목"), {
      target: { value: "장보기" }
    });
    fireEvent.change(screen.getByLabelText("설명"), {
      target: { value: "저녁 재료 준비" }
    });
    fireEvent.change(screen.getByLabelText("우선순위"), {
      target: { value: "high" }
    });
    fireEvent.change(screen.getByLabelText("마감일"), {
      target: { value: "2026-07-19" }
    });
    fireEvent.change(screen.getByLabelText("하위 작업"), {
      target: { value: "채소 사기\n \n결제하기" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Todo 추가" }));

    await waitFor(() => {
      expect(screen.getByText("장보기")).toBeInTheDocument();
    });
    const todoList = screen.getByRole("list", { name: "Todo 목록" });

    expect(screen.getByText("저녁 재료 준비")).toBeInTheDocument();
    expect(within(todoList).getByText("높음")).toBeInTheDocument();
    expect(within(todoList).getByText("채소 사기")).toBeInTheDocument();
    expect(within(todoList).getByText("결제하기")).toBeInTheDocument();
    expect(screen.queryByText("저장된 todo가 없습니다.")).not.toBeInTheDocument();
  });
});
