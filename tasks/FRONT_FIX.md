# Front Fix

## 작업 ID와 목적

- 작업 ID: FE-02-FIX-01
- 목적: FE-02 수동 Todo 생성 폼이 USER_FLOW의 입력 범위 중 하위 작업을 누락한 문제를 수정한다.

## 읽어야 할 문서

- `planning/PRD.md`
- `planning/USER_FLOW.md`
- `docs/ARCHITECTURE.md`
- `tasks/TASKS.md`
- `reports/FE_ISSUES.md`

## 구현 범위

- `features/todos/types.ts`의 `CreateTodoInput`에 하위 작업 입력 구조를 추가한다.
- `features/todos/api.ts`의 `createTodo`가 하위 작업 제목 배열을 `TodoSubtask[]`로 변환해 저장하도록 수정한다.
- `components/todo/TodoForm.tsx`에 하위 작업 입력 UI를 추가한다.
- `components/todo/TodoList.tsx`의 기존 하위 작업 표시가 생성 결과에서도 보이는지 확인한다.
- `components/todo/TodoApp.test.tsx`와 `features/todos/api.test.ts`에 하위 작업 생성 검증을 추가한다.
- localStorage 임시 저장 경계는 유지하되 API 함수 밖으로 퍼뜨리지 않는다.

## 구현하지 말아야 할 범위

- FE-03의 수정, 완료, 삭제 UI를 구현하지 않는다.
- Supabase 실제 연결을 구현하지 않는다.
- Next.js Route Handler를 구현하지 않는다.
- AI draft, trace log, agent log UI를 구현하지 않는다.
- 아키텍처 문서를 임의 변경하지 않는다.
- Node/Next/React 버전을 변경하지 않는다.

## 완료 조건

- 사용자가 수동 Todo 생성 시 하나 이상의 하위 작업을 입력할 수 있다.
- 저장된 Todo 목록에 하위 작업이 표시된다.
- 하위 작업은 `TodoSubtask` 구조의 `id`, `title`, `completed`, `position`을 가진다.
- 빈 하위 작업 제목은 저장하지 않는다.
- FE-02 완료 기준이 PRD/USER_FLOW의 입력 범위와 일치한다.

## 검증 명령

- `source ~/.nvm/nvm.sh && nvm use 20.11.1 && node -v`
- `npm test`
- `npm run lint`
- `npm run build`

## 브랜치 이름

- `front/fix-fe-02-subtasks`

## 보고서 경로

- `reports/FE_ISSUES.md`

## 이슈 파일 경로

- `tasks/FRONT_FIX.md`
