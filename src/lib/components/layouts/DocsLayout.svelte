<script lang="ts">
	import type { Snippet } from 'svelte';
	import { tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import { copyCode } from '../../actions/copyCode';
	import BlissSocialLinks from '../BlissSocialLinks.svelte';
	import { docsNavigation, flattenNavigation, primaryLinks } from '../../navigation';

	export interface DocHeader {
		level: number;
		title: string;
		slug: string;
	}

	interface Props {
		title: string;
		htmlContent?: string;
		headers?: DocHeader[];
		currentPath?: string;
		children?: Snippet;
	}

	let {
		title,
		htmlContent = '',
		headers = [],
		currentPath = '/docs/language',
		children
	}: Props = $props();

	let outlineProgress = $state({ top: 0, height: 0 });
	let mobilePanel = $state<'menu' | 'outline' | null>(null);
	let isSiteNavOpen = $state(false);
	let activeSlug = $state('');

	let isClickScrolling = false;
	let clickScrollTimer: ReturnType<typeof setTimeout> | null = null;

	function normalizedLink(link: string): string {
		return link.replace(/\/$/, '') || '/';
	}

	let normalizedCurrent = $derived(normalizedLink(currentPath));

	function isActive(link?: string): boolean {
		return !!link && normalizedLink(link) === normalizedCurrent;
	}

	function isPrimaryLinkActive(href: string): boolean {
		if (href.startsWith('http')) return false;
		return normalizedCurrent.startsWith(normalizedLink(href));
	}

	let activeGroup = $derived(
		docsNavigation.find((group) => flattenNavigation([group]).some((item) => isActive(item.link))) ??
			docsNavigation[0]
	);

	let groups = $derived(activeGroup ? [activeGroup] : []);
	let links = $derived(flattenNavigation(groups));
	let currentIndex = $derived(links.findIndex((item) => item.link && isActive(item.link)));
	let previous = $derived(currentIndex > 0 ? links[currentIndex - 1] : undefined);
	let next = $derived(
		currentIndex >= 0 && currentIndex < links.length - 1 ? links[currentIndex + 1] : undefined
	);
	let sectionLabel = $derived(activeGroup?.label ?? 'Documentation');
	let filteredHeaders = $derived(headers.filter((h) => h.level >= 2 && h.level <= 4));

	function toggleReaderTools() {
		isSiteNavOpen = false;
		mobilePanel = mobilePanel ? null : filteredHeaders.length ? 'outline' : 'menu';
	}

	function toggleSiteNav() {
		mobilePanel = null;
		isSiteNavOpen = !isSiteNavOpen;
	}

	function onOutlineClick(event: MouseEvent, slug: string) {
		event.preventDefault();
		activeSlug = slug;
		mobilePanel = null;
		isClickScrolling = true;

		const target = document.getElementById(slug);
		if (target) {
			target.scrollIntoView({ behavior: 'smooth', block: 'start' });
			history.pushState(null, '', `#${slug}`);
		}

		if (clickScrollTimer) clearTimeout(clickScrollTimer);
		clickScrollTimer = setTimeout(() => {
			isClickScrolling = false;
			updateActiveHeading();
		}, 800);
	}

	function updateOutlineProgress() {
		if (typeof document === 'undefined') return;
		const content = document.querySelector<HTMLElement>('.docs-content');
		if (!content) return;

		const articleTop = content.getBoundingClientRect().top + window.scrollY;
		const articleBottom = articleTop + content.offsetHeight;
		const articleHeight = articleBottom - articleTop;

		if (articleHeight <= 0) return;

		const viewportTop = window.scrollY + 64;
		const viewportBottom = window.scrollY + window.innerHeight;
		const visibleTop = Math.min(Math.max(viewportTop, articleTop), articleBottom);
		const visibleBottom = Math.min(Math.max(viewportBottom, articleTop), articleBottom);

		outlineProgress = {
			top: ((visibleTop - articleTop) / articleHeight) * 100,
			height: Math.max(0, ((visibleBottom - visibleTop) / articleHeight) * 100)
		};
	}

	function updateActiveHeading() {
		if (isClickScrolling || typeof document === 'undefined') return;
		if (!filteredHeaders.length) {
			activeSlug = '';
			return;
		}

		const scrollY = window.scrollY;
		const isMobile = window.innerWidth <= 1100;
		const topThreshold = isMobile ? 100 : 96;

		const headingList: { slug: string; top: number }[] = [];
		for (const header of filteredHeaders) {
			const el = document.getElementById(header.slug);
			if (el) {
				headingList.push({
					slug: header.slug,
					top: el.getBoundingClientRect().top
				});
			}
		}

		if (!headingList.length) return;

		if (scrollY < 60) {
			activeSlug = headingList[0].slug;
			return;
		}

		let current = headingList[0].slug;
		for (let i = 0; i < headingList.length; i++) {
			const item = headingList[i];
			if (item.top <= topThreshold) {
				current = item.slug;
			} else {
				break;
			}
		}

		const windowHeight = window.innerHeight;
		const documentHeight = document.documentElement.scrollHeight;
		if (scrollY + windowHeight >= documentHeight - 15) {
			const lastItem = headingList[headingList.length - 1];
			if (lastItem.top < windowHeight) {
				current = lastItem.slug;
			}
		}

		activeSlug = current;
	}

	function onScroll() {
		updateOutlineProgress();
		updateActiveHeading();
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			mobilePanel = null;
			isSiteNavOpen = false;
		}
	}

	function onDocumentClick(event: PointerEvent) {
		if (!mobilePanel && !isSiteNavOpen) return;
		const target = event.target as Node | null;
		if (!target) return;

		const capsule = document.querySelector('.docs-mobile-capsule');
		const readerPopover = document.getElementById('docs-reader-popover');
		const sitePopover = document.getElementById('docs-site-popover');

		const isInsideCapsule = capsule?.contains(target);
		const isInsideReader = readerPopover?.contains(target);
		const isInsideSite = sitePopover?.contains(target);

		if (!isInsideCapsule && !isInsideReader && !isInsideSite) {
			mobilePanel = null;
			isSiteNavOpen = false;
		}
	}

	$effect(() => {
		currentPath;
		filteredHeaders;
		mobilePanel = null;
		isSiteNavOpen = false;

		if (typeof document !== 'undefined') {
			document.body.classList.add('has-docs-capsule');
		}
		tick().then(() => {
			onScroll();
		});

		return () => {
			if (typeof document !== 'undefined') {
				document.body.classList.remove('has-docs-capsule');
			}
			if (clickScrollTimer) clearTimeout(clickScrollTimer);
		};
	});
