<script lang="ts">
	import { primaryLinks } from '../navigation';
	import BlissLogo from './primitives/BlissLogo.svelte';
	import BlissSocialLinks from './BlissSocialLinks.svelte';

	interface Props {
		isMarketing?: boolean;
		currentPath?: string;
	}

	let { isMarketing = false, currentPath = '/' }: Props = $props();
	let isScrolled = $state(false);

	function isLinkActive(href: string): boolean {
		if (href.startsWith('http')) return false;
		const normalizedCurrent = currentPath.replace(/\/$/, '') || '/';
		const normalizedTarget = href.replace(/\/$/, '') || '/';
		return normalizedCurrent.startsWith(normalizedTarget);
	}

	function updateScrollState() {
		if (typeof window !== 'undefined') {
			isScrolled = window.scrollY > 8;
		}
	}

	$effect(() => {
		updateScrollState();
	});
</script>

<svelte:window onscroll={updateScrollState} />

<header
	class={[
		'bliss-nav',
		(isScrolled || !isMarketing) && 'is-scrolled',
		isMarketing && 'is-marketing'
	]
		.filter(Boolean)
		.join(' ')}
>
	<div class="bliss-nav__inner">
		<a href="/" class="bliss-nav__brand" aria-label="Bliss home">
			<span class="bliss-nav__logo" aria-hidden="true">
				<BlissLogo />
			</span>
			<span class="bliss-nav__name">bliss</span>
		</a>

		<nav class="bliss-nav__links" aria-label="Main site navigation">
			{#each primaryLinks as link (link.href)}
				<a
					href={link.href}
					class={['bliss-nav__link', isLinkActive(link.href) && 'is-active']
						.filter(Boolean)
						.join(' ')}
					target={link.external ? '_blank' : undefined}
					rel={link.external ? 'noopener noreferrer' : undefined}
				>
					{link.label}
				</a>
			{/each}

			<BlissSocialLinks class="bliss-nav__socials" />
		</nav>
	</div>
</header>
