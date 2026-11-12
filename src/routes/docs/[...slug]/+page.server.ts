import { error } from '@sveltejs/kit';
import { loadContentPage } from '../../../lib/markdown';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const rendered = await loadContentPage(`/docs/${params.slug}`);
	if (!rendered) {
		error(404, 'Documentation page not found');
	}
	return { doc: rendered };
};
