<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade, scale } from 'svelte/transition';

	interface Props {
		open: boolean;
		eyebrow?: string;
		title?: string;
		onclose?: () => void;
		header?: Snippet;
		footer?: Snippet;
		children?: Snippet;
	}

	let {
		open,
		eyebrow = '',
		title = '',
		onclose,
		header,
		footer,
		children
	}: Props = $props();

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && open) {
			onclose?.();
		}
	}

	function handleBackdropClick(event: MouseEvent | PointerEvent) {
		if (event.target === event.currentTarget) {
			onclose?.();
		}
	}

	$effect(() => {
		if (typeof document === 'undefined') return;
		document.body.style.overflow = open ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	});
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<div
		class="paper-modal"
		role="dialog"
		aria-modal="true"
		tabindex="-1"
		onclick={handleBackdropClick}
		onpointerdown={handleBackdropClick}
		onkeydown={handleKeydown}
		transition:fade={{ duration: 180 }}
	>
		<div
			class="paper-modal__window"
			transition:scale={{ duration: 220, start: 0.95 }}
		>
			<header class="paper-modal__header">
				<div>
					{#if eyebrow}
						<span class="paper-modal__eyebrow">{eyebrow}</span>
					{/if}
					{#if title}
						<h2>{title}</h2>
					{/if}
					{@render header?.()}
				</div>
				<button
					type="button"
					class="paper-modal__close"
					aria-label="Close dialog"
					onclick={() => onclose?.()}
				>
					×
				</button>
			</header>

			<div class="paper-modal__body">
				{@render children?.()}
			</div>

			{#if footer}
				<footer class="paper-modal__footer">
					{@render footer()}
				</footer>
			{/if}
		</div>
	</div>
{/if}
