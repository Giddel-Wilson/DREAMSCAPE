<!-- Inspired by shadcn-svelte marquee -->
<script lang="ts">
  import { onMount } from 'svelte';
  
  export let pauseOnHover = false;
  export let direction: 'left' | 'right' = 'left';
  export let speed = 50;
  export let className = '';

  let container: HTMLDivElement;
  let content: HTMLDivElement;
  let isPaused = false;

  function getScrollAmount() {
    if (!container || !content) return 0;
    return direction === 'left'
      ? -content.offsetWidth
      : content.offsetWidth;
  }

  function addAnimation() {
    if (!content) return;

    const scrollAmount = getScrollAmount();
    const duration = Math.abs(scrollAmount) * speed;

    container.style.setProperty('--scroll-amount', `${scrollAmount}px`);
    container.style.setProperty('--duration', `${duration}ms`);
  }

  onMount(() => {
    addAnimation();
    window.addEventListener('resize', addAnimation);

    return () => {
      window.removeEventListener('resize', addAnimation);
    };
  });
</script>

<div
  class={`group relative overflow-hidden ${className}`}
  on:mouseenter={() => pauseOnHover && (isPaused = true)}
  on:mouseleave={() => pauseOnHover && (isPaused = false)}
  bind:this={container}
  role="region"
  aria-label="Scrolling content"
>
  <div
    class="flex min-w-full items-center gap-6 transition-[animation-play-state] duration-300"
    class:paused={isPaused}
    class:running={!isPaused}
    style="--direction: {direction === 'left' ? 'normal' : 'reverse'}"
    bind:this={content}
  >
    <slot />
  </div>
</div>

<style>
  .running {
    animation: marquee var(--duration) linear infinite;
    animation-direction: var(--direction);
    animation-play-state: running;
    will-change: transform;
  }

  .paused {
    animation: marquee var(--duration) linear infinite;
    animation-direction: var(--direction);
    animation-play-state: paused;
    will-change: transform;
  }

  @keyframes marquee {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(var(--scroll-amount));
    }
  }
</style>
