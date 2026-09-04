# ADR-0001. Record architecture decisions

- **Status:** accepted
- **Date:** 2026-09-04

## Context

The project starts from scratch and nearly every significant decision is still ahead. Six months
on, the reason behind a choice is forgotten, and the choice is either re-argued for no reason or
left untouched out of fear.

## Decision

Every decision that is expensive to reverse — database, ORM, deployment shape, payment provider,
authentication model, search engine — gets a short note in `docs/decisions/` following the same
template: context → decision → consequences. Numbering is sequential and a note is never rewritten;
a superseded ADR gets the status "superseded by ADR-XXXX".

Small decisions like file naming do not belong here — they belong in `CLAUDE.md`.

## Consequences

An agent and a new developer see not just the "how" but the "why", and stop redoing a deliberate
choice out of habit.
