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
