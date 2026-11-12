<script lang="ts">
	import BlissNav from '../BlissNav.svelte';
	import BlissFooter from '../BlissFooter.svelte';

	interface Props {
		currentPath?: string;
	}

	let { currentPath = '/404' }: Props = $props();
</script>

<BlissNav {currentPath} />

<main class="not-found">
	<div class="not-found__code">404 / NOT FOUND</div>
	<h1>This page went<br /><span>somewhere else.</span></h1>
	<p>The address is valid enough to visit, but there is no Bliss page here yet.</p>
	<div class="not-found__actions">
		<a href="/" class="not-found__primary">Return to Bliss <span aria-hidden="true">↗</span></a>
		<a href="/docs/" class="not-found__secondary">Browse the docs</a>
	</div>
</main>

<BlissFooter />
