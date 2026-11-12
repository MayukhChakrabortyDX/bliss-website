<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import BlogLayout from '#lib/components/layouts/BlogLayout.svelte';

	const { Story } = defineMeta({
		title: 'Bliss/Layouts/BlogLayout',
		component: BlogLayout,
		tags: ['autodocs'],
		parameters: {
			layout: 'fullscreen'
		}
	});
</script>

<Story name="Index" args={{ isIndex: true }} />

<Story
	name="Article"
	args={{
		isIndex: false,
		title: 'Why Bliss exists',
		description: 'The questions behind building another systems programming language from first principles.',
		category: 'Language design',
		date: 'September 2026',
		author: 'Bliss',
		topic: 'blog-principles',
		variant: 'violet',
		htmlContent: `
			<p>Bliss started with a simple question: what would systems programming look like if we were willing to reconsider the assumptions underneath it?</p>
			<h2>The familiar path</h2>
			<p>Systems languages have accumulated powerful conventions around memory, ownership, syntax, and program structure.</p>
		`
	}}
/>
