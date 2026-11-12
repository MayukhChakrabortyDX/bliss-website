import { Marked, type Tokens } from 'marked';
import { bundledLanguages, bundledLanguagesAlias, getSingletonHighlighter } from 'shiki';
import type { DocHeader } from './components/layouts/DocsLayout.svelte';

const rawContentModules = import.meta.glob('/src/content/**/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

export interface ContentFrontmatter {
	title?: string;
	seoTitle?: string;
	description?: string;
	seoDescription?: string;
	keywords?: string;
	date?: string;
	updated?: string;
	author?: string;
	category?: string;
	layout?: string;
	noindex?: string;
	[key: string]: string | undefined;
}

export interface RenderMarkdownOptions {
	stripLeadingH1?: boolean;
}

export interface ContentEntrySummary {
	routePath: string;
	frontmatter: ContentFrontmatter;
	excerpt: string;
}

export interface RenderedPage {
	title: string;
	frontmatter: ContentFrontmatter;
	headers: DocHeader[];
	html: string;
}

const SHIKI_THEME = 'github-dark';

const LANGUAGE_FALLBACKS: Record<string, string> = {
	bliss: 'ts',
	ebnf: 'text'
};

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

function parseFrontmatter(raw: string): { frontmatter: ContentFrontmatter; body: string } {
	const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
	if (!match) {
		return { frontmatter: {}, body: raw };
	}

	const frontmatter: ContentFrontmatter = {};
	for (const line of match[1].split(/\r?\n/)) {
		const sep = line.indexOf(':');
		if (sep <= 0) continue;
		const key = line.slice(0, sep).trim();
		let val = line.slice(sep + 1).trim();
		if (
			(val.startsWith('"') && val.endsWith('"')) ||
			(val.startsWith("'") && val.endsWith("'"))
		) {
			val = val.slice(1, -1);
		}
		frontmatter[key] = val;
	}

	return { frontmatter, body: match[2] };
}

function stripInlineMarkdown(text: string): string {
	return text
		.replace(/`([^`]+)`/g, '$1')
		.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
		.replace(/[*_~]/g, '')
		.replace(/<[^>]+>/g, '')
		.trim();
}

function slugifyHeading(text: string, seen: Map<string, number>): string {
	const base =
		stripInlineMarkdown(text)
			.toLowerCase()
			.normalize('NFKD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/[^a-z0-9\s-]/g, '')
			.trim()
			.replace(/[\s-]+/g, '-') || 'section';

	const count = seen.get(base) ?? 0;
	seen.set(base, count + 1);
	return count === 0 ? base : `${base}-${count}`;
}

function resolveRelativeHref(href: string, baseDir: string): string {
	if (
		!href ||
		href.startsWith('#') ||
		href.startsWith('/') ||
		href.startsWith('http://') ||
		href.startsWith('https://') ||
		href.startsWith('mailto:')
	) {
		return href;
	}

	const [pathPart, hashPart] = href.split('#');
	const cleanPathPart = pathPart.replace(/\.md$/, '');
	const baseSegments = baseDir.split('/').filter(Boolean);

	for (const segment of cleanPathPart.split('/')) {
		if (!segment || segment === '.') continue;
		if (segment === '..') {
			baseSegments.pop();
		} else {
			baseSegments.push(segment);
		}
	}

	const resolved = '/' + baseSegments.join('/');
	return hashPart ? `${resolved}#${hashPart}` : resolved;
}

function resolveShikiLang(lang: string): string {
	const normalized = lang.trim().toLowerCase();
	if (!normalized) return 'text';
	const mapped = LANGUAGE_FALLBACKS[normalized] ?? normalized;
	if (mapped === 'text' || mapped === 'plaintext' || mapped === 'txt') return 'text';
	if (mapped in bundledLanguages || mapped in bundledLanguagesAlias) return mapped;
	return 'text';
}

async function highlightCodeBlock(code: string, rawLang: string): Promise<string> {
	const displayLang = (rawLang || 'text').trim().split(/\s+/)[0] || 'text';
	const shikiLang = resolveShikiLang(displayLang);

	let preHtml: string;
	if (shikiLang === 'text') {
		preHtml = `<pre><code>${escapeHtml(code)}</code></pre>`;
	} else {
		const highlighter = await getSingletonHighlighter({
			themes: [SHIKI_THEME],
			langs: [shikiLang]
		});
		if (!highlighter.getLoadedLanguages().includes(shikiLang)) {
			await highlighter.loadLanguage(shikiLang as Parameters<typeof highlighter.loadLanguage>[0]);
		}
		preHtml = highlighter.codeToHtml(code, {
			lang: shikiLang,
			theme: SHIKI_THEME
		});
	}

	return `<div class="language-${escapeHtml(displayLang)}"><button type="button" title="Copy Code" class="copy"></button><span class="lang">${escapeHtml(displayLang)}</span>${preHtml}</div>`;
}

