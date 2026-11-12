<script lang="ts">
	interface Props {
		isNavigating?: boolean;
	}

	let { isNavigating = false }: Props = $props();

	let isVisible = $state(false);
	let progress = $state(0);

	let progressTimer: number | undefined;
	let finishTimer: number | undefined;
	let hideTimer: number | undefined;
	let maxTimer: number | undefined;
	let startedAt = 0;

	function clearTimers() {
		if (typeof window === 'undefined') return;
		if (progressTimer !== undefined) window.clearInterval(progressTimer);
		if (finishTimer !== undefined) window.clearTimeout(finishTimer);
		if (hideTimer !== undefined) window.clearTimeout(hideTimer);
		if (maxTimer !== undefined) window.clearTimeout(maxTimer);
		progressTimer = undefined;
		finishTimer = undefined;
		hideTimer = undefined;
		maxTimer = undefined;
	}

	function start() {
		if (typeof window === 'undefined') return;
		clearTimers();
		isVisible = true;
		progress = 12;
		startedAt = performance.now();
		progressTimer = window.setInterval(() => {
			progress = Math.min(progress + (84 - progress) * 0.08, 84);
		}, 120);
		maxTimer = window.setTimeout(() => {
			finish();
		}, 8000);
	}

	function finish() {
		if (typeof window === 'undefined' || !isVisible) return;
		if (progressTimer !== undefined) window.clearInterval(progressTimer);
		if (maxTimer !== undefined) window.clearTimeout(maxTimer);
		progressTimer = undefined;
		maxTimer = undefined;
		const remainingTime = Math.max(0, 320 - (performance.now() - startedAt));
		finishTimer = window.setTimeout(() => {
			progress = 100;
			finishTimer = undefined;
			hideTimer = window.setTimeout(() => {
				isVisible = false;
				progress = 0;
				hideTimer = undefined;
			}, 220);
		}, remainingTime);
	}

	$effect(() => {
		if (isNavigating) {
			start();
		} else {
			finish();
		}
		return () => {
			clearTimers();
		};
	});
</script>

<div
	class={['route-progress', isVisible && 'is-visible'].filter(Boolean).join(' ')}
	style:width="{progress}%"
	aria-hidden="true"
></div>
