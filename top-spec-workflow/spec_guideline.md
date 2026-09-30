Yes. For spec-driven development in VS Code + GitHub Copilot, I would keep two things clearly separated:

How the AI should work → agents, skills, instructions, prompts, hooks, MCP.
What the AI is working on → requirements, design, tasks, acceptance criteria, implementation.

VS Code does not mandate a specs/requirements.md → design.md → tasks.md structure. That part is an engineering convention we define. VS Code officially supports custom agents, skills, prompts, instructions, hooks, and MCP configuration.

For your kind of enterprise/spec-driven project, I recommend this structure:

my-project/
│
├── .github/
│   │
│   ├── copilot-instructions.md
│   │
│   ├── agents/
│   │   ├── spec-orchestrator.agent.md
│   │   ├── requirements.agent.md
│   │   ├── architect.agent.md
│   │   ├── developer.agent.md
│   │   ├── test.agent.md
│   │   └── reviewer.agent.md
│   │
│   ├── skills/
│   │   ├── requirements-analysis/
│   │   │   ├── SKILL.md
│   │   │   ├── checklist.md
│   │   │   └── examples/
│   │   │
│   │   ├── react-development/
│   │   │   ├── SKILL.md
│   │   │   └── component-patterns.md
│   │   │
│   │   ├── api-design/
│   │   │   └── SKILL.md
│   │   │
│   │   ├── database-design/
│   │   │   └── SKILL.md
│   │   │
│   │   └── testing/
│   │       └── SKILL.md
│   │
│   ├── prompts/
│   │   ├── create-spec.prompt.md
│   │   ├── create-design.prompt.md
│   │   ├── implement-task.prompt.md
│   │   ├── review-code.prompt.md
│   │   └── run-tests.prompt.md
│   │
│   ├── instructions/
│   │   ├── react.instructions.md
│   │   ├── backend.instructions.md
│   │   ├── database.instructions.md
│   │   └── testing.instructions.md
│   │
│   └── hooks/
│       ├── quality-gates.json
│       └── security-checks.json
│
├── .vscode/
│   ├── mcp.json
│   └── settings.json
│
├── AGENTS.md                         # optional
│
├── specs/
│   ├── customer-search/
│   │   ├── requirements.md
│   │   ├── design.md
│   │   ├── tasks.md
│   │   ├── acceptance.md
│   │   └── decisions.md
│   │
│   └── customer-registration/
│       ├── requirements.md
│       ├── design.md
│       ├── tasks.md
│       └── acceptance.md
│
├── docs/
│   ├── architecture/
│   ├── standards/
│   ├── api/
│   └── database/
│
├── src/
├── tests/
└── package.json
The most important distinction

Think of it this way:

                    SPEC-DRIVEN DEVELOPMENT
                             │
              ┌──────────────┴───────────────┐
              │                              │
         AI CONFIGURATION               SPEC ARTIFACTS
              │                              │
    .github/agents/                     specs/
    .github/skills/                        │
    .github/prompts/                       ├─ requirements.md
    .github/instructions/                  ├─ design.md
    .github/hooks/                         ├─ tasks.md
    copilot-instructions.md                └─ acceptance.md
              │
              ↓
       Controls HOW AI works
                                             ↓
                                   Defines WHAT to build

This separation is very important.

1. copilot-instructions.md

Location:

.github/copilot-instructions.md

This is your project constitution.

VS Code automatically detects this file and applies it broadly to Copilot interactions in the workspace. It is intended for project-wide coding standards, architecture rules, technology choices, security requirements, naming conventions, and similar baseline guidance.

For example:

# Project Engineering Instructions

## Technology Stack

Frontend:
- React
- TypeScript
- Material UI

Backend:
- Java 21
- Spring Boot
- REST API

Database:
- Oracle

## Architecture

Follow layered architecture:

Controller
↓
Service
↓
Repository
↓
Database

## Mandatory Rules

1. Do not introduce new libraries without approval.
2. Reuse components from src/components.
3. Do not invent requirements.
4. Every implementation must reference a task from /specs.
5. Every API must have validation.
6. Every implementation must include tests.
7. Do not modify DB schema unless specified in design.md.

