<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fly } from 'svelte/transition';
	import { primaryLinks, segmentConfigs, type SegmentName } from '../navigation';
	import BlissSocialLinks from './BlissSocialLinks.svelte';

	interface Props {
		segment?: SegmentName;
		currentPath?: string;
		segmentPanel?: Snippet<[{ close: () => void }]>;
	}

	let { segment = 'home', currentPath = '/', segmentPanel }: Props = $props();

	let isSegmentOpen = $state(false);
	let isSiteNavOpen = $state(false);

	let segmentTitle = $derived(
		segment === 'home' ? 'Segment' : (segmentConfigs[segment]?.title ?? 'Segment')
	);
	let segmentLinks = $derived(segment === 'home' ? [] : (segmentConfigs[segment]?.links ?? []));

	function toggleSegment() {
		isSiteNavOpen = false;
		isSegmentOpen = !isSegmentOpen;
	}

	function toggleSiteNav() {
		isSegmentOpen = false;
		isSiteNavOpen = !isSiteNavOpen;
	}

	function closeAll() {
		isSegmentOpen = false;
		isSiteNavOpen = false;
	}

	function isPrimaryLinkActive(href: string): boolean {
		if (href.startsWith('http')) return false;
		const normalizedCurrent = currentPath.replace(/\/$/, '') || '/';
		const normalizedTarget = href.replace(/\/$/, '') || '/';
		return normalizedCurrent.startsWith(normalizedTarget);
	}

	function isSubLinkActive(href: string): boolean {
		if (href.startsWith('http') || href.startsWith('#') || href.includes('#')) return false;
		const normalizedCurrent = currentPath.replace(/\/$/, '') || '/';
		const normalizedTarget = href.replace(/\/$/, '') || '/';
		if (
			normalizedTarget === '/docs' ||
			normalizedTarget === '/blog'
		) {
			return normalizedCurrent === normalizedTarget;
		}
		return normalizedCurrent.startsWith(normalizedTarget);
	}

	function handlePointerDown(event: PointerEvent) {
		if (!isSegmentOpen && !isSiteNavOpen) return;
		const target = event.target as Node | null;
		if (!target) return;

		const capsule = document.querySelector('.bliss-mobile-capsule');
		const segmentPopover = document.getElementById('bliss-segment-popover');
		const sitePopover = document.getElementById('bliss-site-popover');

		if (
			capsule &&
			!capsule.contains(target) &&
			(!segmentPopover || !segmentPopover.contains(target)) &&
			(!sitePopover || !sitePopover.contains(target))
		) {
			closeAll();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') closeAll();
	}

	$effect(() => {
		// Close popovers whenever route changes
		currentPath;
		closeAll();
	});
</script>

<svelte:window onpointerdown={handlePointerDown} onkeydown={handleKeydown} />

<div
	class={[
		'bliss-mobile-capsule',
		`bliss-mobile-capsule--${segment}`,
		segment === 'home' && 'bliss-mobile-capsule--single'
	]
		.filter(Boolean)
		.join(' ')}
>
	{#if segment !== 'home'}
		<button
			type="button"
			class={['bliss-mobile-capsule__btn', isSegmentOpen && 'is-active']
				.filter(Boolean)
				.join(' ')}
			aria-expanded={isSegmentOpen}
			aria-controls="bliss-segment-popover"
			aria-label="Toggle {segmentTitle} options"
			onclick={toggleSegment}
		>
			{#if !isSegmentOpen}
				<svg
					class="bliss-mobile-capsule__icon"
					viewBox="0 0 20 20"
					fill="none"
					stroke="currentColor"
					stroke-width="1.6"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path d="M2.5 4.5A2.5 2.5 0 0 1 5 2h4.5v13.5H5a2.5 2.5 0 0 0-2.5 2.5V4.5z" />
					<path d="M17.5 4.5A2.5 2.5 0 0 0 15 2h-4.5v13.5H15a2.5 2.5 0 0 1 2.5 2.5V4.5z" />
				</svg>
			{:else}
				<svg
					class="bliss-mobile-capsule__icon"
					viewBox="0 0 20 20"
					fill="none"
					stroke="currentColor"
					stroke-width="1.75"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path d="M5 5l10 10M15 5L5 15" />
				</svg>
			{/if}
		</button>

		<div class="bliss-mobile-capsule__divider" aria-hidden="true"></div>
	{/if}

	<button
		type="button"
		class={['bliss-mobile-capsule__btn', isSiteNavOpen && 'is-active'].filter(Boolean).join(' ')}
		aria-expanded={isSiteNavOpen}
		aria-controls="bliss-site-popover"
		aria-label="Toggle site navigation menu"
		onclick={toggleSiteNav}
	>
		{#if !isSiteNavOpen}
			<svg
				class="bliss-mobile-capsule__icon"
				viewBox="0 0 20 20"
				fill="none"
				stroke="currentColor"
				stroke-width="1.75"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path d="M3 5h14M3 10h14M3 15h14" />
			</svg>
		{:else}
			<svg
				class="bliss-mobile-capsule__icon"
				viewBox="0 0 20 20"
				fill="none"
				stroke="currentColor"
				stroke-width="1.75"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path d="M5 5l10 10M15 5L5 15" />
			</svg>
		{/if}
	</button>
</div>

{#if isSegmentOpen}
	<div
		id="bliss-segment-popover"
		class="bliss-mobile-popover bliss-mobile-popover--segment bliss-mobile-popover--{segment}"
		role="dialog"
		aria-label="{segmentTitle} options"
		transition:fly={{ y: 12, duration: 200 }}
	>
		{#if segmentPanel}
			{@render segmentPanel({ close: closeAll })}
		{:else}
			<div class="bliss-mobile-popover__header">
				<span class="bliss-mobile-popover__badge">{segmentTitle}</span>
			</div>
			<nav class="bliss-mobile-popover__links" aria-label="{segmentTitle} options">
				{#each segmentLinks as link (link.href)}
					<a
						href={link.href}
						class={['bliss-mobile-popover__link', isSubLinkActive(link.href) && 'is-active']
							.filter(Boolean)
							.join(' ')}
						target={link.external ? '_blank' : undefined}
						rel={link.external ? 'noreferrer' : undefined}
						onclick={closeAll}
					>
						{link.label}
					</a>
				{/each}
			</nav>
		{/if}
	</div>
{/if}

{#if isSiteNavOpen}
	<nav
		id="bliss-site-popover"
		class="bliss-mobile-popover bliss-mobile-popover--site"
		aria-label="Primary navigation"
		transition:fly={{ y: 12, duration: 200 }}
	>
		<div class="bliss-mobile-popover__header">
			<span class="bliss-mobile-popover__badge">Navigation</span>
		</div>
		<div class="bliss-mobile-popover__grid">
			{#each primaryLinks as link (link.href)}
				<a
					href={link.href}
					class={['bliss-mobile-popover__link', isPrimaryLinkActive(link.href) && 'is-active']
						.filter(Boolean)
						.join(' ')}
					target={link.external ? '_blank' : undefined}
					rel={link.external ? 'noreferrer' : undefined}
					onclick={closeAll}
				>
					{link.label}
				</a>
			{/each}
		</div>

		<BlissSocialLinks class="bliss-mobile-popover__socials" onnavigate={closeAll} />
	</nav>
{/if}