export async function renderMarkdown(
	raw: string,
	baseDir: string,
	options: RenderMarkdownOptions = {}
): Promise<RenderedPage> {
	const { frontmatter, body } = parseFrontmatter(raw);
	const seenSlugs = new Map<string, number>();
	const headers: DocHeader[] = [];
	const headingIds = new WeakMap<Tokens.Heading, string>();
	const renderedCodeBlocks = new WeakMap<Tokens.Code, string>();
	let firstH1Title = '';

	const instance = new Marked();
	const tokens = instance.lexer(body);

	if (options.stripLeadingH1) {
		const firstNonSpaceIdx = tokens.findIndex((token) => token.type !== 'space');
		if (firstNonSpaceIdx >= 0 && tokens[firstNonSpaceIdx].type === 'heading') {
			const firstHeading = tokens[firstNonSpaceIdx] as Tokens.Heading;
			if (firstHeading.depth === 1) {
				firstH1Title = stripInlineMarkdown(firstHeading.text);
				tokens.splice(firstNonSpaceIdx, 1);
			}
		}
	}

	const codeTasks: Promise<void>[] = [];

	instance.walkTokens(tokens, (token) => {
		if (token.type === 'heading') {
			const heading = token as Tokens.Heading;
			const plainTitle = stripInlineMarkdown(heading.text);
			if (heading.depth === 1 && !firstH1Title) {
				firstH1Title = plainTitle;
			}
			const slug = slugifyHeading(heading.text, seenSlugs);
			headingIds.set(heading, slug);
			if (heading.depth >= 2 && heading.depth <= 4) {
				headers.push({
					level: heading.depth,
					title: plainTitle,
					slug
				});
			}
		} else if (token.type === 'code') {
			const codeToken = token as Tokens.Code;
			codeTasks.push(
				highlightCodeBlock(codeToken.text, codeToken.lang ?? '').then((html) => {
					renderedCodeBlocks.set(codeToken, html);
				})
			);
		}
	});

	await Promise.all(codeTasks);

	instance.use({
		renderer: {
			heading(token: Tokens.Heading) {
				const id = headingIds.get(token) ?? '';
				const inner = this.parser.parseInline(token.tokens);
				return `<h${token.depth} id="${escapeHtml(id)}" tabindex="-1">${inner}</h${token.depth}>\n`;
			},
			code(token: Tokens.Code) {
				return (
					renderedCodeBlocks.get(token) ??
					`<div class="language-text"><button type="button" title="Copy Code" class="copy"></button><span class="lang">text</span><pre><code>${escapeHtml(token.text)}</code></pre></div>`
				);
			},
			link(token: Tokens.Link) {
				const resolvedHref = resolveRelativeHref(token.href, baseDir);
				const inner = this.parser.parseInline(token.tokens);
				const titleAttr = token.title ? ` title="${escapeHtml(token.title)}"` : '';
				const isExternal = /^https?:\/\//.test(resolvedHref);
				const targetAttr = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
				return `<a href="${escapeHtml(resolvedHref)}"${titleAttr}${targetAttr}>${inner}</a>`;
			}
		}
	});

	const html = instance.parser(tokens);

	return {
		title: frontmatter.title || firstH1Title || 'Bliss',
		frontmatter,
		headers,
		html
	};
}

export function resolveContentEntry(routePath: string): { raw: string; baseDir: string } | null {
	const clean = routePath.replace(/^\/+|\/+$/g, '').replace(/\.html$/, '');
	const candidates = clean
		? [`/src/content/${clean}.md`, `/src/content/${clean}/index.md`]
		: ['/src/content/index.md'];

	for (const candidate of candidates) {
		const raw = rawContentModules[candidate];
		if (raw !== undefined) {
			const isIndex = candidate.endsWith('/index.md') || candidate === '/src/content/index.md';
			const relFile = candidate.slice('/src/content/'.length);
			const baseDir = isIndex
				? '/' + relFile.replace(/\/?index\.md$/, '')
				: '/' + relFile.split('/').slice(0, -1).join('/');
			return { raw, baseDir };
		}
	}

	return null;
}

export async function loadContentPage(
	routePath: string,
	options: RenderMarkdownOptions = {}
): Promise<RenderedPage | null> {
	const entry = resolveContentEntry(routePath);
	if (!entry) return null;
	return renderMarkdown(entry.raw, entry.baseDir, options);
}

export function listContentEntries(): ContentEntrySummary[] {
	return Object.entries(rawContentModules).map(([filePath, raw]) => {
		const { frontmatter, body } = parseFrontmatter(raw);
		const rel = filePath.replace(/^\/src\/content\//, '').replace(/\.md$/, '');
		let routePath: string;
		if (rel === 'index') {
			routePath = '/';
		} else if (rel.endsWith('/index')) {
			routePath = `/${rel.slice(0, -'/index'.length)}/`;
		} else {
			routePath = `/${rel}`;
		}

		const firstParagraph = body
			.split(/\r?\n\r?\n/)
			.map((block) => block.trim())
			.find((block) => block && !block.startsWith('#') && !block.startsWith('```') && !block.startsWith('---'));

		return {
			routePath,
			frontmatter,
			excerpt: firstParagraph ? stripInlineMarkdown(firstParagraph) : ''
		};
	});
}
