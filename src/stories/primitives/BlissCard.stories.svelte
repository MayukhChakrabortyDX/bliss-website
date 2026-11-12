<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import BlissCard from '#lib/components/primitives/BlissCard.svelte';

	const { Story } = defineMeta({
		title: 'Bliss/Primitives/BlissCard',
		component: BlissCard,
		tags: ['autodocs']
	});
</script>

<Story
	name="Blog Style Card"
	args={{
		href: '/blog/posts/pre-alpha-release',
		title: 'Using the Bliss CLI',
		description: 'A complete walkthrough of compiling Bliss programs from the command line.',
		actionText: 'Read article ↗',
		cardClass: 'blog-card'
	}}
/>

<Story
	name="Plain Surface Card"
	args={{
		title: 'Classifying Productions and Progressive Error Recovery',
		description:
			'A structural model for error recovery in the Bliss parser, introducing bounded, branch, extension, and until productions with progressive synchronization.'
	}}
/>
