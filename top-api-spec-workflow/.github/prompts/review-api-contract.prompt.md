---
name: review-api-contract
description: Review an API contract for traceability and compatibility with the TOP Spring Boot starter.
---

# Review API Contract

Check:

- the feature grill is agreed;
- the contract passes the API schema;
- entities, fields, actions, permissions, and errors have source references;
- request fields and search fields are distinct;
- unresolved questions are explicit;
- actions fit `GenericController` and `FunctionRegistry` routes;
- no feature controller, CRUD service, manual OpenAPI, security, pagination, or mapper code is implied;
- acceptance criteria cover success, validation, business rejection, permissions, and data outcomes.

Report missing evidence as findings. Do not silently fill gaps.
