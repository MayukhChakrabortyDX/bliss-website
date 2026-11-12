<script lang="ts">
	import { docsNavigation, flattenNavigation, segmentConfigs, type SegmentName } from '../navigation';

	interface Props {
		segment: Exclude<SegmentName, 'home'>;
		currentPath?: string;
	}

	let { segment, currentPath = '/' }: Props = $props();

	let meta = $derived(segmentConfigs[segment] ?? segmentConfigs.docs);

	function normalizePath(path: string): string {
		return path.replace(/\/$/, '') || '/';
	}

	let activeDocsGroupLink = $derived(
		segment === 'docs'
			? docsNavigation.find((group) =>
					flattenNavigation([group]).some(
						(item) => item.link && normalizePath(item.link) === normalizePath(currentPath)
					)
				)?.link
			: undefined
	);

	function isLinkActive(href: string): boolean {
		if (href.startsWith('http') || href.startsWith('#') || href.includes('#')) return false;
		const normalizedCurrent = normalizePath(currentPath);
		const normalizedTarget = normalizePath(href);
		if (segment === 'docs' && activeDocsGroupLink && normalizedTarget !== '/docs') {
			return normalizePath(activeDocsGroupLink) === normalizedTarget;
		}
		if (
			normalizedTarget === '/docs' ||
			normalizedTarget === '/blog'
		) {
			return normalizedCurrent === normalizedTarget;
		}
		return normalizedCurrent.startsWith(normalizedTarget);
	}
</script>

<div
	class="bliss-subnav bliss-subnav--{segment}"
	role="navigation"
	aria-label="{meta.title} sub-navigation"
>
	<div class="bliss-subnav__inner">
		<div class="bliss-subnav__badge">
			<span class="bliss-subnav__dot" aria-hidden="true"></span>
			<span class="bliss-subnav__title">{meta.title}</span>
		</div>

		<nav class="bliss-subnav__links" aria-label="{meta.title} options">
			{#each meta.links as item (item.href)}
				<a
					href={item.href}
					class={['bliss-subnav__link', isLinkActive(item.href) && 'is-active']
						.filter(Boolean)
						.join(' ')}
					target={item.external ? '_blank' : undefined}
					rel={item.external ? 'noreferrer' : undefined}
				>
					{item.label}
				</a>
			{/each}
		</nav>
	</div>
</div>
