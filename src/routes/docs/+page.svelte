<script lang="ts">
	import { page } from '$app/state';
	import {
		DocsIndexLayout,
		SeoHead,
		docsNavigation,
		buildBreadcrumbJsonLd,
		buildCanonicalUrl,
		resolveSiteOrigin
	} from '#lib';

	let origin = $derived(resolveSiteOrigin(page.url));
	let jsonLd = $derived([
		buildBreadcrumbJsonLd(origin, [
			{ name: 'Home', path: '/' },
			{ name: 'Docs', path: '/docs/' }
		]),
		{
			'@context': 'https://schema.org',
			'@type': 'CollectionPage',
			name: 'Bliss Language & Compiler Documentation',
			description:
				'Explore the Bliss language reference, compiler architecture, progressive error recovery parser, and formal AST specifications.',
			url: buildCanonicalUrl(origin, '/docs/'),
			hasPart: docsNavigation.map((group) => ({
				'@type': 'WebPage',
				name: group.title,
				description: group.description,
				url: buildCanonicalUrl(origin, group.link)
			}))
		}
	]);
</script>

<SeoHead
	title="Documentation — Bliss Systems Programming Language & Compiler | Bliss"
	description="Explore the Bliss language reference, syntax, types, memory model, compiler pipeline architecture, and formal AST specifications."
	keywords="Bliss documentation, Bliss language reference, Bliss compiler architecture, AST specifications, EBNF grammar, systems programming docs"
	canonicalPath="/docs/"
	{jsonLd}
/>

<DocsIndexLayout />
