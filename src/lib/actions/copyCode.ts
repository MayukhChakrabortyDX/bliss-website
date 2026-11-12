import type { Action } from 'svelte/action';

/**
 * Svelte action that wires VitePress-style `.copy` buttons inside rendered markdown containers.
 */
export const copyCode: Action<HTMLElement> = (node) => {
	const timers = new WeakMap<HTMLButtonElement, ReturnType<typeof setTimeout>>();

	async function handleClick(event: MouseEvent) {
		const target = event.target as HTMLElement | null;
		const button = target?.closest<HTMLButtonElement>('button.copy');
		if (!button || !node.contains(button)) return;

		const container = button.closest('div[class*="language-"]');
		const codeEl = container?.querySelector('pre code');
		const text = codeEl?.textContent ?? '';
		if (!text) return;

		try {
			await navigator.clipboard.writeText(text);
			button.classList.add('copied');
			const existing = timers.get(button);
			if (existing) clearTimeout(existing);
			const timer = setTimeout(() => {
				button.classList.remove('copied');
				timers.delete(button);
			}, 2000);
			timers.set(button, timer);
		} catch {
			// Ignore clipboard permission errors in restricted contexts
		}
	}

	node.addEventListener('click', handleClick);

	return {
		destroy() {
			node.removeEventListener('click', handleClick);
		}
	};
};
