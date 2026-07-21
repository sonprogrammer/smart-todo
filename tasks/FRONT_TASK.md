# Front Task

## 작업 ID와 목적

- 작업 ID: FE-03
- 목적: FE-02의 수동 todo 생성 흐름 위에 Todo 수정, 완료 처리, 삭제 UI를 구현한다.

## 읽어야 할 문서

- `planning/PRD.md`
- `planning/USER_FLOW.md`
- `docs/ARCHITECTURE.md`
- `tasks/TASKS.md`
- `reports/FE_ISSUES.md`
- `tasks/FRONT_FIX.md`

## 구현 범위

- `components/todo/` 안에서 Todo 수정, 완료 처리, 삭제 UI를 구현한다.
- `features/todos/types.ts`에 필요한 입력 타입을 정의한다.
- `features/todos/api.ts`에 임시 localStorage 기반 update, complete, delete 함수를 추가한다.
- `features/todos/queries.ts`에 TanStack Query mutation 경계를 추가한다.
- UI 컴포넌트는 localStorage에 직접 접근하지 않고 `features/todos/api.ts` 함수만 호출한다.
- FE-02에서 만든 목록 갱신 흐름과 query invalidation 방식을 유지한다.
- 테스트는 사용자 관점에서 수정, 완료, 삭제 후 목록 반영을 검증한다.

## 구현하지 말아야 할 범위

- Next.js, React, Node 런타임 버전을 변경하지 않는다.
- `node` devDependency를 다시 추가하지 않는다.
- Supabase 실제 연결을 구현하지 않는다.
- Next.js Route Handler를 구현하지 않는다.
- AI draft, trace log, agent log UI를 구현하지 않는다.
- 로그인, 권한, 외부 연동을 추가하지 않는다.
- `planning/`, `docs/`, `tasks/`, `reports/` 문서를 삭제하거나 이동하지 않는다.
- `tasks/FRONT_FIX.md`의 FE-02 하위 작업 입력 수정이 완료되지 않았으면 FE-03을 시작하지 않는다.

## 완료 조건

- 사용자가 기존 Todo의 제목, 설명, 우선순위, 마감일을 수정할 수 있다.
- 사용자가 Todo 완료 상태를 변경할 수 있다.
- 사용자가 Todo를 삭제할 수 있다.
- 변경 결과가 Todo 목록에 즉시 반영된다.
- 모든 접근은 `features/todos` API/Query 경계를 통해 이뤄진다.
- FE-03 완료 후 `tasks/TASKS.md`의 FE-03 상태를 완료로 갱신한다.

## 검증 명령

- `source ~/.nvm/nvm.sh && nvm use 20.11.1 && node -v`
- `npm install`
- `npm test`
- `npm run lint`
- `npm run build`

## 브랜치 이름

- `front/fe-03-todo-edit-complete-delete`

## 보고서 경로

- `reports/FE_ISSUES.md`

## 이슈 파일 경로

- `tasks/FRONT_FIX.md`
