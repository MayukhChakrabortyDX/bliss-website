import type { RequestHandler } from './$types';
import { resolveSiteOrigin } from '#lib';

export const GET: RequestHandler = async ({ url }) => {
	const origin = resolveSiteOrigin(url);

	const body = `# Allow crawling everything by default
User-agent: *
Allow: /
Disallow: /blogs/

Sitemap: ${origin}/sitemap.xml
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
