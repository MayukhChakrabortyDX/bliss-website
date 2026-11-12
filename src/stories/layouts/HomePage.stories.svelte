<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import HomePage from '#lib/components/layouts/HomePage.svelte';

	const { Story } = defineMeta({
		title: 'Bliss/Layouts/HomePage',
		component: HomePage,
		tags: ['autodocs'],
		parameters: {
			layout: 'fullscreen'
		}
	});
</script>

<Story name="Default" />
