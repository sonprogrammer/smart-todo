# Frontend Issues

작성일: 2026-07-18

## FE-01-FIX 환경 제약

FE-01-FIX에서 `package.json`을 Next.js 16 기준으로 되돌리고 `engines.node`를 `>=20.9.0`으로 명시했다. 또한 `.nvmrc`와 로컬 개발 의존성 `node@20.11.1`을 추가해 npm scripts가 Next.js 16 요구사항을 만족하는 Node 런타임에서 실행되도록 고정했다.

남아 있는 제약은 다음과 같다.

- 셸의 기본 Node.js 버전은 여전히 `v20.8.0`이다.
- `npm install` 또는 `npm install --package-lock-only` 자체는 시스템 Node.js `v20.8.0`으로 실행되어 Next.js 16, ESLint 9, TypeScript ESLint 계열 패키지에서 `EBADENGINE` 경고가 출력된다.
- `npm test`, `npm run lint`, `npm run build`는 프로젝트 로컬 Node.js `20.11.1` 경로가 npm script PATH에 포함되어 통과했다.

## 의사결정 필요

현재 조치는 FE-01-FIX 완료 조건을 만족하기 위한 실행 환경 고정이다. 다만 다음 사항은 구현자가 최종 결정하지 않고 Planner 판단이 필요하다.

1. 로컬 `node` npm 패키지를 개발 의존성으로 유지할지, 아니면 개발자/CI 시스템 Node를 직접 `>=20.9.0`으로 올릴지 결정해야 한다.
2. npm 자체 실행 시 발생하는 `EBADENGINE` 경고를 허용할지, 패키지 설치 환경까지 Node `>=20.9.0`으로 통일할지 결정해야 한다.
3. `npm audit`이 보고하는 moderate 취약점 2건은 이번 FE-01-FIX 범위 밖이다. 의존성 업그레이드 또는 예외 허용 여부는 Planner가 별도 판단해야 한다.
4. `npm test` 실행 시 Vite Node API의 CJS build deprecation warning이 출력된다. 현재 테스트 실패로 이어지지는 않지만, Vitest/Vite 설정 또는 버전 조정 여부는 Planner가 별도 판단해야 한다.

## 아키텍처 불일치 여부

FE-01-FIX 후 프레임워크 기준은 `docs/ARCHITECTURE.md`의 `Next.js 16 App Router / React 19`와 다시 일치한다.

단, FE-01 화면은 여전히 목록/빈 상태의 최소 렌더링만 구현되어 있으며, `docs/ARCHITECTURE.md`에 정의된 TanStack Query, Route Handler, Supabase 저장소 흐름은 FE-02/BE 단계에서 연결되어야 한다. 이 연결 시점과 순서는 기존 `tasks/TASKS.md`의 후속 작업 범위로 남긴다.

## FE-01-RUNTIME 반영 결과

FE-01-RUNTIME에서 Planner 결정에 따라 로컬 `node@20.11.1` devDependency 우회 방식을 제거했다.

반영 내용은 다음과 같다.

- nvm에 Node.js `20.11.1`을 설치했다.
- nvm default alias를 `20.11.1`로 설정했다.
- `.nvmrc`는 `20.11.1`을 유지한다.
- `package.json`의 `engines.node`를 `>=20.11.1`로 정렬했다.
- `package.json` devDependencies에서 `node`를 제거했다.
- Next.js 16 / React 19 기준은 유지했다.
- `npm install`에서 `EBADENGINE` 경고를 없애기 위해 `typescript-eslint`를 `8.46.0`으로 직접 고정했다. `eslint-config-next@16.2.10`의 `typescript-eslint` 요구 범위가 `^8.46.0`이므로 Next.js 16 기준 안에서 동작한다.

검증 중 확인한 환경 차이는 다음과 같다.

- `source ~/.nvm/nvm.sh && nvm use 20.11.1` 적용 셸: `node -v`가 `v20.11.1`이다.
- interactive zsh: nvm default alias를 통해 `node -v`가 `v20.11.1`이다.
- Codex의 plain non-interactive login shell: `.zshrc`를 읽지 않아 `node -v`가 여전히 `v20.8.0`이다.

FE-02는 nvm이 적용된 프로젝트 셸, 즉 `node -v`가 `v20.11.1` 또는 그 이상으로 확인되는 환경에서만 진행해야 한다. plain non-interactive shell에서 `.zshrc`를 읽지 않는 동작을 바꿀지 여부는 사용자 셸 정책에 해당하므로 구현자가 추가로 결정하지 않는다.
