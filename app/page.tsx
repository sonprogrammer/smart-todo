import { TodoList } from "@/components/todo/TodoList";
import { getTodos } from "@/features/todos/api";

export default function Home() {
  const todos = getTodos();

  return (
    <main className="app-shell">
      <section className="page-header" aria-labelledby="page-title">
        <p className="eyebrow">AI Smart Todo</p>
        <h1 id="page-title">Smart Todo</h1>
        <p className="lede">할 일을 구조화하고, 이후 AI draft 승인 흐름으로 확장할 기본 목록 화면입니다.</p>
      </section>

      <TodoList todos={todos} />
    </main>
  );
}
