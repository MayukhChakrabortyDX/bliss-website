<script lang="ts">
	import { getFallbackDownloads, type DownloadLinks } from '../../releases';

	interface Props {
		downloads?: DownloadLinks;
		releaseTag?: string | null;
	}

	let { downloads = getFallbackDownloads(), releaseTag = null }: Props = $props();

	interface CodeTab {
		id: 'allocator' | 'daop' | 'cli';
		label: string;
		caption: string;
		href: string;
		linkLabel: string;
		copyText: string;
	}

	const tabs: CodeTab[] = [
		{
			id: 'allocator',
			label: 'allocator.bx',
			caption: 'Memory allocation is explicit syntax—pass custom allocators directly at allocation sites.',
			href: '/docs/specifications/allocator',
			linkLabel: 'Allocator spec →',
			copyText: `allocator arena {
    fx allocate(u32 size): u32 {
        return size;
    }
    fx deallocate(u32 ptr): u32 {
        return 0;
    }
}

fx main(): u32 {
    let buffer: u32 = new<arena> 256;
    free<arena> buffer;
    return 0;
}`
		},
		{
			id: 'daop',
			label: 'daop.bx',
			caption: 'Data-Action Oriented Programming separates memory layouts from behavioral contracts.',
			href: '/docs/specifications/daop',
			linkLabel: 'DAOP spec →',
			copyText: `data Packet {
    u32 id;
    u8[64] payload;
};

action Checksum {
    fx verify(): u32;
}

fx process(u32 status): u32 {
    if (status == 0) {
        return 0;
    }
    return 1;
}`
		},
		{
			id: 'cli',
			label: 'bliss cli',
			caption: 'Single-binary pre-alpha compiler: tokenizes spans, recovers across errors, and emits AST JSON.',
			href: '/blog/posts/pre-alpha-release',
			linkLabel: 'CLI guide →',
			copyText: `bliss main.bx`
		}
	];

	let activeTabId = $state<CodeTab['id']>('allocator');
	let copied = $state(false);
	let copyTimer: ReturnType<typeof setTimeout> | null = null;

	let activeTab = $derived(tabs.find((t) => t.id === activeTabId) ?? tabs[0]);

	async function copyActiveSnippet() {
		try {
			await navigator.clipboard.writeText(activeTab.copyText);
			copied = true;
			if (copyTimer) clearTimeout(copyTimer);
			copyTimer = setTimeout(() => {
				copied = false;
			}, 1600);
		} catch {
			copied = false;
		}
	}
</script>