</script>

<svelte:window
	onscroll={onScroll}
	onresize={onScroll}
	onkeydown={onKeydown}
	onpointerdown={onDocumentClick}
/>

<div class="docs-page">
	<aside class="docs-sidebar">
		{#each groups as group (group.label)}
			<div class="docs-sidebar__group">
				<div class="docs-sidebar__label">{group.label}</div>

				<nav class="docs-sidebar__nav" aria-label="Documentation">
					{#each group.items as item (item.text)}
						{#if item.link}
							<a
								href={item.link}
								class={['docs-sidebar__link', isActive(item.link) && 'is-active']
									.filter(Boolean)
									.join(' ')}
							>
								{item.text}
							</a>
						{/if}
					{/each}
				</nav>
			</div>
		{/each}
	</aside>

	<main class="docs-article">
		<nav class="docs-breadcrumb" aria-label="Breadcrumb">
			<a href="/docs/">Docs</a>
			<span aria-hidden="true">/</span>
			<a href={activeGroup.link}>{sectionLabel}</a>
			<span aria-hidden="true">/</span>
			<span aria-current="page">{title}</span>
		</nav>

		<article class="docs-content" use:copyCode>
			{#if children}
				{@render children()}
			{:else}
				{@html htmlContent}
			{/if}
		</article>

		{#if previous || next}
			<nav class="docs-pagination" aria-label="Documentation pagination">
				{#if previous}
					<a
						href={previous.link}
						class="docs-pagination__item docs-pagination__item--previous"
					>
						<span class="docs-pagination__direction">Previous</span>
						<span class="docs-pagination__title">{previous.text}</span>
					</a>
				{/if}

				{#if next}
					<a href={next.link} class="docs-pagination__item docs-pagination__item--next">
						<span class="docs-pagination__direction">Next</span>
						<span class="docs-pagination__title">{next.text}</span>
					</a>
				{/if}
			</nav>
		{/if}
	</main>

	{#if filteredHeaders.length}
		<aside class="docs-outline">
			<div class="docs-outline__label">On this page</div>
			<nav
				class="docs-outline__nav"
				aria-label="On this page"
				style:--docs-outline-progress-top="{outlineProgress.top}%"
				style:--docs-outline-progress-height="{outlineProgress.height}%"
			>
				<span class="docs-outline__progress" aria-hidden="true"></span>
				{#each filteredHeaders as header (header.slug)}
					<a
						href="#{header.slug}"
						class={[
							'docs-outline__link',
							`level-${header.level}`,
							header.slug === activeSlug && 'is-active'
						]
							.filter(Boolean)
							.join(' ')}
						onclick={(e) => onOutlineClick(e, header.slug)}
					>
						{header.title}
					</a>
				{/each}
			</nav>
		</aside>
	{/if}

	<!-- Merged Mobile Pill Capsule (Docs Reader Tools + Site Navigation) -->
	<div class="docs-mobile-capsule">
		<button
			type="button"
			class={['docs-mobile-capsule__btn', !!mobilePanel && 'is-active'].filter(Boolean).join(' ')}
			aria-expanded={!!mobilePanel}
			aria-controls="docs-reader-popover"
			aria-label="Toggle reader tools"
			onclick={toggleReaderTools}
		>
			{#if !mobilePanel}
				<svg
					class="docs-mobile-capsule__icon"
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
					class="docs-mobile-capsule__icon"
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

		<div class="docs-mobile-capsule__divider" aria-hidden="true"></div>

		<button
			type="button"
			class={['docs-mobile-capsule__btn', 'docs-mobile-capsule__btn--site', isSiteNavOpen && 'is-active']
				.filter(Boolean)
				.join(' ')}
			aria-expanded={isSiteNavOpen}
			aria-controls="docs-site-popover"
			aria-label="Toggle site navigation menu"
			onclick={toggleSiteNav}
		>
			{#if !isSiteNavOpen}
				<svg
					class="docs-mobile-capsule__icon"
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
					class="docs-mobile-capsule__icon"
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

	{#if mobilePanel}
		<div
			id="docs-reader-popover"
			class="docs-reader-popover"
			role="dialog"
			aria-label="Reader tools"
			transition:fly={{ y: 12, duration: 200 }}
		>
			<div class="docs-reader-popover__tabs">
				<button
					type="button"
					class={['docs-reader-popover__tab', mobilePanel === 'menu' && 'is-active']
						.filter(Boolean)
						.join(' ')}
					onclick={() => (mobilePanel = 'menu')}
				>
					Menu
				</button>
				<button
					type="button"
					class={['docs-reader-popover__tab', mobilePanel === 'outline' && 'is-active']
						.filter(Boolean)
						.join(' ')}
					onclick={() => (mobilePanel = 'outline')}
				>
					On this page
				</button>
			</div>

			<div class="docs-reader-popover__content">
				{#if mobilePanel === 'menu'}
					<nav class="docs-reader-popover__scroll" aria-label="Documentation">
						{#each docsNavigation as groupItem (groupItem.label)}
							<div class="docs-reader-popover__group">
								<div class="docs-reader-popover__label">{groupItem.label}</div>
								{#each groupItem.items as item (item.text)}
									<a
										href={item.link}
										class={item.link && isActive(item.link) ? 'is-active' : undefined}
										onclick={() => (mobilePanel = null)}
									>
										{item.text}
									</a>
								{/each}
							</div>
						{/each}
					</nav>
				{:else}
					<nav class="docs-reader-popover__scroll" aria-label="On this page">
						{#each filteredHeaders as header (header.slug)}
							<a
								href="#{header.slug}"
								class={[`level-${header.level}`, header.slug === activeSlug && 'is-active']
									.filter(Boolean)
									.join(' ')}
								onclick={(e) => onOutlineClick(e, header.slug)}
							>
								{header.title}
							</a>
						{/each}
						{#if !filteredHeaders.length}
							<span class="docs-reader-popover__empty">No sections on this page.</span>
						{/if}
					</nav>
				{/if}
			</div>
		</div>
	{/if}

	{#if isSiteNavOpen}
		<nav
			id="docs-site-popover"
			class="bliss-mobile-popover bliss-mobile-popover--site docs-site-popover"
			aria-label="Primary navigation"
			transition:fly={{ y: 12, duration: 200 }}
		>
			<div class="bliss-mobile-popover__header">
				<span class="bliss-mobile-popover__badge">Navigation</span>
			</div>
			<div class="bliss-mobile-popover__grid">
				{#each primaryLinks as item (item.href)}
					<a
						href={item.href}
						class={['bliss-mobile-popover__link', isPrimaryLinkActive(item.href) && 'is-active']
							.filter(Boolean)
							.join(' ')}
						target={item.external ? '_blank' : undefined}
						rel={item.external ? 'noopener noreferrer' : undefined}
						onclick={() => (isSiteNavOpen = false)}
					>
						{item.label}
					</a>
				{/each}
			</div>

			<BlissSocialLinks
				class="bliss-mobile-popover__socials"
				onnavigate={() => (isSiteNavOpen = false)}
			/>
		</nav>
	{/if}
</div>
