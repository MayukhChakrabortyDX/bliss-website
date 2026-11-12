import { GITHUB_REPO_URL } from './seo';

export const DOWNLOAD_ARTIFACTS = {
	'linux-x64': 'bliss-linux-x64.tar.gz',
	'linux-arm64': 'bliss-linux-arm64.tar.gz',
	'windows-x64': 'bliss-windows-x64.exe.zip',
	'windows-arm64': 'bliss-windows-arm64.exe.zip',
	'macos-arm64': 'bliss-macos-arm64.tar.gz'
} as const;

export type DownloadTarget = keyof typeof DOWNLOAD_ARTIFACTS;
export type DownloadLinks = Record<DownloadTarget, string>;

export interface LatestReleaseData {
	releaseTag: string | null;
	downloads: DownloadLinks;
}

export function getFallbackDownloads(): DownloadLinks {
	const base = `${GITHUB_REPO_URL}/releases/latest/download`;
	return {
		'linux-x64': `${base}/${DOWNLOAD_ARTIFACTS['linux-x64']}`,
		'linux-arm64': `${base}/${DOWNLOAD_ARTIFACTS['linux-arm64']}`,
		'windows-x64': `${base}/${DOWNLOAD_ARTIFACTS['windows-x64']}`,
		'windows-arm64': `${base}/${DOWNLOAD_ARTIFACTS['windows-arm64']}`,
		'macos-arm64': `${base}/${DOWNLOAD_ARTIFACTS['macos-arm64']}`
	};
}
