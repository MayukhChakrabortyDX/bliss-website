<script lang="ts">
	import { tick } from 'svelte';

	interface Props {
		currentPath?: string;
	}

	let { currentPath = '/' }: Props = $props();

	let thumbRef = $state<HTMLElement | null>(null);
	let isScrollable = $state(false);
	let isVisible = $state(false);
	let isDragging = $state(false);
	let thumbHeight = $state(40);
	let thumbTop = $state(0);

	let hideTimer: ReturnType<typeof setTimeout> | null = null;
	let dragStartY = 0;
	let dragStartScrollY = 0;

	function scheduleHide(delay = 1100) {
		if (isDragging) return;
		if (hideTimer) clearTimeout(hideTimer);
		hideTimer = setTimeout(() => {
			if (!isDragging) {
				isVisible = false;
			}
		}, delay);
	}

	function showBriefly(delay = 1100) {
		isVisible = true;
		scheduleHide(delay);
	}

	function updateGeometry() {
		if (typeof window === 'undefined') return;
		const windowHeight = window.innerHeight;
		const docHeight = Math.max(
			document.documentElement.scrollHeight,
			document.body.scrollHeight
		);
		const maxScroll = docHeight - windowHeight;

		if (maxScroll <= 5) {
			isScrollable = false;
			isVisible = false;
			return;
		}

		isScrollable = true;

		const minHeight = 36;
		const maxHeight = windowHeight - 40;
		const calculatedHeight = Math.max(
			minHeight,
			Math.min(maxHeight, (windowHeight / docHeight) * windowHeight)
		);
		thumbHeight = calculatedHeight;

		const availableTrackHeight = windowHeight - calculatedHeight;
		const scrollY = Math.max(0, Math.min(window.scrollY, maxScroll));
		thumbTop = (scrollY / maxScroll) * availableTrackHeight;
	}

	function onScroll() {
		updateGeometry();
		showBriefly();
	}

	function onMouseMove(event: MouseEvent) {
		if (typeof window === 'undefined') return;
		if (window.innerWidth - event.clientX <= 72) {
			showBriefly(1400);
		}
	}

	function onThumbPointerMove(event: PointerEvent) {
		if (!isDragging) return;
		event.preventDefault();

		const windowHeight = window.innerHeight;
		const docHeight = Math.max(
			document.documentElement.scrollHeight,
			document.body.scrollHeight
		);
		const maxScroll = docHeight - windowHeight;
		const availableTrackHeight = windowHeight - thumbHeight;

		if (availableTrackHeight <= 0) return;

		const deltaY = event.clientY - dragStartY;
		const scrollRatio = maxScroll / availableTrackHeight;
		const targetScrollY = Math.max(0, Math.min(maxScroll, dragStartScrollY + deltaY * scrollRatio));

		window.scrollTo({
			top: targetScrollY,
			behavior: 'instant'
		});
	}

	function onThumbPointerUp(event: PointerEvent) {
		isDragging = false;
		if (thumbRef && thumbRef.hasPointerCapture(event.pointerId)) {
			thumbRef.releasePointerCapture(event.pointerId);
		}

		window.removeEventListener('pointermove', onThumbPointerMove);
		window.removeEventListener('pointerup', onThumbPointerUp);
		window.removeEventListener('pointercancel', onThumbPointerUp);

		scheduleHide(1000);
	}

	function onThumbPointerDown(event: PointerEvent) {
		event.preventDefault();
		event.stopPropagation();
		isDragging = true;
		isVisible = true;
		dragStartY = event.clientY;
		dragStartScrollY = window.scrollY;

		if (thumbRef) {
			thumbRef.setPointerCapture(event.pointerId);
		}

		window.addEventListener('pointermove', onThumbPointerMove);
		window.addEventListener('pointerup', onThumbPointerUp);
		window.addEventListener('pointercancel', onThumbPointerUp);
	}

	function onTrackPointerDown(event: PointerEvent) {
		if (event.target === thumbRef) return;
		event.preventDefault();

		const windowHeight = window.innerHeight;
		const docHeight = Math.max(
			document.documentElement.scrollHeight,
			document.body.scrollHeight
		);
		const maxScroll = docHeight - windowHeight;
		const clickY = event.clientY;
		const targetRatio = clickY / windowHeight;
		const targetScrollY = Math.max(0, Math.min(maxScroll, targetRatio * maxScroll));

		window.scrollTo({
			top: targetScrollY,
			behavior: 'smooth'
		});
		showBriefly();
	}

	$effect(() => {
		currentPath;
		tick().then(() => {
			updateGeometry();
			showBriefly(800);
		});

		return () => {
			if (hideTimer) clearTimeout(hideTimer);
			if (typeof window !== 'undefined') {
				window.removeEventListener('pointermove', onThumbPointerMove);
				window.removeEventListener('pointerup', onThumbPointerUp);
				window.removeEventListener('pointercancel', onThumbPointerUp);
			}
		};
	});
</script>

<svelte:window onscroll={onScroll} onresize={updateGeometry} onmousemove={onMouseMove} />

{#if isScrollable}
	<div
		class={['bliss-scrollbar', (isVisible || isDragging) && 'is-visible']
			.filter(Boolean)
			.join(' ')}
		role="presentation"
		aria-hidden="true"
		onpointerdown={onTrackPointerDown}
	>
		<div class="bliss-scrollbar__track">
			<div
				bind:this={thumbRef}
				class={['bliss-scrollbar__thumb', isDragging && 'is-dragging']
					.filter(Boolean)
					.join(' ')}
				role="presentation"
				style:height="{thumbHeight}px"
				style:transform="translateY({thumbTop}px)"
				onpointerdown={onThumbPointerDown}
			></div>
		</div>
	</div>
{/if}
