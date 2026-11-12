<script lang="ts">
	import { page } from '$app/state';
	import NotFoundLayout from '#lib/components/layouts/NotFoundLayout.svelte';
	import SeoHead from '#lib/components/SeoHead.svelte';
</script>

<SeoHead
	title="404 Page Not Found | Bliss"
	description="The requested Bliss documentation or project page could not be found."
	noindex={true}
	nofollow={true}
/>

<NotFoundLayout currentPath={page.url.pathname} />
