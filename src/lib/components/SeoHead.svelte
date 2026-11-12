<script lang="ts">
	import { page } from '$app/state';
	import {
		DEFAULT_OG_IMAGE_PATH,
		SITE_NAME,
		buildAbsoluteUrl,
		buildCanonicalUrl,
		resolveSiteOrigin,
		serializeJsonLd
	} from '../seo';

	interface Props {
		title: string;
		description: string;
		keywords?: string;
		canonicalPath?: string;
		type?: 'website' | 'article';
		noindex?: boolean;
		nofollow?: boolean;
		author?: string;
		publishedTime?: string;
		modifiedTime?: string;
		section?: string;
		image?: string;
		imageAlt?: string;
		jsonLd?: Record<string, unknown> | Record<string, unknown>[];
	}

	let {
		title,
		description,
		keywords = '',
		canonicalPath,
		type = 'website',
		noindex = false,
		nofollow = false,
		author = SITE_NAME,
		publishedTime = '',
		modifiedTime = '',
		section = '',
		image = DEFAULT_OG_IMAGE_PATH,
		imageAlt = 'Bliss Systems Programming Language — Native control. Zero runtime overhead.',
		jsonLd
	}: Props = $props();

	let origin = $derived(resolveSiteOrigin(page.url));
	let canonical = $derived(buildCanonicalUrl(origin, canonicalPath ?? page.url.pathname));
	let ogImage = $derived(buildAbsoluteUrl(origin, image));
	let robotsContent = $derived(
		noindex
			? `noindex, ${nofollow ? 'nofollow' : 'follow'}`
			: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
	);

	let jsonLdScripts = $derived.by(() => {
		if (!jsonLd) return [];
		const list = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
		return list.map(
			(item) => `<script type="application/ld+json">${serializeJsonLd(item)}<\/script>`
		);
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	{#if keywords}
		<meta name="keywords" content={keywords} />
	{/if}
	<meta name="author" content={author} />
	<meta name="robots" content={robotsContent} />
	<meta name="googlebot" content={robotsContent} />
	{#if !noindex}
		<link rel="canonical" href={canonical} />
	{/if}

	<!-- Open Graph -->
	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={imageAlt} />

	{#if type === 'article'}
		{#if publishedTime}
			<meta property="article:published_time" content={publishedTime} />
		{/if}
		{#if modifiedTime || publishedTime}
			<meta property="article:modified_time" content={modifiedTime || publishedTime} />
		{/if}
		{#if author}
			<meta property="article:author" content={author} />
		{/if}
		{#if section}
			<meta property="article:section" content={section} />
		{/if}
	{/if}

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />
	<meta name="twitter:image:alt" content={imageAlt} />

	<!-- Structured Data -->
	{#each jsonLdScripts as scriptTag (scriptTag)}
		{@html scriptTag}
	{/each}
</svelte:head>
