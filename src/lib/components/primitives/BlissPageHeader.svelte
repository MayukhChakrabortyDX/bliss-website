<script lang="ts">
	import type { Snippet } from 'svelte';
	import BlissEyebrow from './BlissEyebrow.svelte';

	interface Props {
		eyebrow?: string;
		title?: string;
		description?: string;
		variant?: 'violet' | 'blue' | 'emerald' | 'amber' | 'rose' | 'neutral';
		pill?: boolean;
		dot?: boolean;
		eyebrowSlot?: Snippet;
		titleSlot?: Snippet;
		descriptionSlot?: Snippet;
		meta?: Snippet;
		children?: Snippet;
	}

	let {
		eyebrow = '',
		title = '',
		description = '',
		variant = undefined,
		pill = false,
		dot = false,
		eyebrowSlot,
		titleSlot,
		descriptionSlot,
		meta,
		children
	}: Props = $props();
</script>

<header class="bliss-header">
	{#if eyebrowSlot}
		{@render eyebrowSlot()}
	{:else if eyebrow}
		<BlissEyebrow {variant} {pill} {dot} text={eyebrow} />
	{/if}

	{#if titleSlot}
		{@render titleSlot()}
	{:else if title}
		<h1>{title}</h1>
	{/if}

	{#if descriptionSlot}
		{@render descriptionSlot()}
	{:else if description}
		<p>{description}</p>
	{/if}

	{@render meta?.()}
	{@render children?.()}
</header>
