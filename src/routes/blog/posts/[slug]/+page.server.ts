import { error } from '@sveltejs/kit';
import { loadContentPage } from '../../../../lib/markdown';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const rendered = await loadContentPage(`/blog/posts/${params.slug}`, { stripLeadingH1: true });
	if (!rendered) {
		error(404, 'Article not found');
	}
	return { post: rendered };
};
