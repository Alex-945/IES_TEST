# CQE Weekly Report System Requirements Draft

## Goal

Build a maintainable CQE weekly report web system based on the V7 prototype, with proper data persistence and room for workflow expansion.

## Product position

The new system should serve as an internal web system for CQE teams to create, maintain, search, and export weekly reports.

## Core users

- CQE engineer
- CQE manager or supervisor
- plant quality management

## First release scope

### Weekly report management

- create weekly report by reporting week
- edit existing weekly report
- view report history
- duplicate last week's content as a starting point

### Report content modules

- Issue
- Interaction
- Activity

Each weekly report can contain multiple entries in each module.

### Master data

- project mapping table
- terminology dictionary
- quick phrase library

### Summary generation

- generate Chinese summary from structured data
- generate English summary from structured data
- preserve standardized sentence templates

### AI assistance

- parse free-text into structured fields
- translate Chinese engineering terms with dictionary context

## Recommended system model

### Weekly report

A weekly report should contain:

- year
- week number
- site
- owner
- status
- created at
- updated at

### Issue item

- site
- indicator
- reporter
- customer
- product
- project
- symptom
- quantity
- date
- liability
- conclusion
- generated Chinese summary
- generated English summary

### Interaction item

- site
- type
- who
- date
- description
- result
- generated Chinese summary
- generated English summary

### Activity item

- site
- category
- name
- status
- target completion
- help needed
- generated Chinese summary
- generated English summary

## Workflow recommendation

Phase 1:

- draft
- finalized

Phase 2:

- draft
- submitted
- reviewed
- approved

## Non-goals for first release

- customer-facing portal
- external email automation
- complex role matrix
- multi-level sign-off

## Technical direction

Use the existing workspace stack:

- Next.js
- TypeScript
- Prisma

Keep V7 as reference data only. Build the new system with:

- server-backed data model
- structured UI
- reusable summary generator logic

## Immediate next build target

The first buildable milestone should include:

- database schema for weekly report, issues, interactions, activities
- web UI for list and edit
- seed data import from V7 mapping and dictionary
- summary generation service layer
- placeholder AI integration points
