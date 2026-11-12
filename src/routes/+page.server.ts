import type { PageServerLoad } from './$types';
import {
	DOWNLOAD_ARTIFACTS,
	getFallbackDownloads,
	type DownloadTarget,
	type LatestReleaseData
} from '#lib';

const GITHUB_RELEASES_API =
	'https://api.github.com/repos/MayukhChakrabortyDX/bliss-compiler/releases?per_page=1';
const CACHE_TTL_MS = 5 * 60 * 1000;

interface GitHubReleaseAsset {
	name?: string;
	browser_download_url?: string;
}

interface GitHubRelease {
	tag_name?: string;
	assets?: GitHubReleaseAsset[];
}

let cachedRelease: { expiresAt: number; data: LatestReleaseData } | null = null;

async function fetchLatestRelease(fetchFn: typeof fetch): Promise<LatestReleaseData> {
	if (cachedRelease && Date.now() < cachedRelease.expiresAt) {
		return cachedRelease.data;
	}

	const downloads = getFallbackDownloads();

	try {
		const res = await fetchFn(GITHUB_RELEASES_API, {
			headers: {
				Accept: 'application/vnd.github+json',
				'User-Agent': 'bliss-website'
			}
		});

		if (!res.ok) {
			return { releaseTag: null, downloads };
		}

		const releases = (await res.json()) as GitHubRelease[];
		const latest = releases[0];
		if (!latest) {
			return { releaseTag: null, downloads };
		}

		const assetByName = new Map<string, string>();
		for (const asset of latest.assets ?? []) {
			if (asset.name && asset.browser_download_url) {
				assetByName.set(asset.name, asset.browser_download_url);
			}
		}

		for (const [target, filename] of Object.entries(DOWNLOAD_ARTIFACTS) as [
			DownloadTarget,
			string
		][]) {
			const url = assetByName.get(filename);
			if (url) {
				downloads[target] = url;
			}
		}

		const data: LatestReleaseData = {
			releaseTag: latest.tag_name ?? null,
			downloads
		};

		cachedRelease = { expiresAt: Date.now() + CACHE_TTL_MS, data };
		return data;
	} catch {
		return { releaseTag: null, downloads };
	}
}

export const load: PageServerLoad = async ({ fetch, setHeaders }) => {
	setHeaders({
		'cache-control': 'public, max-age=300, s-maxage=300'
	});

	return fetchLatestRelease(fetch);
};
