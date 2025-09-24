# aars.works Control Tower – Implementation Plan

This document captures the high-level plan, tasks, and design decisions to evolve the current RoutAAR project into the aars.works Control Tower. All implementation must align with the existing UI system and architectural style in this repository.


## Guiding Principles
- UI consistency: reuse existing components under `src/ui` (Button, Input, Dialog, Form, Select, Dropdown, Card, Tabs, Tooltip, etc.) and layout patterns already used in Dashboard. Maintain dark-mode support and theme usage.
- UX: keep interactions consistent with existing CRUD flows (modals, toasts via Sonner, inline validations with Zod and react-hook-form).
- Code style: follow current TypeScript, server actions, Zod schemas, and Prisma usage patterns. Maintain early returns, clear naming, and readable code.
- Backwards compatibility: keep existing path-based short links working (`/<slug>`). Add subdomain-based features in parallel.
- Security and privacy by default: authenticated panel, safe proxying, and sensible logging.


## High-level Architecture Additions
- Data model for subdomain management and analytics:
  - Subdomains: define per-subdomain behavior and target.
  - Visits: store access analytics for each subdomain (basic, extensible later).
- Middleware enhancement:
  - Host-based routing: resolve subdomain entries from the request host.
  - Modes: Redirect (301/302) and Render (reverse proxy / rewrite) with optional path/query passthrough.
- Dashboard additions:
  - Subdomains: list, search, create, edit, delete.
  - Analytics (basic): total visits, recent visits per subdomain.
- DevOps/DNS:
  - Wildcard DNS for `*.aars.works` and deployment host configuration on Vercel.


## Phased Delivery (Milestones)
- Phase 1: Core subdomains (DONE)
- Phase 2: Render mode (DONE)
- Phase 3: Analytics UI (DONE)
- Phase 4: Hardening (NEXT)


## To-do Checklist
- [x] Data model & migrations (Subdomains, SubdomainTags, Visits)
- [x] Middleware (redirect + render rewrite + passthrough + visits)
- [x] Server actions & schemas (create/update/delete/list/get)
- [x] Dashboard UI
  - [x] Subdomains list + create dialog
  - [x] Edit dialog + Delete confirm
  - [x] Analytics page (total + recent visits)
  - [x] PRIMARY_HOST-based display for hostnames
- [x] README update and repository metadata
- [x] Production domain & wildcard setup docs under `/docs`
- [ ] Hardening
  - [ ] Error states in UI cards/dialogs (enhanced)
  - [ ] Optional rate limiting 