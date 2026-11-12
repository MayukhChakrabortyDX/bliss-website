import type { RequestHandler } from './$types';
import {
	listContentEntries,
	buildCanonicalUrl,
	parseDateToIso,
	resolveSiteOrigin
} from '#lib';

interface SitemapEntry {
	loc: string;
	lastmod?: string;
	changefreq: 'daily' | 'weekly' | 'monthly';
	priority: string;
}

function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function priorityForRoute(routePath: string): { priority: string; changefreq: 'daily' | 'weekly' | 'monthly' } {
	if (routePath === '/') {
		return { priority: '1.0', changefreq: 'weekly' };
	}
	if (routePath === '/docs/' || routePath === '/blog/') {
		return { priority: '0.9', changefreq: 'weekly' };
	}
	if (
		routePath === '/docs/language' ||
		routePath === '/docs/compiler' ||
		routePath === '/docs/specifications/'
	) {
		return { priority: '0.85', changefreq: 'weekly' };
	}
	if (routePath.startsWith('/blog/posts/')) {
		return { priority: '0.8', changefreq: 'monthly' };
	}
	if (routePath.startsWith('/docs/')) {
		return { priority: '0.75', changefreq: 'weekly' };
	}
	return { priority: '0.7', changefreq: 'monthly' };
}

export const GET: RequestHandler = async ({ url }) => {
	const origin = resolveSiteOrigin(url);
	const seen = new Set<string>();
	const entries: SitemapEntry[] = [];

	const addEntry = (path: string, lastmod?: string) => {
		const loc = buildCanonicalUrl(origin, path);
		if (seen.has(loc)) return;
		seen.add(loc);
		const { priority, changefreq } = priorityForRoute(path);
		entries.push({ loc, lastmod, changefreq, priority });
	};

	const contentEntries = listContentEntries();
	for (const entry of contentEntries) {
		if (entry.routePath === '/404' || entry.routePath === '/blogs/') continue;
		if (entry.frontmatter.noindex === 'true') continue;

		const lastmod =
			parseDateToIso(entry.frontmatter.updated) ?? parseDateToIso(entry.frontmatter.date);
		addEntry(entry.routePath, lastmod);
	}

	entries.sort((a, b) => Number(b.priority) - Number(a.priority) || a.loc.localeCompare(b.loc));

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
	.map(
		(entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>${entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : ''}
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
	)
	.join('\n')}
</urlset>
`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
