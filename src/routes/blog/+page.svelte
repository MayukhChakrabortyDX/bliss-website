<script lang="ts">
	import { page } from '$app/state';
	import {
		BlogLayout,
		SeoHead,
		blogPosts,
		buildBreadcrumbJsonLd,
		buildCanonicalUrl,
		parseDateToIso,
		resolveSiteOrigin
	} from '#lib';

	let origin = $derived(resolveSiteOrigin(page.url));
	let jsonLd = $derived([
		buildBreadcrumbJsonLd(origin, [
			{ name: 'Home', path: '/' },
			{ name: 'Blog', path: '/blog/' }
		]),
		{
			'@context': 'https://schema.org',
			'@type': 'Blog',
			name: 'Bliss Engineering Blog',
			description:
				'Language design notes, parser error recovery deep-dives, CLI guides, and compiler milestones from the Bliss project.',
			url: buildCanonicalUrl(origin, '/blog/'),
			blogPost: blogPosts.map((post) => ({
				'@type': 'BlogPosting',
				headline: post.title,
				description: post.description,
				url: buildCanonicalUrl(origin, post.link),
				datePublished: parseDateToIso(post.date)
			}))
		}
	]);
</script>

<SeoHead
	title="Engineering Blog — Bliss Language & Compiler Notes | Bliss"
	description="Language experiments, compiler architecture deep-dives, parser error recovery, CLI walkthroughs, and systems programming notes from the Bliss project."
	keywords="Bliss blog, compiler engineering, parser recovery, Bliss CLI, systems programming design"
	canonicalPath="/blog/"
	{jsonLd}
/>

<BlogLayout isIndex={true} />
