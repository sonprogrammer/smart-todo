# FE-01 Issues

작성일: 2026-07-18

## 요약

FE-01 구현 과정에서 현재 실행 환경과 `docs/ARCHITECTURE.md`의 기술 스택 정의가 일치하지 않는 문제가 확인되었다.

현재 구현은 빌드 검증을 통과시키기 위해 임시로 Next.js 15.5.20을 사용한다. 이는 최종 기술 결정이 아니며, Planner가 아키텍처 기준을 유지할지 또는 실행 환경 기준으로 조정할지 판단해야 한다.

## 확인된 환경 제약

- 현재 Node.js 버전: `v20.8.0`
- `docs/ARCHITECTURE.md`의 기준: `Next.js 16 App Router / React 19`
- 현재 `package.json`의 구현 버전: `next@^15.5.20`, `react@^19.0.0`, `react-dom@^19.0.0`

## Next.js 16 빌드 불가 원인

FE-01 초기 구현에서 Next.js 16을 설치한 뒤 `npm run build`를 실행했을 때, Next.js가 현재 Node.js 버전을 거부했다.

빌드 실패 원인은 Next.js 16이 Node.js `>=20.9.0`을 요구하지만, 현재 환경은 Node.js `v20.8.0`이기 때문이다.

즉, 실패 원인은 애플리케이션 코드나 FE-01 화면 구현 문제가 아니라 런타임 버전 제약이다.

## 임시 조치

검증 가능한 초기화 작업을 완료하기 위해 Next.js를 `15.5.20`으로 낮춰 사용했다.

이 조치 후 다음 검증은 통과했다.

- `npm test`
- `npm run lint`
- `npm run build`

단, 이 조치는 아키텍처 결정의 대체가 아니라 현재 환경에서 FE-01 결과물을 검증하기 위한 임시 조치다.

## ARCHITECTURE.md와의 불일치

현재 구현은 `docs/ARCHITECTURE.md`와 다음 지점에서 일치하지 않는다.

1. `docs/ARCHITECTURE.md`는 전체 시스템 구조에서 `Next.js 16 App Router / React 19`를 명시한다.
2. 현재 구현은 `Next.js 15.5.20 / React 19` 조합이다.
3. `docs/ARCHITECTURE.md`의 폴더 구조에는 `features/todos/queries.ts`와 Supabase 기반 API 경계가 예정되어 있으나, FE-01에서는 백엔드와 저장소가 아직 없어서 `features/todos/api.ts`가 빈 배열을 반환하는 임시 조회 경계로만 구현되어 있다.
4. `docs/ARCHITECTURE.md`의 Todo CRUD 흐름은 TanStack Query와 `/api/todos*` Route Handler를 포함하지만, FE-01에서는 목록/빈 상태 화면의 최소 렌더링만 구현되어 해당 서버 흐름은 아직 연결되지 않았다.

## 가능한 해결 방향

Planner가 선택할 수 있는 방향은 다음과 같다.

1. Node.js를 `>=20.9.0`으로 올리고, `ARCHITECTURE.md` 기준대로 Next.js 16을 사용한다.
2. 현재 실행 환경인 Node.js `v20.8.0`을 기준으로 아키텍처 문서를 수정하고, MVP 기간에는 Next.js 15.5.20을 공식 기준으로 둔다.
3. 개발/CI 환경에서 사용할 Node.js 버전을 `.nvmrc`, `.node-version`, `package.json engines` 등으로 명시한 뒤, 그 기준에 맞춰 Next.js 버전을 확정한다.
4. FE-02 또는 BE-01 시작 전에 Route Handler, TanStack Query, Supabase 연결 시점을 다시 정리해 `features/todos/api.ts`의 임시 경계를 실제 데이터 흐름으로 교체한다.

## Planner 판단 필요

이 이슈는 단순 구현 세부사항이 아니라 런타임 기준과 아키텍처 기준의 불일치다.

따라서 구현자가 임의로 최종 결정하지 않는다. Planner가 다음 중 어떤 방향으로 갈지 판단해야 한다.

- 아키텍처 기준을 유지하고 Node.js를 업그레이드할지
- 현재 환경 기준으로 아키텍처를 수정할지
- 별도의 개발/CI 런타임 기준을 먼저 확정한 뒤 후속 작업을 진행할지
