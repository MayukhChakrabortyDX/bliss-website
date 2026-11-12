import type { RequestHandler } from './$types';
import {
	listContentEntries,
	SITE_FULL_NAME,
	buildCanonicalUrl,
	parseDateToRfc822,
	resolveSiteOrigin
} from '#lib';

function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

export const GET: RequestHandler = async ({ url }) => {
	const origin = resolveSiteOrigin(url);
	const blogUrl = buildCanonicalUrl(origin, '/blog/');
	const feedUrl = `${origin}/rss.xml`;

	const posts = listContentEntries().filter((entry) => entry.routePath.startsWith('/blog/posts/'));

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${SITE_FULL_NAME} — Engineering Blog`)}</title>
    <link>${escapeXml(blogUrl)}</link>
    <description>Notes, architecture deep-dives, parser engineering, and compiler milestones from the Bliss project.</description>
    <language>en-us</language>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
${posts
	.map((post) => {
		const link = buildCanonicalUrl(origin, post.routePath);
		const title = post.frontmatter.title ?? 'Bliss Blog Post';
		const description = post.frontmatter.seoDescription || post.frontmatter.description || post.excerpt;
		const pubDate = parseDateToRfc822(post.frontmatter.date);
		const category = post.frontmatter.category;

		return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${pubDate}</pubDate>${category ? `\n      <category>${escapeXml(category)}</category>` : ''}
      <description>${escapeXml(description)}</description>
    </item>`;
	})
	.join('\n')}
  </channel>
</rss>
`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/rss+xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
