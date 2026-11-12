<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		text?: string;
		variant?: 'violet' | 'blue' | 'emerald' | 'amber' | 'rose' | 'neutral';
		pill?: boolean;
		dot?: boolean;
		children?: Snippet;
	}

	let {
		text = '',
		variant = undefined,
		pill = false,
		dot = false,
		children
	}: Props = $props();

	let classes = $derived(
		[
			'bliss-eyebrow',
			variant ? `bliss-eyebrow--${variant}` : '',
			pill ? 'bliss-eyebrow--pill' : ''
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

<div class={classes}>
	{#if dot}
		<span class="bliss-eyebrow__dot" aria-hidden="true"></span>
	{/if}
	{#if children}
		{@render children()}
	{:else}
		{text}
	{/if}
</div>
