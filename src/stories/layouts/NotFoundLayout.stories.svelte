<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import NotFoundLayout from '#lib/components/layouts/NotFoundLayout.svelte';

	const { Story } = defineMeta({
		title: 'Bliss/Layouts/NotFoundLayout',
		component: NotFoundLayout,
		tags: ['autodocs'],
		parameters: {
			layout: 'fullscreen'
		}
	});
</script>

<Story name="Default" />
