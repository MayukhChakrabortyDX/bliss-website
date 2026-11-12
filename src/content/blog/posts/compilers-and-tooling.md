---
layout: blog-post
title: Writing Compilers & Developer Tools in Bliss
seoTitle: Writing Compilers & Developer Tools in Bliss
description: Why Bliss's own compiler architecture, span tracking, and data-action separation are built for language tooling.
seoDescription: Discover how Bliss's design—explicit memory layouts, fixed-width spans, and resilient parsing—applies to building compilers, linters, and developer tools.
keywords: Bliss compilers, developer tools, AST memory layout, systems programming compilers
date: November 2026
author: Bliss
category: Use cases
---

# Writing Compilers & Developer Tools in Bliss

Compilers, linters, formatters, and language servers are demanding workloads. They allocate millions of small nodes, walk trees repeatedly, and need to stay responsive even when the user's code has syntax errors.

## Arena-friendly ASTs and IRs

Compiler passes naturally map to phase-scoped arenas: allocate tokens during lexing, AST nodes during parsing, and intermediate representations during lowering, then drop each arena when its phase completes. Bliss's explicit `allocator` model fits this lifecycle directly.

## Modeling nodes with Data-Action separation

In compiler engineering, keeping AST and IR structs lean improves cache locality across passes. Separating `data` definitions from `action` contracts makes it straightforward to add new analysis passes or code generators without bloating core node structures.

## Resilient diagnostics from day one

Bliss itself is developed compiler-first, with a handwritten recursive-descent parser using two-set synchronization to surface multiple diagnostics in a single pass. Those same patterns carry over directly to building formatters, static analyzers, and IDE tooling.
