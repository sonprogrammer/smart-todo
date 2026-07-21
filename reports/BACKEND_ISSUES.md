# Backend Issues

작성일: 2026-07-18

## Planner 판단 필요

- 현재 BE-01 진행 중 Planner 판단이 필요한 신규 Backend 이슈는 없다.

## 참고

- `@supabase/supabase-js` 최신 버전은 설치 시 Node.js `>=22.0.0` engines 경고가 발생했다.
- 프로젝트 기준은 Node.js `20.11.1`이므로, BE-01에서는 engines 경고가 없는 `@supabase/supabase-js@2.50.0`으로 고정했다.
- `npm install`은 최종 상태에서 통과했으며 engines 경고는 재발하지 않았다.
