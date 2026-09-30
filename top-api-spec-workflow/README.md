# TOP API Spec Workflow

Private Java/API-specific workflow repository for implementing contracts from `top-spec-workflow` in the TOP Spring Boot framework.

## Repository boundary

This repository contains API contracts, Java-specific instructions, contract schemas, generation/validation tooling, and API test guidance. It does not contain the Java application source code or the original DR evidence.

## VS Code workflow configuration

The `.github/` directory contains the API workflow guidance:

```text
.github/
├── agents/
│   ├── api-spec-orchestrator.agent.md    # coordinates Phase 1-4 and enforces gates
│   ├── api-contract-analyst.agent.md     # Phase 2: writes/reviews api-contract.json
│   ├── java-function-developer.agent.md  # Phase 3: generates Java from the contract
│   ├── java-test-engineer.agent.md       # Phase 4a: generates/runs Cucumber scenarios
│   └── java-function-reviewer.agent.md   # Phase 4b: read-only review.md against the contract
├── instructions/api-contract.instructions.md
├── instructions/java-implementation-reference.instructions.md
├── instructions/main-source-code.instructions.md
└── prompts/
	├── create-api-contract.prompt.md          # create or update an API contract
	├── review-api-contract.prompt.md          # review contract traceability and framework fit
	├── prepare-api-contract.prompt.md         # prepare source-backed decisions in chat
	├── generate-crud-function.prompt.md       # generate standard CRUD implementation files
	├── generate-sql-chain-function.prompt.md  # generate concurrency-safe SQL-chain files
	├── generate-cucumber-feature.prompt.md    # generate Cucumber scenarios
	└── review-generated-function.prompt.md    # review generated Java against the contract
```

Use the **API Spec Orchestrator** to drive the full pipeline. The **API Contract Analyst** runs after the
shared grill is agreed and produces or reviews the API contract only. Java implementation, generated tests,
and code review happen in the Java application repository, driven from here by the **Java Function
Developer**, **Java Test Engineer**, and **Java Function Reviewer** agents.

Use `prepare-api-contract.prompt.md` for chat-only normalization when needed, then use
`create-api-contract.prompt.md` to write the single durable `api-contract.json`. Do not create a separate
Function Spec file.

Shared requirement artifacts remain in `top-spec-workflow`:

```text
TOP DR → top-spec-workflow/specs/<FUNCTION_KEY>/ → api-contract.json → Java implementation
```

## Repositories

```text
top-spec-workflow                    # shared requirements and traceability
top-api-spec-workflow                # this repository
top-spring-boot-starter              # framework and reference implementation
top-api                               # future/real Java service, when created
```

The current Java reference repository is:

```text
C:\Users\<name>\toyota_repos\apis\top-spring-boot-starter
```

Its reference application is `top-demo-project`. In a real microservice repository, feature code belongs
under the selected service module, for example:

```text
<service-module>/src/main/java/<base-package>/<function-key>/
```

Resolve `<service-module>` from the build files (`top-cmn`, `top-crm`, `top-smb`, or another service) and
`<base-package>` from an existing feature. Generation prompts must not assume the demo module or package.

## Contract location

API contracts are stored beside the shared feature artifacts in the shared spec repository, not duplicated here:

```text
C:\Users\<name>\toyota_repos\top-spec-workflow\specs\WCRM010203\api-contract.json
```

The contract is the only approved input for Java scaffolding. Do not generate Java directly from raw DR files or from `ui-contract.json`.

## Expected API contract contents

An agreed `api-contract.json` should describe only confirmed behavior:

- function key and API function ID
- entities, table mappings, primary keys, and relationships
- request/data fields and search/filter fields
- data types, nullability, lengths, and documented validations
- actions and framework registration mode
- named query or SQL requirements when explicitly specified
- business rules requiring a processor
- permissions and error-code references
- response shape and acceptance-test references
- source references and unresolved questions

Unknown material behavior stays unresolved. The workflow must not invent database mappings, permissions, validation, or endpoint behavior.

## Java framework rules

The starter is metadata-driven and already provides:

- `GenericController`
- `GenericService`
- global exception handling
- authorization infrastructure
- OpenAPI generation
- pagination and generic CRUD operations

Feature work should generate or implement only the feature module. `entity/` is shared at the
base-package level, not duplicated per function:

```text
<base-package>/
├── entity/         # shared JPA entities, reused across function keys
└── <function-key>/
    ├── config/     # FunctionConfig or GenericCrud registration
    ├── dto/        # GenericDataStore and GenericFilter types
    ├── repository/ # JpaRepository + JpaSpecificationExecutor
    ├── processor/  # CustomLogicProcessor only for business rules
    └── support/    # feature-specific helpers, validators, combo loaders
```

Do not create feature controllers, CRUD services, exception handlers, security filters, manual OpenAPI annotations, DTO mappers, or custom repository query methods when the framework already provides the behavior.

Use Java 21, Spring Boot 4.1.1 conventions, PostgreSQL production assumptions, H2 PostgreSQL-mode tests, Jackson 3 imports (`tools.jackson.*`), and error codes from `crm_error_messages.json`.

## Recommended commands

The command implementation will be added after the API contract schema is agreed. Planned commands are:

```text
api-contract:validate <FUNCTION_KEY>
java:guard
java:generate <FUNCTION_KEY>
api:test-scaffold <FUNCTION_KEY>
```

Until then, review `top-spec-workflow/specs/<FUNCTION_KEY>/grill.json` and `raw/`, then create `api-contract.json` with source references before generating Java code. See `top-spec-workflow/POLICY.md`.
