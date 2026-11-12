<script lang="ts">
	import './layout.css';
	import { navigating, page } from '$app/state';
	import type { LayoutProps } from './$types';
	import BlissFooter from '#lib/components/BlissFooter.svelte';
	import BlissMobileCapsule from '#lib/components/BlissMobileCapsule.svelte';
	import BlissNav from '#lib/components/BlissNav.svelte';
	import BlissScrollbar from '#lib/components/BlissScrollbar.svelte';
	import BlissSubNav from '#lib/components/BlissSubNav.svelte';
	import RouteProgress from '#lib/components/RouteProgress.svelte';
	import SiteAmbient from '#lib/components/SiteAmbient.svelte';
	import type { SegmentName } from '#lib';

	let { children }: LayoutProps = $props();

	let currentPath = $derived(page.url.pathname);
	let isNotFound = $derived(Boolean(page.error));
	let isMarketing = $derived(currentPath === '/');
	let isBlog = $derived(currentPath.startsWith('/blog'));
	let isDocsIndex = $derived(currentPath === '/docs' || currentPath === '/docs/');

	let currentSegment = $derived<SegmentName>(
		isMarketing ? 'home' : isBlog ? 'blog' : 'docs'
	);
</script>

<RouteProgress isNavigating={Boolean(navigating.to)} />
<BlissScrollbar {currentPath} />

{#if isNotFound}
	{@render children()}
{:else}
	<BlissNav {isMarketing} {currentPath} />

	{#if currentSegment !== 'home'}
		<BlissSubNav segment={currentSegment} {currentPath} />
	{/if}

	<div class="bliss-site">
		{#if isMarketing}
			<SiteAmbient />
		{:else}
			<div class="site-header site-header--with-subnav" aria-hidden="true"></div>
		{/if}

		{@render children()}

		<BlissFooter />
	</div>

	{#if isMarketing || isBlog || isDocsIndex}
		<BlissMobileCapsule segment={currentSegment} {currentPath} />
	{/if}
{/if}
