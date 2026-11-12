<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import BlissButton from '#lib/components/primitives/BlissButton.svelte';

	const { Story } = defineMeta({
		title: 'Bliss/Primitives/BlissButton',
		component: BlissButton,
		tags: ['autodocs'],
		argTypes: {
			variant: {
				control: { type: 'select' },
				options: ['primary', 'secondary', 'ghost', 'link']
			},
			icon: {
				control: { type: 'select' },
				options: ['none', 'arrow-right', 'external', 'play']
			}
		}
	});
</script>

<Story name="Primary" args={{ variant: 'primary', icon: 'arrow-right' }}>
	Explore Docs
</Story>

<Story name="Secondary" args={{ variant: 'secondary', icon: 'external', href: '/docs/' }}>
	View Compiler
</Story>

<Story name="Play" args={{ variant: 'primary', icon: 'play' }}>
	Watch Lesson
</Story>
