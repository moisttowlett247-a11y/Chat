# Enterprise SaaS Agent Dashboard Simulation

The goal is to build an interactive SaaS dashboard where three AI agents (Architect, Lead Dev, QA) collaborate on user-provided prompts. The dashboard will feature a live preview panel that visually updates with component mocks as agents iterate, providing a tangible sense of the "build" process, alongside an active simulation log and an agent status tracker.

## User Review & Critical Decisions

> [!IMPORTANT]
> The simulation will be styled as an Enterprise SaaS Dashboard, following a clean, functional, high-density layout.

- **Domain/Theme**: Enterprise SaaS Dashboard (Confirmed as Recommended Default).
- **Preview Fidelity**: High-fidelity dynamic component rendering (e.g., Hero, Grid, Form widgets) (Confirmed as Recommended Default).
- **Agent Collaboration**: Simulated infinite collaboration loop with sliding-window log management (50 entries) (Confirmed).
- **Interactive Input**: Sanitized user prompt input driving the collaboration task (Confirmed).

## 1. Overview & Core Concept

- **What It Does**: A real-time dashboard that visualizes the collaborative web development process. User enters a prompt, agents "collaborate" on the task, and the Live Preview panel renders component mocks as they are "implemented".
- **Target Audience**: Developers, UI/UX designers, and anyone interested in agentic collaboration workflows.
- **Key Value**: Provides an intuitive, visual representation of a complex, multi-agent development pipeline.

## 2. User Experience & Visual Design

- **Key User Flows**: 
    1. User submits a prompt.
    2. Simulation status updates to `Active: <prompt>`.
    3. Logs panel starts populating with agent activity (Architect -> Dev -> QA loop).
    4. Preview panel updates dynamically to match the current "component" iteration (Hero, Grid, Filter, etc.).
- **Visual Identity & Theme**:
    - **Aesthetic Direction**: Utilitarian, Enterprise SaaS.
    - **Color Palette & Mood**: Dominant neutral canvas (`#F8FAFC` slate-50), structural surfaces (`#FFFFFF` white background, `#E2E8F0` slate-200 borders), 10% accent (`#0F172A` slate-900 primary action).
    - **Typography & Hierarchy**: `Plus Jakarta Sans` for UI, `JetBrains Mono` for tabular data, logs, and telemetry.
    - **Component Styling**: Flat panels with 1px border lines, compact row heights for logs, high-density agent list.

## 3. Key Product Decisions & Trade-Offs

- **State Management**: Using `useState` and `useEffect` for log management and interval-based simulation. Chosen for simplicity in the simulation environment.
- **Preview Rendering**: `renderPreview` function with `switch` statement rendering mock components based on state. Chosen over full-blown dynamic component loading to ensure reliability in the simulation environment.
- **Memory Management**: Sliding window for logs (last 50). Necessary to prevent browser slowdown during infinite simulation.

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                       App Component                         │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                  Header + Prompt Input                  │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌──────────────────┬──────────────────┬───────────────────┐ │
│ │  Live Preview    │  Simulation Logs │   Agent Status    │ │
│ │ (Dynamic Render) │ (Sliding Window) │   (Status Map)    │ │
│ └──────────────────┴──────────────────┴───────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

- **Data Model**:
    - `logs`: `Array<{id: number, text: string}>` (Sliding window managed via `slice`).
    - `activeTask`: `string | null`.
    - `previewComp`: `string | null` (Triggers Preview component update).
- **Interactive Mapping**: 
    - `handleSubmit`: Updates `activeTask` -> Starts `useEffect` interval -> Populates `logs` -> Triggers `previewComp` update via interval simulation.
    - `renderPreview`: State-driven component switcher based on `previewComp`.
