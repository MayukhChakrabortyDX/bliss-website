<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import BlissPageHeader from '#lib/components/primitives/BlissPageHeader.svelte';

	const { Story } = defineMeta({
		title: 'Bliss/Primitives/BlissPageHeader',
		component: BlissPageHeader,
		tags: ['autodocs']
	});
</script>

<Story
	name="Docs Header"
	args={{
		eyebrow: 'Bliss / Docs',
		title: 'Build from first principles.',
		description: 'Explore the evolving Bliss language, compiler architecture, and formal specifications.',
		variant: 'violet',
		pill: true
	}}
/>
