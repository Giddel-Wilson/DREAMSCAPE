<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import { formatDistanceToNow } from 'date-fns';
  import { Clock, ExternalLink } from 'lucide-svelte';

  interface AnimeNews {
    title: string;
    date: string;
    author_username: string;
    forum_url: string;
    images: {
      jpg: {
        image_url: string;
      };
    };
    excerpt: string;
  }

  let news: AnimeNews[] = [];
  let loading = true;
  let error: string | null = null;
  let retryCount = 0;
  let refreshInterval: ReturnType<typeof setInterval>;
  const MAX_RETRIES = 3;
  const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

  async function fetchNews(silent = false) {
    if (!silent) loading = true;
    
    try {
      const response = await fetch('/api/news');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch news');
      }
      
      const hasNewContent = !news.length || 
        JSON.stringify(data) !== JSON.stringify(news);

      if (hasNewContent) {
        news = data;
      }
      
      loading = false;
      error = null;
      retryCount = 0;
    } catch (e) {
      console.error('Error fetching news:', e);
      if (retryCount < MAX_RETRIES) {
        retryCount++;
        setTimeout(() => fetchNews(silent), 1000 * Math.pow(2, retryCount));
      } else {
        error = e instanceof Error ? e.message : 'An error occurred while fetching news';
        loading = false;
      }
    }
  }

  function startAutoRefresh() {
    stopAutoRefresh();
    refreshInterval = setInterval(() => {
      fetchNews(true);
    }, REFRESH_INTERVAL);
  }

  function stopAutoRefresh() {
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }
  }

  onMount(() => {
    fetchNews();
    startAutoRefresh();
  });

  onDestroy(() => {
    stopAutoRefresh();
  });
</script>

<div class="space-y-8 p-4 relative">
  <div class="relative z-10">
    <div class="flex items-center justify-between mb-2">
      <div class="relative">
        <h1 class="text-4xl font-bold text-white relative z-10 tracking-wider">
          <span class="text-red-500">ANIME</span> NEWS
          <span class="text-sm text-red-500 ml-2 font-normal">アニメニュース</span>
        </h1>
        <div class="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-gradient-to-r from-red-500 to-transparent"></div>
      </div>
      {#if !loading && !error}
        <div class="flex items-center gap-2 text-sm text-gray-400 bg-[#1a0f0f] px-4 py-2 rounded-lg border border-red-500/20">
          <Clock class="h-4 w-4" />
          <span class="font-mono">AUTO-SYNC // 5分</span>
        </div>
      {/if}
    </div>
    <p class="text-gray-400 text-sm tracking-wide uppercase">Latest Updates From The Anime Universe</p>
  </div>

  {#if loading}
    <div class="flex h-[50vh] items-center justify-center">
      <div class="relative">
        <div class="absolute inset-0 rounded-full bg-red-500/20 animate-ping"></div>
        <div class="relative h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
        <div class="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm text-red-500 font-mono">LOADING // ロード中</div>
      </div>
    </div>
  {:else if error}
    <div class="flex h-[40vh] flex-col items-center justify-center gap-4 rounded-2xl bg-[#1a0f0f] p-8 border border-red-500/20 relative overflow-hidden" transition:fade={{ duration: 300 }}>
      <div class="absolute top-0 right-0 p-2 text-red-500/20 font-mono text-xs">ERROR_CODE_01</div>
      <div class="text-center relative z-10">
        <p class="text-xl text-red-500 mb-2 font-mono uppercase tracking-wider">{error}</p>
        <p class="text-gray-400 font-light">システムエラーが発生しました</p>
      </div>
      <button 
        class="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#1a0f0f] uppercase tracking-wider font-mono"
        on:click={() => {
          loading = true;
          retryCount = 0;
          fetchNews();
        }}
      >
        Retry // 再試行
      </button>
    </div>
  {:else}
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3" transition:fade={{ duration: 400 }}>
      {#each news as item}
        <article 
          class="group relative overflow-hidden rounded-lg bg-[#1a0f0f] transition-all duration-300 hover:-translate-y-1 border border-red-500/10 hover:border-red-500/30"
        >
          <div class="absolute top-0 right-0 p-2 text-red-500/20 font-mono text-xs">NEWS_ID_{Math.random().toString(36).substr(2, 6)}</div>
          <div class="relative">
            <img 
              src={item.images.jpg.image_url} 
              alt="News thumbnail" 
              class="h-48 w-full object-cover object-c transition-transform duration-500 group-hover:scale-105"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-[#1a0f0f] to-transparent md:h-52"></div>
            <div class="absolute bottom-0 left-0 right-0 p-4">
              <div class="flex items-center gap-2 text-sm">
                <Clock class="h-4 w-4 text-gray-400" />
                <span class="text-gray-300 font-mono">{formatDistanceToNow(new Date(item.date))} ago</span>
              </div>
            </div>
          </div>
          <div class="p-4">
            <h2 class="text-xl font-medium text-white group-hover:text-red-500 transition-colors duration-300">
              <a 
                href={item.forum_url} 
                target="_blank" 
                rel="noopener noreferrer"
                class="hover:underline decoration-red-500/50"
              >
                {item.title}
              </a>
            </h2>
            <p class="mt-3 text-gray-400 line-clamp-3 font-light">
              {item.excerpt}
            </p>
            <a 
              href={item.forum_url} 
              target="_blank" 
              rel="noopener noreferrer"
              class="mt-4 inline-flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors duration-300 font-mono uppercase tracking-wide text-sm"
            >
              Read More // 続きを読む
              <ExternalLink class="h-4 w-4" />
            </a>
          </div>
          <div class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/20 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
        </article>
      {/each}
    </div>
  {/if}
</div>

<style>
  :global(body) {
    background-color: black;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  /* Cyberpunk-inspired glitch effect */
  @keyframes glitch {
    0% {
      clip-path: inset(50% 0 30% 0);
      transform: translate(-5px, 5px);
    }
    20% {
      clip-path: inset(15% 0 65% 0);
      transform: translate(5px, -5px);
    }
    40% {
      clip-path: inset(80% 0 5% 0);
      transform: translate(-5px, 5px);
    }
    60% {
      clip-path: inset(25% 0 60% 0);
      transform: translate(5px, -5px);
    }
    80% {
      clip-path: inset(70% 0 20% 0);
      transform: translate(-5px, 5px);
    }
    100% {
      clip-path: inset(50% 0 30% 0);
      transform: translate(0);
    }
  }

  article:hover::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,0,0,0.1), transparent);
    animation: glitch 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
    pointer-events: none;
  }
</style>
