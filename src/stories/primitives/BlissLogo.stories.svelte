<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import BlissLogo from '#lib/components/primitives/BlissLogo.svelte';

	const { Story } = defineMeta({
		title: 'Bliss/Primitives/BlissLogo',
		component: BlissLogo,
		tags: ['autodocs']
	});
</script>

<Story name="Default">
	<div class="bliss-nav__logo">
		<BlissLogo />
	</div>
</Story>
