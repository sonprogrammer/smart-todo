# Front Issues

작성일: 2026-07-18

## 현재 상태

백엔드 작업 완료 후 전체 검증을 다시 실행했고, `FE-02-FIX-01` 관련 Frontend 변경에 대해 현재 Planner 판단이 필요한 차단 이슈는 없다.

## 참고

- FE-02/FE-02-FIX-01은 BE/Supabase 미완성 기간 동안 localStorage 임시 저장 경계를 사용한다.
- UI는 localStorage에 직접 접근하지 않고 `features/todos/api.ts` 및 `features/todos/queries.ts` 경계를 통해서만 접근한다.
- 이후 BE API 연결 시 `features/todos/api.ts` 내부 구현을 `/api/todos` 호출로 교체하면 된다.

## PR #1 check 기준 이슈

PR #1의 기존 head는 `f52416b581a5bfa6bd1a3c7ba31ce8d94a3f8301`였고, 확인 당시 GitHub에 보고된 check가 없었다.

현재 저장소에는 `.github/workflows`가 없어서 기존 커밋 `f52416b581a5bfa6bd1a3c7ba31ce8d94a3f8301` 자체에 새 check를 생성할 수 없었다. GitHub Actions check를 PR에 보고하려면 workflow 파일을 추가한 새 커밋이 필요하다.

따라서 CI 설정 추가 후 PR #1의 head 커밋은 변경된다. 기존 `f52416b581a5bfa6bd1a3c7ba31ce8d94a3f8301` 기준 check를 유지해야 하는지, 아니면 CI 설정 커밋을 포함한 최신 PR head 기준 check를 merge 기준으로 볼지는 Planner 판단이 필요하다.

## PR #1 main 동기화 충돌

PR #2가 먼저 main에 merge되면서 PR #1의 `.github/workflows/ci.yml`도 add/add 충돌 상태가 됐다.

정리 기준은 main에 반영된 공통 CI 정의로 두었다. 이 기준은 `backend/**`와 `front/**` 브랜치 push 및 main 대상 pull request에서 동일한 `npm verify` job을 실행한다.

이번 정리는 CI 설정 충돌 해소와 main 동기화에 한정했다. FE 기능 코드는 충돌 해소 목적으로 별도 수정하지 않았다.

현재 추가 Planner 판단이 필요한 새 차단 이슈는 없다.
