-- Entfernt LUMEUS verify-admin Infrastruktur (shared ADMIN_PASSWORD).
-- Fenyx nutzt Supabase Auth + MFA + RBAC stattdessen.

drop function if exists public.record_admin_auth_attempt(inet, boolean);
drop function if exists public.check_admin_auth_rate_limit(inet);

drop policy if exists "admin_auth: kein direkter Client-Zugriff" on public.admin_auth_attempts;
drop table if exists public.admin_auth_attempts;
