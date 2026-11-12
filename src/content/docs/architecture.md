---
title: Compiler Architecture
seoTitle: Bliss Compiler Architecture — Front End, BIR & LLVM Pipeline
description: The major stages of the Bliss compiler.
seoDescription: Overview of the Bliss compiler architecture, from span-based lexical analysis and progressive parsing to Typed BIR lowering and LLVM native code generation.
keywords: Bliss compiler architecture, compiler pipeline, lexer, parser, Typed BIR, LLVM backend
---

# Compiler Architecture

The compiler is organized around a sequence of explicit transformations.

## Front end

The front end is responsible for turning source text into structured compiler representations.

## Intermediate representations

As the compiler grows, intermediate representations will provide stable boundaries between parsing, semantic analysis, and later code generation.

## Future stages

Code generation, optimization, diagnostics, and platform backends will be documented here as they become concrete.