## Spec Driven Development

Implementation must follow:

requirements.md
→ design.md
→ tasks.md
→ implementation
→ tests

Do not put detailed workflows here.

Keep this relatively short.

2. .agent.md

Location:

.github/agents/

Example:

.github/agents/architect.agent.md

This is a persona/role.

Official VS Code custom agents are defined using .agent.md files. They can specify instructions, available tools, subagents, handoffs and, currently in preview, agent-scoped hooks.

For example:

---
name: architect
description: Creates technical design from approved requirements
tools:
  - search
  - read
---

# Role

You are the solution architect for this application.

Your responsibility is to convert:

requirements.md

into:

design.md

You must not write production code.

## Process

1. Read requirements.md.
2. Inspect existing architecture.
3. Identify reusable components.
4. Identify APIs.
5. Identify database impact.
6. Identify integrations.
7. Document security considerations.
8. Generate design.md.

## Rules

Never invent business requirements.

Every design decision must trace back to a requirement.
For your project I would have these agents
spec-orchestrator.agent.md

requirements.agent.md
architect.agent.md
developer.agent.md
test.agent.md
reviewer.agent.md

Their responsibility becomes:

requirements.agent
        ↓
 requirements.md
        ↓
architect.agent
        ↓
   design.md
        ↓
developer.agent
        ↓
    tasks.md
        ↓
      CODE
        ↓
 test.agent
        ↓
     TESTS
        ↓
 reviewer.agent

And:

spec-orchestrator.agent.md

coordinates the whole pipeline.

3. AGENTS.md versus .agent.md

This causes a lot of confusion.

They are not the same thing.

AGENTS.md

means:

General instructions for agents working inside this repository/folder.

Whereas:

architect.agent.md

means:

Define an actual custom agent/persona called Architect.

VS Code supports AGENTS.md as an automatically applied instruction mechanism, including experimental nested AGENTS.md behavior for subfolders.

Example:

AGENTS.md

.github/agents/
    architect.agent.md
    developer.agent.md

You could put something like this in AGENTS.md:

# Agent Rules

All AI agents working in this repository must follow
spec-driven development.

Never implement functionality unless an approved
spec exists.

The required sequence is:

requirements
→ design
→ tasks
→ implementation
→ verification

Never modify files outside the scope of the
current task.
My preference

For your architecture:

copilot-instructions.md

should be the main global instruction file.

Keep AGENTS.md optional unless you specifically want portability across multiple AI coding-agent ecosystems.

4. SKILL.md

This one is extremely important.

A Skill is not an Agent.

Agent:

WHO should perform the work?

Skill:

HOW do I perform a particular type of work?

VS Code Agent Skills live inside skill-specific directories such as:

.github/skills/
    requirements-analysis/
        SKILL.md

Skills can contain instructions, scripts, examples, templates, and other resources and are loaded when relevant rather than permanently consuming context.

Example:

---
name: requirements-analysis
description: Analyze Jira stories and UX documents and produce structured software requirements.
---

# Requirements Analysis Skill

Use this skill when converting business requirements
into technical requirements.

## Inputs

Potential inputs:

- Jira story
- Confluence document
- UX image
- API specifications
- validation rules

## Procedure

### Step 1
Identify actors.

### Step 2
Identify business functionality.

### Step 3
Extract fields.

### Step 4
Extract validations.

### Step 5
Extract events.

### Step 6
Extract APIs.

### Step 7
Identify unanswered questions.

## Output

Generate:

requirements.md

You can even have:

requirements-analysis/
│
├── SKILL.md
├── requirement-template.md
├── validation-checklist.md
├── examples/
│   ├── good-requirement.md
│   └── bad-requirement.md
└── scripts/
    └── validate-spec.py

This is one reason skills are very powerful.

Agent vs Skill

The simple mental model is:

	Agent	Skill
Question answered	Who am I?	How do I do this?
Example	React Developer	Create React Component
Example	Architect	Design REST API
Example	QA Engineer	Generate Test Cases
File	*.agent.md	SKILL.md
Location	.github/agents/	.github/skills/<skill>/
Tools	Can control tools	Can include scripts/resources
Lifecycle	Persona/session	Loaded when relevant

