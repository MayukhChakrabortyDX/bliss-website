<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import DocsLayout from '#lib/components/layouts/DocsLayout.svelte';

	const { Story } = defineMeta({
		title: 'Bliss/Layouts/DocsLayout',
		component: DocsLayout,
		tags: ['autodocs'],
		parameters: {
			layout: 'fullscreen'
		}
	});
</script>

<Story
	name="Language Syntax Sample"
	args={{
		title: 'Language Syntax',
		currentPath: '/docs/language/syntax',
		headers: [
			{ level: 2, title: 'Source files', slug: 'source-files' },
			{ level: 2, title: 'Comments', slug: 'comments' }
		],
		htmlContent: `
			<h1>Language Syntax</h1>
			<h2 id="source-files">Source files</h2>
			<p>A Bliss source file is a sequence of top-level declarations.</p>
			<div class="language-ebnf">
				<button type="button" class="copy" title="Copy Code"></button>
				<span class="lang">ebnf</span>
				<pre><code>PROGRAM -> (IMPORT | USING | FUNCTION | DAOP | ALLOCATOR)* ;</code></pre>
			</div>
			<h2 id="comments">Comments</h2>
			<p>Line comments begin with <code>//</code> and continue to the end of the line.</p>
		`
	}}
/>
