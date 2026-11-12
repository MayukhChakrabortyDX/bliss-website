<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		href?: string;
		type?: 'button' | 'submit' | 'reset';
		variant?: 'primary' | 'secondary' | 'ghost' | 'link';
		external?: boolean;
		icon?: 'arrow-right' | 'external' | 'play' | 'none';
		class?: string;
		onclick?: (event: MouseEvent) => void;
		children?: Snippet;
		iconSlot?: Snippet;
	}

	let {
		href = undefined,
		type = 'button',
		variant = 'secondary',
		external = false,
		icon = 'none',
		class: extraClass = '',
		onclick,
		children,
		iconSlot
	}: Props = $props();

	let classes = $derived(
		['bliss-button', `bliss-button--${variant}`, extraClass].filter(Boolean).join(' ')
	);
</script>

{#if href}
	<a
		{href}
		target={external ? '_blank' : undefined}
		rel={external ? 'noreferrer' : undefined}
		class={classes}
		{onclick}
	>
		{@render children?.()}
		{#if iconSlot}
			{@render iconSlot()}
		{:else if icon === 'arrow-right'}
			<span aria-hidden="true">→</span>
		{:else if icon === 'external'}
			<span aria-hidden="true">↗</span>
		{:else if icon === 'play'}
			<span aria-hidden="true">▶</span>
		{/if}
	</a>
{:else}
	<button {type} class={classes} {onclick}>
		{@render children?.()}
		{#if iconSlot}
			{@render iconSlot()}
		{:else if icon === 'arrow-right'}
			<span aria-hidden="true">→</span>
		{:else if icon === 'external'}
			<span aria-hidden="true">↗</span>
		{:else if icon === 'play'}
			<span aria-hidden="true">▶</span>
		{/if}
	</button>
{/if}
