<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import DocsThumbnail from '#lib/components/assets/DocsThumbnail.svelte';

	const { Story } = defineMeta({
		title: 'Bliss/Assets/DocsThumbnail',
		component: DocsThumbnail,
		tags: ['autodocs'],
		argTypes: {
			variant: {
				control: { type: 'select' },
				options: ['violet', 'blue', 'emerald', 'amber', 'rose', 'indigo', 'zinc']
			}
		}
	});
</script>

<Story name="Section Language" args={{ topic: 'section-language', variant: 'violet' }} />
<Story name="Section Compiler" args={{ topic: 'section-compiler', variant: 'blue' }} />
<Story name="Section Specifications" args={{ topic: 'section-specifications', variant: 'amber' }} />
<Story name="Syntax" args={{ topic: 'syntax', variant: 'blue' }} />
<Story name="Types" args={{ topic: 'types', variant: 'emerald' }} />
<Story name="Architecture" args={{ topic: 'architecture', variant: 'emerald' }} />
<Story name="Memory Model" args={{ topic: 'memory', variant: 'rose' }} />
