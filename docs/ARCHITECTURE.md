# Architecture

## 전체 시스템 구조

```text
Browser
  -> Next.js 16 App Router / React 19
  -> TanStack Query: 서버 상태
  -> Zustand: 임시 UI 상태
  -> Next.js Route Handlers
  -> Todo Service / AI Orchestrator
  -> Supabase Postgres
```

- TypeScript 전 구간 사용
- 단일 사용자 앱
- 로그인, 권한, 외부 연동 없음
- AI draft는 승인 전 `todos`에 저장하지 않음
- AI 요청은 `trace_id` 기준으로 요청, 에이전트 로그, 승인 결과를 추적

## 폴더 구조

```text
app/
  page.tsx
  layout.tsx
  api/
    todos/route.ts
    todos/[id]/route.ts
    todos/[id]/complete/route.ts
    ai/draft/route.ts
    ai/requests/[traceId]/route.ts

components/
  todo/
    TodoList.tsx
    TodoItem.tsx
    TodoForm.tsx
  ai/
    NaturalLanguageInput.tsx
    DraftReview.tsx
    TraceLog.tsx

features/
  todos/
    api.ts
    queries.ts
    types.ts
  ai/
    api.ts
    orchestrator.ts
    validators.ts
    types.ts

lib/
  supabase/client.ts
  supabase/server.ts
  errors.ts

store/
  draftStore.ts
  uiStore.ts

docs/
  ARCHITECTURE.md
```

## 데이터 흐름

### Todo CRUD

```text
Component
  -> TanStack Query
  -> /api/todos*
  -> Supabase todos, todo_subtasks
  -> query invalidate
```

### AI Draft

```text
Natural language input
  -> POST /api/ai/draft
  -> trace_id 생성
  -> ai_requests insert
  -> AI orchestrator
  -> agent_logs insert
  -> draft validation
  -> ai_requests.draft_payload update
  -> Zustand draft state
```

### Draft 승인

```text
DraftReview
  -> 사용자가 draft 수정
  -> POST /api/todos
  -> todos, todo_subtasks insert
  -> ai_requests.approved_todo_id update
  -> draft state clear
```

AI 실패 또는 검증 실패 시 `trace_id`와 오류를 반환하고 수동 Todo 작성 흐름을 유지한다.

## AI 오케스트레이터

MVP는 `features/ai/orchestrator.ts`의 단일 서버 함수로 구현한다.

- 큐, 워커, 외부 에이전트 런타임 없음
- `POST /api/ai/draft` 요청 안에서 순차 실행
- 각 단계 전후로 `agent_logs` 기록
- 최종 결과는 `TodoDraft`로 검증
- 검증 실패 시 `ai_requests.status = failed`

```text
orchestrateTodoDraft(input, traceId)
  -> parse agent: 자연어에서 후보 필드 추출
  -> normalize agent: priority, dueDate, subtasks 정규화
  -> validate draft: TodoDraft 스키마 검증
  -> return TodoDraft
```

## 상태 관리 구조

### TanStack Query

Query keys:

- `todos`
- `todo:${id}`
- `aiRequest:${traceId}`

Mutations:

- create todo
- update todo
- complete todo
- delete todo
- create AI draft

### Zustand

서버에 저장하지 않는 임시 상태만 둔다.

```ts
type DraftState = {
  traceId: string | null;
  draft: TodoDraft | null;
  setDraft: (traceId: string, draft: TodoDraft) => void;
  updateDraft: (draft: TodoDraft) => void;
  clearDraft: () => void;
};

type UIState = {
  selectedTodoId: string | null;
  isDraftReviewOpen: boolean;
  setSelectedTodoId: (id: string | null) => void;
  setDraftReviewOpen: (open: boolean) => void;
};
```

## API 구조

### Todos

| method | path | purpose |
| --- | --- | --- |
| GET | `/api/todos` | todo 목록 조회 |
| POST | `/api/todos` | todo 생성, draft 승인 저장 |
| GET | `/api/todos/[id]` | todo 단건 조회 |
| PATCH | `/api/todos/[id]` | todo 수정 |
| DELETE | `/api/todos/[id]` | todo 삭제 |
| POST | `/api/todos/[id]/complete` | 완료 상태 변경 |

### AI

| method | path | purpose |
| --- | --- | --- |
| POST | `/api/ai/draft` | 자연어 입력을 todo draft로 변환 |
| GET | `/api/ai/requests/[traceId]` | AI 요청과 에이전트 로그 조회 |

`POST /api/ai/draft`

```ts
type Request = { input: string };
type Success = { traceId: string; draft: TodoDraft };
type Failure = { traceId: string; error: string };
```

## DB 구조

### `todos`

| column | type |
| --- | --- |
| id | uuid primary key |
| title | text not null |
| description | text |
| priority | text |
| due_date | timestamptz |
| completed | boolean default false |
| source_trace_id | uuid |
| created_at | timestamptz default now |
| updated_at | timestamptz default now |

### `todo_subtasks`

| column | type |
| --- | --- |
| id | uuid primary key |
| todo_id | uuid references todos(id) on delete cascade |
| title | text not null |
| completed | boolean default false |
| position | integer |
| created_at | timestamptz default now |
| updated_at | timestamptz default now |

### `ai_requests`

| column | type |
| --- | --- |
| trace_id | uuid primary key |
| input_text | text not null |
| status | text |
| draft_payload | jsonb |
| error_message | text |
| approved_todo_id | uuid references todos(id) |
| created_at | timestamptz default now |
| updated_at | timestamptz default now |

### `agent_logs`

| column | type |
| --- | --- |
| id | uuid primary key |
| trace_id | uuid references ai_requests(trace_id) on delete cascade |
| agent_name | text not null |
| step | text not null |
| input_payload | jsonb |
| output_payload | jsonb |
| error_message | text |
| created_at | timestamptz default now |

## 주요 타입

```ts
type Priority = "low" | "medium" | "high";

type TodoDraft = {
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string;
  subtasks: { title: string }[];
};

type Todo = {
  id: string;
  title: string;
  description: string | null;
  priority: Priority;
  dueDate: string | null;
  completed: boolean;
  subtasks: TodoSubtask[];
  sourceTraceId: string | null;
  createdAt: string;
  updatedAt: string;
};
```
