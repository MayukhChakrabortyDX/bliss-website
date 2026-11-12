<script lang="ts">
	import { page } from '$app/state';
	import type { PageProps } from './$types';
	import {
		HomePage,
		SeoHead,
		SITE_DESCRIPTION,
		buildOrganizationJsonLd,
		buildSoftwareJsonLd,
		buildWebsiteJsonLd,
		resolveSiteOrigin
	} from '#lib';

	let { data }: PageProps = $props();

	let origin = $derived(resolveSiteOrigin(page.url));
	let jsonLd = $derived([
		buildOrganizationJsonLd(origin),
		buildWebsiteJsonLd(origin),
		buildSoftwareJsonLd(origin)
	]);
</script>

<SeoHead
	title="Bliss — Systems Programming Language | Native Control & Zero Runtime Overhead"
	description={SITE_DESCRIPTION}
	keywords="Bliss programming language, systems programming language, lexical ownership, algebraic types, LLVM compiler, Typed BIR, progressive error recovery, memory safety without GC"
	canonicalPath="/"
	{jsonLd}
/>

<HomePage downloads={data.downloads} releaseTag={data.releaseTag} />
