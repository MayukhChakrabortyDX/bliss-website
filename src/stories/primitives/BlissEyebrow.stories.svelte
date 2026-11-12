<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import BlissEyebrow from '#lib/components/primitives/BlissEyebrow.svelte';

	const { Story } = defineMeta({
		title: 'Bliss/Primitives/BlissEyebrow',
		component: BlissEyebrow,
		tags: ['autodocs'],
		argTypes: {
			variant: {
				control: { type: 'select' },
				options: ['violet', 'blue', 'emerald', 'amber', 'rose', 'neutral']
			}
		}
	});
</script>

<Story name="Violet Pill" args={{ text: 'Bliss / Docs', variant: 'violet', pill: true }} />
<Story name="Blue Pill" args={{ text: 'Bliss / Blog', variant: 'blue', pill: true }} />
<Story name="Rose Live Dot" args={{ text: 'Bliss / Status', variant: 'rose', pill: true, dot: true }} />
