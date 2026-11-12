<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import RouteProgress from '#lib/components/RouteProgress.svelte';

	const { Story } = defineMeta({
		title: 'Bliss/Chrome/RouteProgress',
		component: RouteProgress,
		tags: ['autodocs']
	});
</script>

<Story name="Active" args={{ isNavigating: true }} />
<Story name="Idle" args={{ isNavigating: false }} />
