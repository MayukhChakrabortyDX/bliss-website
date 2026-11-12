<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import BlissFooter from '#lib/components/BlissFooter.svelte';

	const { Story } = defineMeta({
		title: 'Bliss/Chrome/BlissFooter',
		component: BlissFooter,
		tags: ['autodocs'],
		parameters: {
			layout: 'fullscreen'
		}
	});
</script>

<Story name="Default" />