<main class="home">
	<!-- Hero: Immediate value proposition + live Bliss code -->
	<section class="home-hero">
		<div class="home-hero__copy">
			<div class="home-status-pill">
				<span class="home-status-pill__dot" aria-hidden="true"></span>
				<span>Pre-Alpha v0.1 · Systems Language</span>
			</div>

			<h1 class="home-hero__title">
				Explicit control.
				<span>Zero hidden runtime.</span>
			</h1>

			<p class="home-hero__description">
				Bliss is a compiled systems programming language built around custom allocators,
				data-action separation, and a resilient parser designed for progressive error recovery.
			</p>

			<div class="home-hero__actions">
				<a href="#download" class="home-button home-button--primary">
					Download Bliss
					<span aria-hidden="true">→</span>
				</a>

				<a href="/docs/" class="home-button home-button--secondary">
					Read Docs
				</a>
			</div>

			<div class="home-hero__meta">
				<span>Span-based lexer</span>
				<span aria-hidden="true">·</span>
				<span>Two-set parser recovery</span>
				<span aria-hidden="true">·</span>
				<span>Linux, Windows &amp; macOS</span>
			</div>
		</div>

		<div class="home-code-panel">
			<div class="home-code-panel__bar">
				<div class="home-code-panel__dots" aria-hidden="true">
					<span></span>
					<span></span>
					<span></span>
				</div>

				<div class="home-code-panel__tabs" role="tablist" aria-label="Bliss examples">
					{#each tabs as tab (tab.id)}
						<button
							type="button"
							role="tab"
							aria-selected={activeTabId === tab.id}
							class={['home-code-panel__tab', activeTabId === tab.id && 'is-active']
								.filter(Boolean)
								.join(' ')}
							onclick={() => {
								activeTabId = tab.id;
								copied = false;
							}}
						>
							{tab.label}
						</button>
					{/each}
				</div>

				<button
					type="button"
					class={['home-code-panel__copy', copied && 'is-copied'].filter(Boolean).join(' ')}
					onclick={copyActiveSnippet}
				>
					{copied ? 'Copied' : 'Copy'}
				</button>
			</div>

			<div class="home-code-panel__body" role="tabpanel">
				{#if activeTabId === 'allocator'}
					<pre><code><span class="tok-comment">// Explicit custom allocator block</span>
<span class="tok-kw">allocator</span> <span class="tok-fn">arena</span> &#123;
    <span class="tok-kw">fx</span> <span class="tok-fn">allocate</span>(<span class="tok-type">u32</span> size): <span class="tok-type">u32</span> &#123;
        <span class="tok-kw">return</span> size;
    &#125;
    <span class="tok-kw">fx</span> <span class="tok-fn">deallocate</span>(<span class="tok-type">u32</span> ptr): <span class="tok-type">u32</span> &#123;
        <span class="tok-kw">return</span> <span class="tok-num">0</span>;
    &#125;
&#125;

<span class="tok-kw">fx</span> <span class="tok-fn">main</span>(): <span class="tok-type">u32</span> &#123;
    <span class="tok-kw">let</span> buffer: <span class="tok-type">u32</span> = <span class="tok-kw">new</span>&lt;<span class="tok-fn">arena</span>&gt; <span class="tok-num">256</span>;
    <span class="tok-kw">free</span>&lt;<span class="tok-fn">arena</span>&gt; buffer;
    <span class="tok-kw">return</span> <span class="tok-num">0</span>;
&#125;</code></pre>
				{:else if activeTabId === 'daop'}
					<pre><code><span class="tok-comment">// Separate memory layout from behavior</span>
<span class="tok-kw">data</span> <span class="tok-type">Packet</span> &#123;
    <span class="tok-type">u32</span> id;
    <span class="tok-type">u8</span>[<span class="tok-num">64</span>] payload;
&#125;;

<span class="tok-kw">action</span> <span class="tok-type">Checksum</span> &#123;
    <span class="tok-kw">fx</span> <span class="tok-fn">verify</span>(): <span class="tok-type">u32</span>;
&#125;

<span class="tok-kw">fx</span> <span class="tok-fn">process</span>(<span class="tok-type">u32</span> status): <span class="tok-type">u32</span> &#123;
    <span class="tok-kw">if</span> (status == <span class="tok-num">0</span>) &#123;
        <span class="tok-kw">return</span> <span class="tok-num">0</span>;
    &#125;
    <span class="tok-kw">return</span> <span class="tok-num">1</span>;
&#125;</code></pre>
				{:else}
					<pre><code><span class="tok-prompt">$</span> bliss main.bx
<span class="tok-muted">› Reading source file main.bx</span>
<span class="tok-ok">✓</span> Read source file main.bx
<span class="tok-muted">› Tokenizing main.bx</span>
<span class="tok-ok">✓</span> Tokenized <span class="tok-num">214</span> tokens
<span class="tok-muted">› Parsing</span>
<span class="tok-ok">✓</span> Parsed <span class="tok-num">0</span> errors
<span class="tok-muted">› Writing AST main.json</span>
<span class="tok-ok">✓</span> Wrote AST main.json

<span class="tok-ok">No errors. Compiled in 4.2ms</span></code></pre>
				{/if}
			</div>

			<div class="home-code-panel__footer">
				<p>{activeTab.caption}</p>
				<a href={activeTab.href}>{activeTab.linkLabel}</a>
			</div>
		</div>
	</section>

	<!-- Core Design Pillars -->
	<section class="home-section home-pillars">
		<div class="home-section__header">
			<p class="home-eyebrow">What you can build</p>
			<h2 class="home-heading">Built for predictable systems.</h2>
		</div>

		<div class="home-pillar-grid">
			<article class="home-pillar-card">
				<div class="home-pillar-card__top">
					<span class="home-pillar-card__index">01 / EMBEDDED &amp; IOT</span>
					<code>no-gc · static</code>
				</div>
				<h3>Embedded &amp; IoT Devices</h3>
				<p>
					Deterministic memory with explicit <code>allocator</code> blocks and fixed-width types
					(<code>u8</code>–<code>u64</code>) for microcontrollers, sensors, and constrained hardware.
				</p>
				<a href="/blog/posts/embedded-and-iot" class="home-pillar-card__link">
					Embedded &amp; IoT guide →
				</a>
			</article>

			<article class="home-pillar-card">
				<div class="home-pillar-card__top">
					<span class="home-pillar-card__index">02 / BACKEND &amp; SERVERS</span>
					<code>arena · low-latency</code>
				</div>
				<h3>Backend Tools &amp; Web Servers</h3>
				<p>
					Request-scoped memory lifetimes and compiled native binaries let you build APIs,
					proxies, and network services without garbage-collection pauses.
				</p>
				<a href="/blog/posts/backend-and-servers" class="home-pillar-card__link">
					Backend &amp; servers →
				</a>
			</article>

			<article class="home-pillar-card">
				<div class="home-pillar-card__top">
					<span class="home-pillar-card__index">03 / COMPILERS &amp; TOOLING</span>
					<code>data · action · spans</code>
				</div>
				<h3>Compilers &amp; Developer Tools</h3>
				<p>
					Lean <code>data</code> layouts, phase-scoped arenas, and resilient parsing patterns built
					for fast compilers, linters, formatters, and static analyzers.
				</p>
				<a href="/blog/posts/compilers-and-tooling" class="home-pillar-card__link">
					Compilers &amp; tooling →
				</a>
			</article>

			<article class="home-pillar-card">
				<div class="home-pillar-card__top">
					<span class="home-pillar-card__index">04 / CLI &amp; NATIVE</span>
					<code>single-binary</code>
				</div>
				<h3>CLI Utilities &amp; Native Apps</h3>
				<p>
					Ship self-contained native executables for Linux, Windows, and macOS with instant
					startup and zero external runtime dependencies.
				</p>
				<a href="/blog/posts/cli-and-native-tools" class="home-pillar-card__link">
					CLI &amp; native tools →
				</a>
			</article>
		</div>
	</section>

	<!-- Download -->
	<section id="download" class="home-section home-download">
		<div class="home-download__card">
			<div class="home-download__header">
				<div>
					<div class="home-download__label">
						Download{#if releaseTag} · {releaseTag}{/if}
					</div>
					<h2>Download Bliss.</h2>
					<p class="home-download__summary">
						Get the standalone CLI for your platform—no runtime or extra setup required.
					</p>
				</div>

				<div class="home-download__actions">
					<a href="/docs/" class="home-button home-button--primary">
						Learn Bliss →
					</a>
					<a
						href="https://github.com/MayukhChakrabortyDX/bliss-compiler"
						target="_blank"
						rel="noopener noreferrer"
						class="home-button home-button--secondary"
					>
						Source on GitHub ↗
					</a>
				</div>
			</div>

			<div class="home-target-list">
				<div class="home-target-row">
					<div class="home-target-row__head">
						<div class="home-target-row__info">
							<span class="home-target-icon" aria-hidden="true">
								<svg viewBox="0 0 24 24" fill="currentColor">
									<path
										d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 0 0-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.132 1.884 1.071.771-.06 1.592-.536 2.257-1.306.631-.765 1.683-1.084 2.378-1.503.348-.199.629-.469.649-.853.023-.4-.2-.811-.714-1.376v-.097l-.003-.003c-.17-.2-.25-.535-.338-.926-.085-.401-.182-.786-.492-1.046h-.003c-.059-.054-.123-.067-.188-.135a.357.357 0 0 0-.19-.064c.431-1.278.264-2.55-.173-3.694-.533-1.41-1.465-2.638-2.175-3.483-.796-1.005-1.576-1.957-1.56-3.368.026-2.152.236-6.133-3.544-6.139z"
									/>
								</svg>
							</span>
							<div>
								<strong>Linux</strong>
								<span>Pre-Alpha CLI</span>
							</div>
						</div>
					</div>
					<div class="home-target-buttons">
						<a
							href={downloads['linux-x64']}
							target="_blank"
							rel="noopener noreferrer"
							class="home-download-btn"
						>
							<span aria-hidden="true">↓</span> x86_64
						</a>
						<a
							href={downloads['linux-arm64']}
							target="_blank"
							rel="noopener noreferrer"
							class="home-download-btn"
						>
							<span aria-hidden="true">↓</span> ARM64
						</a>
					</div>
				</div>

				<div class="home-target-row">
					<div class="home-target-row__head">
						<div class="home-target-row__info">
							<span class="home-target-icon" aria-hidden="true">
								<svg viewBox="0 0 24 24" fill="currentColor">
									<path
										d="M3 5.5L10.5 4.4V11.2H3V5.5ZM11.5 4.25L21 2.9V11.2H11.5V4.25ZM3 12.2H10.5V19L3 17.9V12.2ZM11.5 12.2H21V20.5L11.5 19.15V12.2Z"
									/>
								</svg>
							</span>
							<div>
								<strong>Windows</strong>
								<span>Pre-Alpha CLI</span>
							</div>
						</div>
					</div>
					<div class="home-target-buttons">
						<a
							href={downloads['windows-x64']}
							target="_blank"
							rel="noopener noreferrer"
							class="home-download-btn"
						>
							<span aria-hidden="true">↓</span> x86_64
						</a>
						<a
							href={downloads['windows-arm64']}
							target="_blank"
							rel="noopener noreferrer"
							class="home-download-btn"
						>
							<span aria-hidden="true">↓</span> ARM64
						</a>
					</div>
				</div>

				<div class="home-target-row">
					<div class="home-target-row__head">
						<div class="home-target-row__info">
							<span class="home-target-icon" aria-hidden="true">
								<svg viewBox="0 0 24 24" fill="currentColor">
									<path
										d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.33c.64-.78 1.08-1.86.96-2.94-.93.04-2.06.62-2.72 1.4-.58.68-1.1 1.78-.96 2.84 1.04.08 2.08-.52 2.72-1.3z"
									/>
								</svg>
							</span>
							<div>
								<strong>macOS</strong>
								<span>Apple Silicon</span>
							</div>
						</div>
					</div>
					<div class="home-target-buttons">
						<a
							href={downloads['macos-arm64']}
							target="_blank"
							rel="noopener noreferrer"
							class="home-download-btn"
						>
							<span aria-hidden="true">↓</span> M-Series
						</a>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Explore Strip -->
	<section class="home-section home-explore" aria-label="Explore Bliss">
		<a href="/docs/" class="home-explore__card">
			<span class="home-explore__eyebrow">Reference</span>
			<strong>Documentation</strong>
			<p>Syntax, types, compiler architecture, and formal AST specs.</p>
		</a>

		<a href="/blog/" class="home-explore__card">
			<span class="home-explore__eyebrow">Engineering</span>
			<strong>Blog &amp; Notes</strong>
			<p>CLI guides, parser recovery write-ups, and design rationale.</p>
		</a>
	</section>
</main>