---
title: Bliss Compiler
seoTitle: Bliss Compiler Overview — Toolchain & Design Philosophy
description: Documentation for the Bliss compiler and its architecture.
seoDescription: Learn how the Bliss compiler toolchain transforms source files into structured ASTs, supports progressive diagnostics, and informs Bliss language design.
keywords: Bliss compiler, Bliss toolchain, AST construction, compiler infrastructure, systems compiler
---

# Bliss Compiler

The Bliss compiler is being built together with the language so implementation constraints can influence the language design early.

## Current stage

The compiler currently focuses on transforming Bliss source into an abstract syntax tree and building the infrastructure required for later compilation stages.

## Design principle

Compiler infrastructure is treated as part of the language design rather than a separate implementation detail.
