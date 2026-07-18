import type { Todo } from "@/features/todos/types";

type TodoListProps = {
  todos: Todo[];
};

const priorityLabels: Record<Todo["priority"], string> = {
  low: "낮음",
  medium: "보통",
  high: "높음"
};

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
});

function formatDueDate(dueDate: string | null) {
  if (!dueDate) {
    return "마감일 없음";
  }

  return dateFormatter.format(new Date(dueDate));
}

export function TodoList({ todos }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <section className="empty-state" aria-label="빈 Todo 목록">
        <h2>저장된 todo가 없습니다.</h2>
        <p>새 todo를 만들면 이 목록에 표시됩니다.</p>
      </section>
    );
  }

  return (
    <ul className="todo-list" aria-label="Todo 목록">
      {todos.map((todo) => (
        <li className="todo-item" key={todo.id}>
          <div className="todo-item-header">
            <h2>{todo.title}</h2>
            <span className={`priority priority-${todo.priority}`}>{priorityLabels[todo.priority]}</span>
          </div>

          {todo.description ? <p className="todo-description">{todo.description}</p> : null}

          <div className="todo-meta">
            <span>{formatDueDate(todo.dueDate)}</span>
            <span>{todo.completed ? "완료" : "진행 중"}</span>
          </div>

          {todo.subtasks.length > 0 ? (
            <ul className="subtask-list" aria-label={`${todo.title} 하위 작업`}>
              {todo.subtasks.map((subtask) => (
                <li key={subtask.id}>{subtask.title}</li>
              ))}
            </ul>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
