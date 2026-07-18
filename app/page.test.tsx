import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home", () => {
  it("shows the empty todo state when there are no saved todos", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { name: "Smart Todo" })).toBeInTheDocument();
    expect(screen.getByText("저장된 todo가 없습니다.")).toBeInTheDocument();
    expect(screen.getByText("새 todo를 만들면 이 목록에 표시됩니다.")).toBeInTheDocument();
  });
});
