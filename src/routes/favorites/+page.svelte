<script lang="ts">
	import { Heart, Trash2 } from 'lucide-svelte';
	import { onMount } from 'svelte';

	interface AnimeItem {
		title: string;
		episodes: number | string;
		progress: number;
		image: string;
		lastWatched: string;
	}

	let favoriteAnime: AnimeItem[] = [];
	let loading = true;
	let error: Error | null = null;

	onMount(async () => {
		try {
			const response = await fetch('https://api.jikan.moe/v4/top/anime?limit=10');
			const data = await response.json();
			favoriteAnime = data.data.map((anime: any) => ({
				title: anime.title,
				episodes: anime.episodes || '?',
				progress: Math.floor(Math.random() * 100), // Simulated progress
				image: anime.images.jpg.image_url,
				lastWatched: ['1 day ago', '2 days ago', '3 days ago', '1 week ago'][Math.floor(Math.random() * 4)] // Simulated last watched
			}));
		} catch (e) {
			error = e instanceof Error ? e : new Error('An unknown error occurred');
		} finally {
			loading = false;
		}
	});
</script>

<div class="space-y-8 p-4 relative">
	<div class="relative z-10">
		<div class="flex items-center justify-between mb-2">
			<div class="relative">
				<h1 class="text-4xl font-bold text-white relative z-10 tracking-wider">
					<span class="text-red-500">MY</span> FAVORITES
					<span class="text-sm text-red-500 ml-2 font-normal">お気に入り</span>
				</h1>
				<div class="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-gradient-to-r from-red-500 to-transparent"></div>
			</div>
			<div class="flex items-center gap-4">
				<span class="text-sm text-gray-400">{favoriteAnime.length} items</span>
				<button
					class="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/20"
				>
					<Heart class="h-4 w-4" />
					Add New
				</button>
			</div>
		</div>
		<p class="text-gray-400 text-sm tracking-wide uppercase">Your Personal Anime Collection</p>
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
		<div class="flex h-[50vh] items-center justify-center">
			<p class="text-red-500">Failed to load favorites: {error.message}</p>
		</div>
	{:else}
		<div class="space-y-4">
			{#each favoriteAnime as anime}
				<div class="flex items-center gap-4 rounded-2xl bg-[#1a0f0f] p-4">
					<img src={anime.image} alt={anime.title} class="h-24 w-24 rounded-xl object-cover" />
					<div class="flex-1">
						<h3 class="text-lg font-medium text-white">{anime.title}</h3>
						<div class="mt-2 flex items-center gap-4 text-sm text-gray-400">
							<span>{anime.episodes} episodes</span>
							<span>Last watched {anime.lastWatched}</span>
						</div>
						<div class="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-700">
							<div
								class="h-full bg-red-500 transition-all"
								style="width: {anime.progress}%"
							></div>
						</div>
					</div>
					<button
						class="flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 hover:bg-white/10 hover:text-red-500"
					>
						<Trash2 class="h-5 w-5" />
					</button>
				</div>
			{/each}
		</div>
	{/if}
</div>
