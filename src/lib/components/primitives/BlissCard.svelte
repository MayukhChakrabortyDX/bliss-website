<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		href?: string;
		title?: string;
		description?: string;
		actionText?: string;
		variant?: 'violet' | 'blue' | 'emerald' | 'amber';
		cardClass?: string;
		external?: boolean;
		art?: Snippet;
		meta?: Snippet;
		titleSlot?: Snippet;
		descriptionSlot?: Snippet;
		actions?: Snippet;
		footer?: Snippet;
		children?: Snippet;
	}

	let {
		href = undefined,
		title = '',
		description = '',
		actionText = '',
		variant = undefined,
		cardClass = '',
		external = false,
		art,
		meta,
		titleSlot,
		descriptionSlot,
		actions,
		footer,
		children
	}: Props = $props();

	let classes = $derived(
		['bliss-card', cardClass, variant ? `bliss-card--${variant}` : '']
			.filter(Boolean)
			.join(' ')
	);
</script>

{#snippet cardInner()}
	{@render art?.()}
	<div class="bliss-card__content">
		{@render meta?.()}

		{#if titleSlot}
			{@render titleSlot()}
		{:else if title}
			<h3>{title}</h3>
		{/if}

		{#if descriptionSlot}
			{@render descriptionSlot()}
		{:else if description}
			<p>{description}</p>
		{/if}

		{@render children?.()}

		{#if actions}
			{@render actions()}
		{:else if actionText}
			<span class="bliss-card__link">
				{actionText}
			</span>
		{/if}

		{@render footer?.()}
	</div>
{/snippet}

{#if href}
	<a
		{href}
		target={external ? '_blank' : undefined}
		rel={external ? 'noreferrer' : undefined}
		class={classes}
	>
		{@render cardInner()}
	</a>
{:else}
	<article class={classes}>
		{@render cardInner()}
	</article>
{/if}
