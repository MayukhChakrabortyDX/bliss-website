---
layout: blog-post
title: Bliss for Embedded & IoT Devices
seoTitle: Bliss for Embedded & IoT Devices — Deterministic Systems Programming
description: Why explicit allocators, fixed-width types, and zero tracing GC make Bliss suited for microcontrollers and IoT hardware.
seoDescription: Explore how Bliss targets embedded systems and IoT devices with deterministic memory management, fixed-width numeric types, and zero runtime overhead.
keywords: Bliss embedded, IoT programming language, no GC systems language, explicit allocators embedded
date: November 2026
author: Bliss
category: Use cases
---

# Bliss for Embedded & IoT Devices

Embedded firmware and IoT devices operate under tight constraints: limited RAM, strict timing budgets, and hardware that cannot afford unpredictable garbage-collection pauses or bloated runtimes.

## No hidden runtime or tracing GC

Many modern languages rely on a background runtime or tracing garbage collector to manage memory. On a microcontroller or battery-powered sensor node, that overhead translates directly into extra flash usage, higher power draw, and jitter when a collection cycle triggers.

Bliss is designed around **zero hidden runtime**. Programs compile directly without a tracing garbage collector, so CPU cycles and memory stay under your explicit control.

## Explicit allocators for constrained memory

In embedded code, *where* memory lives matters as much as *how much* you allocate. Bliss makes allocation strategy explicit in the language via `allocator` blocks and `new<T>` / `free<T>` syntax:

- **Fixed-size arena or pool allocators** for packet buffers and sensor frames.
- **No accidental global heap allocations** hidden behind ordinary expressions.
- **Clear ownership boundaries** between memory layout (`data`) and behavior (`action`).

## Fixed-width primitives by default

Hardware registers and wire protocols require exact bit widths. Bliss provides explicit fixed-width numeric types (`u8`, `u16`, `u32`, `u64`, and signed counterparts) alongside structured layouts so your data representations match the hardware directly.
