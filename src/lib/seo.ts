export const SITE_NAME = 'Bliss';
export const SITE_FULL_NAME = 'Bliss Programming Language';
export const SITE_TAGLINE = 'Native control. Zero runtime overhead.';
export const SITE_DESCRIPTION =
	'Bliss is a compiled, statically typed systems programming language featuring lexical ownership verification, algebraic types, progressive error recovery, and direct LLVM native code generation without tracing garbage collection.';
export const GITHUB_REPO_URL = 'https://github.com/MayukhChakrabortyDX/bliss-compiler';
export const LINKEDIN_URL = 'https://www.linkedin.com/company/bliss-org';
export const DISCORD_URL = 'https://discord.gg/DR3bKvNQhn';
export const DEFAULT_OG_IMAGE_PATH = '/og-image.png';
export const DEFAULT_LOGO_PATH = '/logo.png';
export const FALLBACK_SITE_ORIGIN = 'https://bliss-lang.dev';

const TRAILING_SLASH_PATHS = new Set([
	'/',
	'/docs/',
	'/docs/specifications/',
	'/blog/'
]);

const MONTH_INDEX: Record<string, string> = {
	january: '01',
	february: '02',
	march: '03',
	april: '04',
	may: '05',
	june: '06',
	july: '07',
	august: '08',
	september: '09',
	october: '10',
	november: '11',
	december: '12'
};

/**
 * Resolves the canonical site origin, preferring PUBLIC_SITE_URL if configured
 * and falling back to the request URL origin (ignoring SvelteKit's prerender placeholder).
 */
export function resolveSiteOrigin(url?: { origin?: string } | null): string {
	const configured =
		typeof import.meta !== 'undefined'
			? (import.meta.env?.PUBLIC_SITE_URL as string | undefined)
			: undefined;

	if (configured && configured.trim()) {
		return configured.trim().replace(/\/+$/, '');
	}

	if (url && url.origin && !url.origin.includes('sveltekit-prerender')) {
		return url.origin.replace(/\/+$/, '');
	}

	return FALLBACK_SITE_ORIGIN;
}

/**
 * Normalizes a pathname so directory index routes retain a trailing slash
 * and leaf routes omit it, matching internal navigation links.
 */
export function normalizeCanonicalPath(pathname: string): string {
	const clean = '/' + pathname.replace(/^\/+|\/+$/g, '');
	if (clean === '/') return '/';

	const withSlash = `${clean}/`;
	if (TRAILING_SLASH_PATHS.has(withSlash)) {
		return withSlash;
	}

	return clean;
}

export function buildCanonicalUrl(origin: string, pathname: string): string {
	const base = origin.replace(/\/+$/, '');
	return `${base}${normalizeCanonicalPath(pathname)}`;
}

export function buildAbsoluteUrl(origin: string, pathOrUrl: string): string {
	if (/^https?:\/\//i.test(pathOrUrl)) {
		return pathOrUrl;
	}
	const base = origin.replace(/\/+$/, '');
	const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
	return `${base}${path}`;
}

export function formatSeoTitle(title: string, suffix?: string): string {
	const trimmed = title.trim();
	if (!suffix || trimmed.toLowerCase().includes(suffix.toLowerCase())) {
		return trimmed;
	}
	return `${trimmed} | ${suffix}`;
}

/**
 * Converts human dates such as "September 2026" or "2026-09-15" into ISO-8601 date strings.
 */
export function parseDateToIso(dateStr?: string): string | undefined {
	if (!dateStr) return undefined;
	const trimmed = dateStr.trim();
	if (!trimmed) return undefined;

	if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
		return trimmed.slice(0, 10);
	}

	const monthYearMatch = trimmed.match(/^([A-Za-z]+)\s+(\d{4})$/);
	if (monthYearMatch) {
		const month = MONTH_INDEX[monthYearMatch[1].toLowerCase()];
		if (month) {
			return `${monthYearMatch[2]}-${month}-01`;
		}
	}

	const parsed = Date.parse(trimmed);
	if (!Number.isNaN(parsed)) {
		return new Date(parsed).toISOString().slice(0, 10);
	}

	return undefined;
}

export function parseDateToRfc822(dateStr?: string): string {
	const iso = parseDateToIso(dateStr);
	const date = iso ? new Date(`${iso}T00:00:00Z`) : new Date('2026-09-01T00:00:00Z');
	return date.toUTCString();
}

export function serializeJsonLd(data: Record<string, unknown> | Record<string, unknown>[]): string {
	return JSON.stringify(data).replace(/</g, '\\u003c');
}

