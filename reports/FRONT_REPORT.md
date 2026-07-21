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

## PR #1 main 동기화 및 CI 충돌 정리

- 대상 PR: `#1`
- 브랜치: `front/fix-fe-02-subtasks`
- 반영한 main: `origin/main` (`e7a5540dcd86fe7dbe3e5d96fe6b30fee3dd7648`)
- 충돌 파일: `.github/workflows/ci.yml`
- 정리 기준: main의 공통 CI 정의를 유지했다.
- 기능 코드 변경: FE 기능 코드는 충돌 해소를 위해 별도로 수정하지 않았다.
- workflow 검증 항목:
  - `npm install`
  - `npm test`
  - `npm run lint`
  - `npm run build`

정리 후 로컬 재검증 결과:

- `source ~/.nvm/nvm.sh && nvm use 20.11.1 && node -v`: `v20.11.1`
- `npm install`: 통과
- `npm test`: 통과
- `npm run lint`: 통과
- `npm run build`: 통과

정리 후 GitHub Actions check 상태:

- PR #1 최신 head 기준 `gh pr checks 1`에서 `npm verify` check 통과를 확인한다.

## 상태

`FE-02-FIX-01`의 Frontend 구현과 전체 검증이 완료됐다.

`FE-03`은 `tasks/FRONT_TASK.md` 기준상 다음 Frontend 작업으로 진행 가능하다.

## CI/check 설정

- 대상 PR: `#1`
- 브랜치: `front/fix-fe-02-subtasks`
- 확인한 PR head: `f52416b581a5bfa6bd1a3c7ba31ce8d94a3f8301`
- 확인 당시 GitHub check 상태: `statusCheckRollup`이 빈 배열로, PR에 보고된 check가 없었다.
- 추가한 workflow: `.github/workflows/ci.yml`
- workflow 검증 항목:
  - `npm install`
  - `npm test`
  - `npm run lint`
  - `npm run build`
- workflow Node.js 기준: `20.11.1`
- GitHub Actions check 상태: PR #1에서 `install, test, lint, build` check가 생성됐고 통과했다.
- GitHub Actions 실행 결과:
  - `npm install`: 통과
  - `npm test`: 통과
  - `npm run lint`: 통과
  - `npm run build`: 통과

로컬 재검증 결과:

- `source ~/.nvm/nvm.sh && nvm use 20.11.1 && node -v`: `v20.11.1`
- `npm install`: 통과
- `npm test`: 통과, 8 files / 11 tests
- `npm run lint`: 통과
- `npm run build`: 통과
