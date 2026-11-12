<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import BlissNav from '#lib/components/BlissNav.svelte';

	const { Story } = defineMeta({
		title: 'Bliss/Chrome/BlissNav',
		component: BlissNav,
		tags: ['autodocs'],
		parameters: {
			layout: 'fullscreen'
		}
	});
</script>

<Story name="Marketing" args={{ isMarketing: true, currentPath: '/' }} />
<Story name="Docs Segment" args={{ isMarketing: false, currentPath: '/docs/language' }} />
