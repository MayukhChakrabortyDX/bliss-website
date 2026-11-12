<script lang="ts">
	import type { Snippet } from 'svelte';
	import { copyCode } from '../../actions/copyCode';
	import { blogPosts, type BlogPostSummary, type NavVariant } from '../../navigation';
	import { parseDateToIso } from '../../seo';
	import DocsThumbnail from '../assets/DocsThumbnail.svelte';
	import BlissPageHeader from '../primitives/BlissPageHeader.svelte';
	import BlissCard from '../primitives/BlissCard.svelte';

	interface Props {
		isIndex?: boolean;
		posts?: BlogPostSummary[];
		title?: string;
		description?: string;
		category?: string;
		date?: string;
		author?: string;
		topic?: string;
		variant?: NavVariant;
		htmlContent?: string;
		children?: Snippet;
	}

	let {
		isIndex = true,
		posts = blogPosts,
		title = '',
		description = '',
		category = 'Bliss / Notes',
		date = '',
		author = '',
		topic = 'blog-cli',
		variant = 'blue',
		htmlContent = '',
		children
	}: Props = $props();
</script>

<main class="blog-shell">
	{#if isIndex}
		<div class="blog-index">
			<BlissPageHeader
				eyebrow="Bliss / Blog"
				title="Engineering notes."
				description="CLI guides, parser recovery write-ups, and systems language design notes."
				variant="blue"
				pill
			/>

			<div class="blog-list">
				{#each posts as post (post.link)}
					{@const isoDate = parseDateToIso(post.date)}
					<BlissCard
						href={post.link}
						title={post.title}
						description={post.description}
						actionText="Read article ↗"
						cardClass="blog-card"
					>
						{#snippet art()}
							<div class="blog-card__art-wrap" aria-hidden="true">
								<DocsThumbnail topic={post.topic} variant={post.variant} />
							</div>
						{/snippet}

						{#snippet meta()}
							<div class="blog-card__meta">
								{#if isoDate}
									<time datetime={isoDate}>{post.date}</time>
								{:else}
									<span>{post.date}</span>
								{/if}
								<span>{post.reading}</span>
							</div>
						{/snippet}
					</BlissCard>
				{/each}
			</div>
		</div>
	{:else}
		{@const isoDate = parseDateToIso(date)}
		<article class="blog-post">
			<div class="blog-post__hero" aria-hidden="true">
				<DocsThumbnail {topic} {variant} />
			</div>

			<BlissPageHeader
				eyebrow={category || 'Bliss / Notes'}
				{title}
				{description}
				variant="blue"
				pill
			>
				{#snippet meta()}
					<div class="blog-post__meta">
						{#if isoDate}
							<time datetime={isoDate}>{date}</time>
						{:else}
							<span>{date}</span>
						{/if}
						{#if author}
							<span>{author}</span>
						{/if}
					</div>
				{/snippet}
			</BlissPageHeader>

			<div class="blog-post__content" use:copyCode>
				{#if children}
					{@render children()}
				{:else}
					{@html htmlContent}
				{/if}
			</div>
		</article>
	{/if}
</main>
