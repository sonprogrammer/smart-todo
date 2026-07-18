"use client";

import { FormEvent, useState } from "react";
import type { CreateTodoInput, Priority } from "@/features/todos/types";

type TodoFormProps = {
  onSubmit: (input: CreateTodoInput) => Promise<void> | void;
  isSubmitting?: boolean;
};

export function TodoForm({ onSubmit, isSubmitting = false }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [subtasks, setSubtasks] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    await onSubmit({
      title: trimmedTitle,
      description,
      priority,
      dueDate: dueDate || undefined,
      subtasks: subtasks.split("\n")
    });
    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate("");
    setSubtasks("");
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          <span>제목</span>
          <input
            name="title"
            onChange={(event) => setTitle(event.target.value)}
            placeholder="할 일을 입력하세요"
            required
            type="text"
            value={title}
          />
        </label>

        <label>
          <span>우선순위</span>
          <select
            name="priority"
            onChange={(event) => setPriority(event.target.value as Priority)}
            value={priority}
          >
            <option value="low">낮음</option>
            <option value="medium">보통</option>
            <option value="high">높음</option>
          </select>
        </label>

        <label>
          <span>마감일</span>
          <input name="dueDate" onChange={(event) => setDueDate(event.target.value)} type="date" value={dueDate} />
        </label>
      </div>

      <label>
        <span>설명</span>
        <textarea
          name="description"
          onChange={(event) => setDescription(event.target.value)}
          placeholder="필요한 메모를 남기세요"
          rows={3}
          value={description}
        />
      </label>

      <label>
        <span>하위 작업</span>
        <textarea
          name="subtasks"
          onChange={(event) => setSubtasks(event.target.value)}
          placeholder="하위 작업을 한 줄에 하나씩 입력하세요"
          rows={3}
          value={subtasks}
        />
      </label>

      <button disabled={isSubmitting || !title.trim()} type="submit">
        Todo 추가
      </button>
    </form>
  );
}