export interface BreadcrumbItem {
	name: string;
	path: string;
}

export function buildBreadcrumbJsonLd(
	origin: string,
	items: BreadcrumbItem[]
): Record<string, unknown> {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, idx) => ({
			'@type': 'ListItem',
			position: idx + 1,
			name: item.name,
			item: buildCanonicalUrl(origin, item.path)
		}))
	};
}

export function buildOrganizationJsonLd(origin: string): Record<string, unknown> {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		'@id': `${origin}/#organization`,
		name: SITE_FULL_NAME,
		alternateName: SITE_NAME,
		url: `${origin}/`,
		logo: {
			'@type': 'ImageObject',
			url: buildAbsoluteUrl(origin, DEFAULT_LOGO_PATH),
			width: 512,
			height: 512
		},
		sameAs: [GITHUB_REPO_URL, LINKEDIN_URL, DISCORD_URL]
	};
}

export function buildWebsiteJsonLd(origin: string): Record<string, unknown> {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		'@id': `${origin}/#website`,
		name: SITE_FULL_NAME,
		alternateName: SITE_NAME,
		url: `${origin}/`,
		description: SITE_DESCRIPTION,
		inLanguage: 'en-US',
		publisher: {
			'@id': `${origin}/#organization`
		}
	};
}

export function buildSoftwareJsonLd(origin: string): Record<string, unknown> {
	return {
		'@context': 'https://schema.org',
		'@type': 'SoftwareSourceCode',
		'@id': `${origin}/#software`,
		name: 'Bliss Compiler',
		alternateName: 'Bliss Programming Language',
		description: SITE_DESCRIPTION,
		url: `${origin}/`,
		codeRepository: GITHUB_REPO_URL,
		programmingLanguage: ['Bliss', 'TypeScript', 'LLVM IR'],
		runtimePlatform: ['Linux', 'Windows', 'macOS'],
		targetProduct: {
			'@type': 'SoftwareApplication',
			name: 'Bliss',
			applicationCategory: 'DeveloperApplication',
			operatingSystem: 'Linux, Windows, macOS',
			url: `${origin}/`,
			offers: {
				'@type': 'Offer',
				price: '0',
				priceCurrency: 'USD'
			}
		}
	};
}

export function buildTechArticleJsonLd(params: {
	origin: string;
	pathname: string;
	title: string;
	description: string;
	section: string;
	keywords?: string;
	dateModified?: string;
}): Record<string, unknown> {
	const url = buildCanonicalUrl(params.origin, params.pathname);
	return {
		'@context': 'https://schema.org',
		'@type': 'TechArticle',
		headline: params.title,
		description: params.description,
		url,
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': url
		},
		articleSection: params.section,
		inLanguage: 'en-US',
		...(params.keywords ? { keywords: params.keywords } : {}),
		...(params.dateModified ? { dateModified: params.dateModified } : {}),
		author: {
			'@type': 'Organization',
			name: SITE_FULL_NAME,
			url: `${params.origin}/`
		},
		publisher: {
			'@type': 'Organization',
			name: SITE_FULL_NAME,
			logo: {
				'@type': 'ImageObject',
				url: buildAbsoluteUrl(params.origin, DEFAULT_LOGO_PATH)
			}
		},
		image: buildAbsoluteUrl(params.origin, DEFAULT_OG_IMAGE_PATH)
	};
}

export function buildBlogPostingJsonLd(params: {
	origin: string;
	pathname: string;
	title: string;
	description: string;
	datePublished?: string;
	author?: string;
	category?: string;
	keywords?: string;
}): Record<string, unknown> {
	const url = buildCanonicalUrl(params.origin, params.pathname);
	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: params.title,
		description: params.description,
		url,
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': url
		},
		inLanguage: 'en-US',
		...(params.datePublished ? { datePublished: params.datePublished, dateModified: params.datePublished } : {}),
		...(params.category ? { articleSection: params.category } : {}),
		...(params.keywords ? { keywords: params.keywords } : {}),
		author: {
			'@type': 'Organization',
			name: params.author || SITE_NAME,
			url: `${params.origin}/`
		},
		publisher: {
			'@type': 'Organization',
			name: SITE_FULL_NAME,
			logo: {
				'@type': 'ImageObject',
				url: buildAbsoluteUrl(params.origin, DEFAULT_LOGO_PATH)
			}
		},
		image: buildAbsoluteUrl(params.origin, DEFAULT_OG_IMAGE_PATH)
	};
}
