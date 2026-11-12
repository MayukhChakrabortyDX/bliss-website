<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import BlissModal from '#lib/components/primitives/BlissModal.svelte';
	import BlissButton from '#lib/components/primitives/BlissButton.svelte';

	const { Story } = defineMeta({
		title: 'Bliss/Primitives/BlissModal',
		component: BlissModal,
		tags: ['autodocs']
	});
</script>

<script lang="ts">
	let isOpen = $state(false);
</script>

<Story name="Interactive Modal">
	<BlissButton variant="primary" onclick={() => (isOpen = true)}>Open Modal</BlissButton>
	<BlissModal
		open={isOpen}
		eyebrow="Bliss Preview"
		title="Progressive Error Recovery"
		onclose={() => (isOpen = false)}
	>
		<div class="bliss-code bliss-code--panel">
			Parser synchronization preserves downstream AST nodes across bounded recovery regions.
		</div>
		{#snippet footer()}
			<span>Press Escape or click backdrop to close</span>
			<button type="button" onclick={() => (isOpen = false)}>Close</button>
		{/snippet}
	</BlissModal>
</Story>
