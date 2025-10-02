# SPA CLI + MCP Roadmap (TypeScript / Node.js MVP & Future Plan)

## Overview

This roadmap outlines a structured plan to build a CLI-based SPA scaffolding platform with modular MCPs, base components, styling, and feature-specific extensions. It focuses on TypeScript/Node.js for the MVP, using GitHub for repos and AWS for deployment. Later expansions may include additional languages and advanced AI-assisted features.

---

## 1. Layered Architecture

### 1.1 Base SPA CLI (MVP Core)

- React + Vite + TypeScript + React Router scaffold
- Deterministic templates
- Routing, basic pages (Home, About, Contact)
- CI/CD hooks for GitHub Actions
- IaC integration for AWS S3 + CloudFront deployment

### 1.2 Base Components CLI

- Deterministic, reusable UI components: Buttons, Inputs, Cards, Modals, Navbars
- Supports theme configuration (colors, fonts, spacing, rounding)
- Integrates with SPA CLI scaffolds

### 1.3 Styling CLI / Theme Generator

- Allows users to choose or generate themes via UI
- Produces JSON / JS config for components
- Optional AI for advanced/custom styling
- Minimal token usage for MVP

### 1.4 Feature-Specific CLI (Optional for MVP)

- Example: Ecommerce CLI
- Generates domain-specific components and pages: ProductList, Cart, Checkout, Authentication
- Integrates deterministically into SPA CLI scaffold
- AI-assisted generation only for custom logic

### 1.5 Orchestration Backend

- Coordinates CLI generation, GitHub repo creation, AWS deployment
- Handles secrets, credentials, environment variables
- Deploys preview and production URLs

### 1.6 AI / Custom Logic Middle Layer

- Only invoked for custom, non-deterministic features
- Generates feature logic, backend stubs, API calls
- Minimizes token usage for MVP by focusing on advanced requests only

---

## 2. Incremental MVP Plan (TypeScript / Node.js Only)

### Phase 0: Planning & Blueprinting

- Map out SPA base templates
- Define base components
- List top 3–5 SPA use cases
- Setup GitHub + AWS accounts for testing

### Phase 1: Core SPA CLI

- Generate React/Vite/TS/React Router scaffold
- Include deterministic routing and basic pages
- Add basic CI/CD GitHub Action templates
- Deploy to AWS S3 + CloudFront preview URL

### Phase 2: Base Components CLI

- Buttons, Inputs, Cards, Modals, Navbars
- Integrate theme system (JSON config)
- CLI option to apply theme to scaffold

### Phase 3: Styling CLI / Theme Generator

- UI for users to pick or generate a theme
- JSON output for theme config
- Optional AI hook for advanced styling (disabled in MVP)

### Phase 4: Orchestration Backend

- Automate GitHub repo creation & code push
- Deploy preview URL via AWS (deterministic)
- Track deployment status & errors

### Phase 5: Preview & Showcase

- Preview URL for user
- Base theme applied
- Deterministic components only
- Optional AI enhancements later

### Phase 6: Optional Feature CLI (Ecommerce, Dashboard, Blog, etc.)

- Only add deterministic components for top use cases
- AI-assisted logic optional and limited
- Integrates with SPA CLI scaffold

---

## 3. SPA Use Cases (Suggested for Base CLI / Feature CLI)

1. **Landing Page / Marketing Site**
2. **Dashboard / Analytics SPA**
3. **Ecommerce Storefront**
4. **Blog / Content Site**
5. **Portfolio / Personal Site**
6. **Admin Panel**
7. **Small Social / Community Site**

- Each use case includes: prebuilt pages, base components, placeholder/mock API calls
- Can be extended via Feature CLI and AI later

---

## 4. Future Expansion Plan

### Phase 1: Advanced AI Integration

- AI-assisted component generation for custom features
- AI for styling variations beyond base themes
- Token-efficient middle layer to fill non-deterministic gaps only

### Phase 2: Multi-Language Support

- Extend CLI and MCPs to other frameworks/languages (e.g., Python/Flask, Node/Express, Next.js)
- Abstract base templates for cross-language reuse

### Phase 3: Premium / Paid Features

- Hosted previews / ephemeral environments
- AI-assisted custom logic for premium users
- Subscription model for non-dev users

### Phase 4: Modular MCP Marketplace

- Separate MCPs for SPA, Backend, Database, Cloud setup, Monorepo templates
- Users can mix and match feature CLIs
- One-click deployment of partial or full platform blueprint

### Phase 5: Full Orchestration & Automation

- Advanced IaC orchestration for multiple environments
- Support for user-supplied credentials and managed previews
- Scaling multi-user deployments and monitoring

---

## 5. Recommended Tech Stack (MVP)

- **Frontend:** React + Vite + TypeScript + React Router
- **CLI:** Node.js + TypeScript
- **Backend / Orchestration:** Node.js + Express or Fastify
- **CI/CD:** GitHub Actions
- **Deployment:** AWS S3 + CloudFront
- **State / Config:** JSON / JS modules for themes & scaffolds
- **Optional AI:** Claude CLI / other LLMs for advanced, optional features

---

## 6. Notes / MVP Prioritization

- Focus on deterministic templates and previews first
- Minimize AI token usage by limiting AI to advanced optional features
- Start with small set of SPA use cases (landing page, dashboard, ecommerce)
- Build modular CLI + theme system to allow later expansion
- Orchestration backend ensures seamless deployment and preview

---

_This roadmap is designed to help you get started quickly, build a functional MVP, and provide a clear path for scaling and monetizing your CLI/MCP platform in the future._
