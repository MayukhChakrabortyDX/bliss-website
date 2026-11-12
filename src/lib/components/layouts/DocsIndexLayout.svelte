<script lang="ts">
	import { docsNavigation, type NavGroup } from '../../navigation';
	import BlissPageHeader from '../primitives/BlissPageHeader.svelte';
	import DocsThumbnail from '../assets/DocsThumbnail.svelte';

	interface Props {
		groups?: NavGroup[];
	}

	let { groups = docsNavigation }: Props = $props();
</script>

<main class="docs-index-shell">
	<BlissPageHeader
		eyebrow="Bliss / Docs"
		title="Documentation."
		description="Language semantics, compiler pipeline internals, and formal AST node specifications."
		variant="violet"
		pill
	/>

	<div class="docs-sections-grid">
		{#each groups as section (section.id)}
			<article class="docs-section-card docs-section-card--{section.variant}">
				<a
					href={section.link}
					class="docs-section-card__art-wrap"
					tabindex="-1"
					aria-hidden="true"
				>
					<DocsThumbnail topic={section.topic} variant={section.variant} />
				</a>

				<div class="docs-section-card__body">
					<div class="docs-section-card__meta">
						<span class="docs-section-card__badge">{section.badge}</span>
						<span class="docs-section-card__count">{section.items.length} chapters</span>
					</div>

					<h2 class="docs-section-card__title">{section.title}</h2>
					<p class="docs-section-card__description">{section.description}</p>

					<div class="docs-section-card__actions">
						<a
							href={section.link}
							class="bliss-button bliss-button--secondary docs-section-card__cta"
						>
							<span>Explore {section.label}</span>
							<span class="docs-section-card__cta-arrow" aria-hidden="true">→</span>
						</a>
					</div>
				</div>
			</article>
		{/each}
	</div>
</main>