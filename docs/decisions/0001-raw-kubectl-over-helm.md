# 1. Deploying with raw kubectl instead of Helm

## Status
Accepted

## Context
The project needs a way to get manifests onto the cluster. Helm is the
default choice for most Kubernetes deployments, and it appears
elsewhere in the broader stack this project sits alongside.

For this project specifically, the deployment surface is small — a
single manifest, no templated environment variants, no chart
dependencies to manage. Introducing Helm here would mean maintaining
chart structure, values files, and templating logic for something
that doesn't currently have enough moving parts to justify it.

## Decision
Deploy via `kubectl apply -f` against a raw manifest. No Helm chart
for this project at its current scope.

## Consequences
- Fewer files to maintain, no templating layer to debug.
- No built-in rollback/versioning that Helm provides — rollbacks are
  handled manually via manifest history in git.
- If the project grows multiple environments or needs templated
  config (per-environment resource limits, secrets injection), this
  decision should be revisited. Chart migration is a small effort at
  that point since the manifest structure is already clean.