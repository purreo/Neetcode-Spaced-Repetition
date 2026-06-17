# Neetcode Spaced Repetition Extension

## Overview
A Chrome Extension (Manifest V3) that automates spaced repetition for neetcode.io. It detects when a problem is successfully completed on neetcode.io, adds it to a local database, and provides a daily dashboard (via the extension popup) showing problems due for review, using Anki-style difficulty ratings to calculate next review intervals.

**Project Type:** WEB (`frontend-specialist`)

## Decisions & Context

### 1. **Data Storage & Sync**
**Decision:** We will use `chrome.storage.sync` to ensure your data is synced across your Chrome browsers automatically without manual export/import. 
**Optimization:** Because `chrome.storage.sync` has a strict total quota of 100KB, we will use a highly compressed storage schema. Instead of storing large JSON objects, we will store a minified representation for each problem (e.g., `problemSlug: "interval|ease|nextReviewTimestamp"`). This will reduce each problem's footprint to ~30 bytes, easily allowing all 1000+ Neetcode problems to fit within the 100KB limit safely.

### 2. **Detection Mechanism Scope**
**Decision:** The extension will implement **automatic DOM detection** to capture successful submissions automatically, AND we will also include a **manual "Add to Repetition" button** in the popup as a reliable fallback.

### 3. **Spaced Repetition Algorithm**
**Decision:** We will use a modified SuperMemo-2 (SM-2) algorithm tailored for coding prep with standard Anki interval multipliers.

## Success Criteria
- Extension successfully detects passing a problem on neetcode.io.
- Problems are stored persistently.
- Popup displays problems due today.
- User can rate difficulty (Again, Hard, Good, Easy) which schedules the next review date.
- Code passes all linting and security checks.

## Tech Stack
- **Framework:** React + Vite (for the popup UI)
- **Styling:** Tailwind CSS v4 (via `tailwind-patterns`) for premium, modern aesthetics.
- **Extension API:** Chrome Manifest V3
- **Storage:** Chrome Storage API (`chrome.storage.sync` with optimized schema)
- **Logic:** Vanilla TypeScript for Content Scripts and Service Workers.

## File Structure

### Proposed Changes

#### Chrome Extension Core
- `manifest.json` (V3 configuration)
- `src/background/service-worker.ts` (Handles background alarms and spaced repetition state)
- `src/content/neetcode-detector.ts` (DOM observer for neetcode.io)

#### Popup UI (React)
- `index.html`
- `src/popup/main.tsx`
- `src/popup/App.tsx`
- `src/popup/components/ProblemCard.tsx`
- `src/popup/components/DailyList.tsx`
- `src/popup/index.css` (Tailwind configuration)

#### Shared Logic
- `src/shared/storage.ts` (Wrapper for chrome.storage)
- `src/shared/sm2.ts` (Spaced repetition algorithm)

## Task Breakdown

### Task 1: Foundation & Scaffold
- **Agent:** `frontend-specialist` (Skill: `app-builder`)
- **Action:** Setup Vite, React, Tailwind CSS v4, and Manifest V3.
- **INPUT → OUTPUT:** Empty directory → Working Vite extension build (`npm run build`).
- **VERIFY:** `manifest.json` is valid V3 and popup renders a placeholder.

### Task 2: Core Algorithm & Storage
- **Agent:** `backend-specialist` (Skill: `api-patterns`)
- **Action:** Implement `storage.ts` and `sm2.ts`.
- **INPUT → OUTPUT:** Typescript logic → Unit tests passing for SM2 calculation.
- **VERIFY:** Storage functions successfully save and retrieve problem data using the compressed schema.

### Task 3: Content Script Detection
- **Agent:** `frontend-specialist` (Skill: `clean-code`)
- **Action:** Build `neetcode-detector.ts` to observe DOM changes for success messages.
- **INPUT → OUTPUT:** Content script injected → Console logs when problem passed.
- **VERIFY:** Extension correctly intercepts a passed test on neetcode.io.

### Task 4: Premium Popup UI
- **Agent:** `frontend-specialist` (Skill: `frontend-design`, `tailwind-patterns`)
- **Action:** Build the daily dashboard, manual "Add" button, and review cards in React.
- **INPUT → OUTPUT:** Raw React components → Beautiful, modern, animated UI.
- **VERIFY:** Popup shows due problems and buttons update intervals correctly.

## Phase X: Verification Plan

### Automated Tests
- Type checking (`npx tsc --noEmit`)
- Linting (`npm run lint`)
- Security Scan (`python .agents/skills/vulnerability-scanner/scripts/security_scan.py .`)
- UX Audit (`python .agents/skills/frontend-design/scripts/ux_audit.py .`)

### Manual Verification
- Load "unpacked extension" in Chrome.
- Navigate to neetcode.io and submit a correct solution.
- Verify problem appears in the extension popup.
- Advance system time (or mock) and verify intervals work.

## ✅ PHASE X COMPLETE
- Lint: [x] Pass
- Security: [x] No critical issues
- Build: [x] Success
- Date: 2026-06-17
