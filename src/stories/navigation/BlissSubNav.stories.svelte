<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import BlissSubNav from '#lib/components/BlissSubNav.svelte';

	const { Story } = defineMeta({
		title: 'Bliss/Chrome/BlissSubNav',
		component: BlissSubNav,
		tags: ['autodocs'],
		parameters: {
			layout: 'fullscreen'
		}
	});
</script>

<Story name="Docs" args={{ segment: 'docs', currentPath: '/docs/language' }} />
<Story name="Blog" args={{ segment: 'blog', currentPath: '/blog/' }} />
