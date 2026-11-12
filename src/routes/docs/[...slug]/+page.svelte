<script lang="ts">
	import { page } from '$app/state';
	import {
		DocsLayout,
		SeoHead,
		docsNavigation,
		flattenNavigation,
		buildBreadcrumbJsonLd,
		buildTechArticleJsonLd,
		formatSeoTitle,
		parseDateToIso,
		resolveSiteOrigin
	} from '#lib';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let origin = $derived(resolveSiteOrigin(page.url));
	let normalizedCurrent = $derived(page.url.pathname.replace(/\/$/, '') || '/');
	let activeGroup = $derived(
		docsNavigation.find((group) =>
			flattenNavigation([group]).some(
				(item) => item.link && (item.link.replace(/\/$/, '') || '/') === normalizedCurrent
			)
		) ?? docsNavigation[0]
	);

	let seoTitle = $derived(
		formatSeoTitle(data.doc.frontmatter.seoTitle || data.doc.title, 'Bliss Docs')
	);
	let seoDescription = $derived(
		data.doc.frontmatter.seoDescription ||
			data.doc.frontmatter.description ||
			'Documentation for the Bliss systems programming language and compiler.'
	);
	let isNoindex = $derived(data.doc.frontmatter.noindex === 'true');
	let modifiedIso = $derived(
		parseDateToIso(data.doc.frontmatter.updated) || parseDateToIso(data.doc.frontmatter.date)
	);

	let jsonLd = $derived([
		buildBreadcrumbJsonLd(origin, [
			{ name: 'Home', path: '/' },
			{ name: 'Docs', path: '/docs/' },
			{ name: activeGroup.label, path: activeGroup.link },
			{ name: data.doc.title, path: page.url.pathname }
		]),
		buildTechArticleJsonLd({
			origin,
			pathname: page.url.pathname,
			title: data.doc.title,
			description: seoDescription,
			section: activeGroup.title,
			keywords: data.doc.frontmatter.keywords,
			dateModified: modifiedIso
		})
	]);
</script>

<SeoHead
	title={seoTitle}
	description={seoDescription}
	keywords={data.doc.frontmatter.keywords ?? ''}
	type="article"
	noindex={isNoindex}
	modifiedTime={modifiedIso ?? ''}
	section={activeGroup.title}
	{jsonLd}
/>

<DocsLayout
	title={data.doc.title}
	htmlContent={data.doc.html}
	headers={data.doc.headers}
	currentPath={page.url.pathname}
/>
