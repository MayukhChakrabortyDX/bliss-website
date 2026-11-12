<script lang="ts">
	import { page } from '$app/state';
	import {
		BlogLayout,
		SeoHead,
		blogPosts,
		buildBlogPostingJsonLd,
		buildBreadcrumbJsonLd,
		formatSeoTitle,
		parseDateToIso,
		resolveSiteOrigin
	} from '#lib';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let normalizedPath = $derived(page.url.pathname.replace(/\/$/, '') || '/');
	let postSummary = $derived(
		blogPosts.find((item) => item.link.replace(/\/$/, '') === normalizedPath)
	);
	let origin = $derived(resolveSiteOrigin(page.url));
	let seoTitle = $derived(
		formatSeoTitle(data.post.frontmatter.seoTitle || data.post.title, 'Bliss Blog')
	);
	let seoDescription = $derived(
		data.post.frontmatter.seoDescription ||
			data.post.frontmatter.description ||
			'Engineering notes from the Bliss programming language and compiler.'
	);
	let publishedIso = $derived(parseDateToIso(data.post.frontmatter.date));
	let modifiedIso = $derived(parseDateToIso(data.post.frontmatter.updated) || publishedIso);
	let jsonLd = $derived([
		buildBreadcrumbJsonLd(origin, [
			{ name: 'Home', path: '/' },
			{ name: 'Blog', path: '/blog/' },
			{ name: data.post.title, path: page.url.pathname }
		]),
		buildBlogPostingJsonLd({
			origin,
			pathname: page.url.pathname,
			title: data.post.title,
			description: seoDescription,
			datePublished: publishedIso,
			author: data.post.frontmatter.author,
			category: data.post.frontmatter.category,
			keywords: data.post.frontmatter.keywords
		})
	]);
</script>

<SeoHead
	title={seoTitle}
	description={seoDescription}
	keywords={data.post.frontmatter.keywords ?? ''}
	type="article"
	author={data.post.frontmatter.author || 'Bliss'}
	publishedTime={publishedIso ?? ''}
	modifiedTime={modifiedIso ?? ''}
	section={data.post.frontmatter.category || 'Bliss / Notes'}
	{jsonLd}
/>

<BlogLayout
	isIndex={false}
	title={data.post.title}
	description={data.post.frontmatter.description ?? ''}
	category={data.post.frontmatter.category ?? 'Bliss / Notes'}
	date={data.post.frontmatter.date ?? ''}
	author={data.post.frontmatter.author ?? ''}
	topic={postSummary?.topic ?? 'blog-cli'}
	variant={postSummary?.variant ?? 'blue'}
	htmlContent={data.post.html}
/>
