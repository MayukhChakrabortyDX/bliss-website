<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import DocsIndexLayout from '#lib/components/layouts/DocsIndexLayout.svelte';

	const { Story } = defineMeta({
		title: 'Bliss/Layouts/DocsIndexLayout',
		component: DocsIndexLayout,
		tags: ['autodocs'],
		parameters: {
			layout: 'fullscreen'
		}
	});
</script>

<Story name="Default" />