Therefore:

Developer Agent
       │
       ├── react-development skill
       ├── api-development skill
       ├── database skill
       └── unit-testing skill

That is much cleaner than putting everything inside developer.agent.md.

5. .prompt.md

Official VS Code prompt files use:

*.prompt.md

and are normally placed in:

.github/prompts/

They are essentially reusable commands that you explicitly invoke.

Example:

create-design.prompt.md

could contain:

---
name: create-design
description: Create technical design from requirements
agent: architect
---

Read:

specs/${input}/requirements.md

Validate that requirements are complete.

Then create:

specs/${input}/design.md

Follow the project's architecture standards.

Do not implement any code.

Then the developer can invoke something conceptually like:

/create-design customer-search
One important 2026 consideration

VS Code's current documentation says prompt files continue to work for local extension-host agents, but Agent Host sessions don't use prompt files directly; Microsoft recommends converting important reusable workflows into skills where appropriate.

Therefore I would use:

PROMPT = convenient shortcut
SKILL = reusable core capability

Don't put critical enterprise logic exclusively into prompt files.

6. .instructions.md

This is another very useful layer.

Location:

.github/instructions/

Examples:

react.instructions.md
java.instructions.md
database.instructions.md
testing.instructions.md

These allow rules to apply selectively to specific kinds of files or tasks. VS Code supports *.instructions.md with pattern-based application.

For example:

---
applyTo: "**/*.tsx"
---

# React Rules

Use functional components.

Use TypeScript.

Never directly call REST APIs from components.

Use services from:

src/services/

Reuse existing components from:

src/components/

Do not introduce new UI libraries.

And:

database.instructions.md

might say:

---
applyTo: "**/repository/**"
---

All SQL must use parameterized queries.

Never use SELECT *.

Database changes must be documented
in the corresponding design.md.

This is different from a Skill.

.instructions.md
        ↓
Rules

SKILL.md
        ↓
Procedure/capability
7. Hooks

Hooks are your deterministic control layer.

This is extremely important for enterprise agentic development.

Location:

.github/hooks/

