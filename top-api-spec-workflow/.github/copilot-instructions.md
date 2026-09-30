# TOP API Spec Workflow Instructions

This repository defines and validates API contracts for the TOP Java implementation. It is not the Java application repository.

## Repository boundary

- Shared DR evidence and technology-neutral requirements live in `top-spec-workflow`.
- API contracts live in `top-spec-workflow/specs/<FUNCTION_KEY>/api-contract.json`.
- Java implementation lives in the selected Java service module, following the starter conventions and
	the existing patterns of that service.
- Do not create Java source files in this repository.

## Contract-first rules

1. Read `grill.json`, `sources.md`, and `raw/` from `top-spec-workflow`. The policy is `top-spec-workflow/POLICY.md`.
2. Do not create an API contract until `grill.json` is `agreed`. Copy `identified.validations` into the API contract. There is no second grill.
3. Every entity, field, action, permission, error, and acceptance criterion needs a source reference or an explicit open question.
4. Do not invent table names, relationships, permissions, validation rules, error codes, or endpoint behavior.
5. Keep `api-contract.json` separate from `ui-contract.json` and runtime Java configuration.
6. Validate the contract against `schemas/api-contract.schema.json` before Java implementation.

## Java framework constraints

The referenced starter already provides `GenericController`, `GenericService`, global errors, authorization, pagination, and OpenAPI generation. API workflow output must not request or generate feature-level controllers, CRUD services, exception handlers, security filters, pagination, DTO mappers, or manual OpenAPI annotations.

Generated feature code must follow the starter's Java 21 / Spring Boot 4.1.1 conventions, use Jackson 3 (`tools.jackson.*`), use framework-approved JPA patterns, and represent validation messages as error codes backed by `crm_error_messages.json`.

## Review boundary

The API contract is ready for implementation only when schema validation passes, blocking questions are resolved, acceptance scenarios are mapped, and a developer has reviewed the entity/action/error decisions.
