# Front Report

작성일: 2026-07-18

## 실행 작업

- 브랜치: `front/fix-fe-02-subtasks`
- 작업 ID: `FE-02-FIX-01`
- 목적: FE-02 수동 Todo 생성 폼에서 누락된 하위 작업 입력을 추가한다.

## 런타임

- 실행 명령: `source ~/.nvm/nvm.sh && nvm use 20.11.1 && node -v`
- 결과: `v20.11.1`

## 변경 내용

- `CreateTodoInput`에 하위 작업 입력 배열을 반영했다.
- `features/todos/api.ts`의 임시 localStorage 저장 경계에서 하위 작업 입력을 `TodoSubtask[]`로 변환하도록 수정했다.
- 문자열 하위 작업과 `{ title, completed }` 형태 입력을 모두 처리하도록 변환 함수를 맞췄다.
- 빈 하위 작업 제목은 저장하지 않는다.
- `TodoForm`에 하위 작업 입력 textarea를 추가했다.
- 사용자 관점 테스트와 API 테스트에 하위 작업 생성/표시 검증을 추가했다.

## 검증 결과

- `npm install`: 통과
- `npm test`: 통과, 8 files / 11 tests
- `npm run lint`: 통과
- `npm run build`: 통과

## 상태

`FE-02-FIX-01`의 Frontend 구현과 전체 검증이 완료됐다.

`FE-03`은 `tasks/FRONT_TASK.md` 기준상 다음 Frontend 작업으로 진행 가능하다.