VS Code currently supports hooks as a Preview feature and looks for workspace hook configuration under .github/hooks/*.json.

The difference is:

LLM instruction:

"Please run lint before completing."

vs

HOOK:

Actually execute lint before completion.

The first is probabilistic.

The second is deterministic.

Hooks can therefore enforce things such as:

Agent edits code
      ↓
HOOK
      ↓
npm run lint
      ↓
HOOK
      ↓
npm test
      ↓
HOOK
      ↓
security scan
      ↓
HOOK
      ↓
spec validation

This is where your architecture becomes much stronger.

For example:

.github/hooks/
    quality-gates.json

can invoke scripts such as:

scripts/
    lint.sh
    test.sh
    validate-spec.py
    check-security.py

Think:

Agents = intelligence

Skills = knowledge/procedure

Hooks = enforcement
8. MCP

Location for normal workspace VS Code configuration:

.vscode/mcp.json

VS Code supports workspace MCP configuration there. For portable Agent Host configuration, VS Code now also supports a workspace .mcp.json.

For example:

{
  "servers": {
    "jira": {
    },

    "confluence": {
    },

    "playwright": {
      "command": "npx",
      "args": [
        "-y",
        "@microsoft/mcp-server-playwright"
      ]
    }
  }
}

MCP provides tools/data access.

For your environment it could eventually become:

                   Copilot Agent
                         │
              ┌──────────┼─────────┐
              │          │         │
          Jira MCP   Confluence   DB MCP
                         MCP
              │          │         │
              └──────────┼─────────┘
                         ↓
                     Context

Again, different responsibility:

.agent.md
WHO

SKILL.md
HOW

instructions.md
RULES

MCP
WITH WHAT TOOLS

hooks
WHAT MUST HAPPEN

prompt.md
WHAT COMMAND USER STARTS
9. And now the actual SPEC

This should not go under .github.

I recommend:

specs/
    <feature-name>/

Example:

specs/
└── customer-search/
    ├── requirements.md
    ├── design.md
    ├── tasks.md
    ├── acceptance.md
    └── decisions.md
requirements.md

Contains WHAT.

Business objective

Actors

User stories

Functional requirements

Fields

Validations

Business rules

Events

Acceptance criteria

Non-functional requirements

Out-of-scope

Open questions

No implementation decisions here.

10. design.md

Contains HOW.

Solution overview

Architecture

Component design

Frontend design

Backend design

API contracts

Database design

Sequence flows

Error handling

Security

Logging

Performance

Dependencies

Migration impact

Requirement:

REQ-012

should map to design:

DES-008
11. tasks.md

This is where design becomes executable work.

Example:

# Implementation Tasks

## TASK-001

Requirement:
REQ-001

Design:
DES-003

Implement CustomerSearch component.

Files:

src/components/CustomerSearch.tsx

Acceptance:

- Search button available
- Customer ID validation implemented
- API invoked
- Errors displayed

Tests:

TEST-001
TEST-002

Now Copilot shouldn't receive:

Build Customer Search.

Instead:

Implement TASK-001

That's a major improvement in control.

12. acceptance.md

This provides your verification contract.

For example:

AC-001

Given:
User is on Customer Search screen

When:
User enters valid customer ID

Then:
Customer information is displayed.


AC-002

Given:
Customer ID is empty

When:
Search is clicked

Then:
"Customer ID is required" is displayed.

QA Agent works primarily from this.

13. decisions.md

I strongly recommend this for enterprise projects.

Example:

ADR-001

Decision:
Reuse CustomerDataGrid component.

Reason:
Existing enterprise component.

Rejected:
Build new customer table.

Impact:
No new UI dependency required.

That stops Copilot from repeatedly reconsidering architecture decisions.

How the full system fits together

This is the architecture I would use:

                    USER
                     │
                     ↓
          spec-orchestrator.agent.md
                     │
        ┌────────────┼──────────────┐
        │            │              │
        ↓            ↓              ↓
 Requirements     Architect      Developer
   Agent            Agent          Agent
        │            │              │
        ↓            ↓              ↓
requirements.md   design.md       tasks.md
        │            │              │
        └────────────┴──────┬───────┘
                            ↓
                          CODE
                            │
                            ↓
                       Test Agent
                            │
                            ↓
                         TESTS
                            │
                            ↓
                     Reviewer Agent
                            │
                 ┌──────────┴─────────┐
                 ↓                    ↓
             Skills                 Hooks
                 │                    │
       domain knowledge         deterministic
       procedures               quality gates
                 │                    │
                 └─────────┬──────────┘
                           ↓
                         DONE
And the hierarchy I recommend

The most important architectural concept is this:

LEVEL 1
.github/copilot-instructions.md

Enterprise/project constitution
             ↓

LEVEL 2
.instructions.md

Technology/file-specific rules
             ↓

LEVEL 3
.agent.md

Role/persona + tools
             ↓

LEVEL 4
SKILL.md

Specialized procedures
             ↓

LEVEL 5
.prompt.md

Convenient user-triggered commands
             ↓

LEVEL 6
specs/

Requirements → Design → Tasks
             ↓

LEVEL 7
Source Code
             ↓

LEVEL 8
Hooks

Deterministic verification
For your use case, I would not build 30 giant agents.

I would start with 5–6 agents, then make most reusable knowledge into skills:

Agents

Spec Orchestrator
Requirements Analyst
Solution Architect
Developer
Tester
Reviewer


Skills

Jira requirement extraction
Confluence analysis
UX image analysis
React development
API design
Database design
Toyota UI standards
Validation extraction
Test generation
Code review
Security review

That distinction between Agent = role and Skill = capability will make your VS Code/GHCP implementation much cleaner, easier to govern, and much more token-efficient. VS Code's current model is explicitly moving in this direction: baseline instructions, targeted instructions, skills for reusable workflows, custom agents for specialized roles, hooks for deterministic lifecycle actions, and MCP for external capabilities.

For the Jira + UX image + Confluence → Requirement → Design → Task → React Code workflow you've been building, this structure is a particularly good fit.