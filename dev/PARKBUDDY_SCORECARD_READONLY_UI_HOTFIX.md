# ParkBuddy Scorecard Readonly UI Hotfix

## Purpose

This hotfix resolves TypeScript strict-null errors in the first readonly scorecard tabs implementation.

## Problem

`ScorecardTabs.tsx` allowed `selectedGroup` to be inferred as possibly `undefined` when groups were empty. Some table rendering code also used `filter(Boolean)`, which did not narrow nullable members strongly enough for TypeScript.

## Fix

- Treat the selected group as `ScorecardGroup | null`.
- Add an explicit empty-state return when no group exists.
- Move selected member order calculations after the group guard.
- Replace `filter(Boolean)` score lookup with a type-safe `flatMap` lookup.

## Scope

- No database changes.
- No save behavior changes.
- No RLS changes.
- Readonly scorecard tabs remain the implementation scope.
