---
title: "Office Boards"
description: "ChatGPT-style PWA for idea and vision boards. Drag-and-drop notes and images, agent chat sidebar, installable, offline-first."
status: "shipped"
tags: ["projects", "web"]
startDate: 2026-05-13
order: 5
---

A personal-productivity PWA — drag-and-drop idea boards (text notes) and vision boards (images/GIFs from the device), with an agent-chat sidebar wired to an AI fleet.

Next.js 15 + React 19, TypeScript, Tailwind, IndexedDB. Installable as a PWA, works offline.

Phase 1 shipped: canvas, notes, vision board, chat sidebar, install-as-app. The agent gateway connector is the next milestone.

The design constraint that shaped it: the chat sidebar is a real fleet client, not a single-bot toy. The board is the workspace; the agent is a collaborator. Most "AI productivity apps" get this backwards — they put the chat in the center and treat the workspace as a side panel. Office Boards treats the workspace as primary and the agent as a side panel.

Repo coming to GitHub when it's ready for public release.
