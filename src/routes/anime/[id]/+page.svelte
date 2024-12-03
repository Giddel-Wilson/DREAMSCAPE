<script lang="ts">
	import { page } from '$app/stores';
	import { Play, Star, Heart, Share2, Plus } from 'lucide-svelte';
	import { onMount } from 'svelte';

	interface AnimeStudio {
		name: string;
	}

	interface AnimeGenre {
		name: string;
	}

	interface AnimeDetails {
		title: string;
		images: {
			jpg: {
				large_image_url: string;
			};
		};
		score: number | null;
		episodes: number;
		duration: string;
		year: number | null;
		synopsis: string;
		type: string;
		status: string;
		season: string | null;
		studios: AnimeStudio[];
		genres: AnimeGenre[];
		rating: string | null;
		id: number;
	}

	let anime: AnimeDetails | null = null;
	let loading = true;
	let error: Error | null = null;

	onMount(async () => {
		try {
			const response = await fetch(`https://api.jikan.moe/v4/anime/${$page.params.id}`);
			const data = await response.json();
			anime = data.data;
		} catch (e) {
			error = e instanceof Error ? e : new Error('An unknown error occurred');
		} finally {
			loading = false;
		}
	});
</script>

{#if loading}
	<div class="flex h-[70vh] items-center justify-center">
		<div class="h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
	</div>
{:else if error}
	<div class="flex h-[70vh] items-center justify-center">
		<p class="text-red-500">Failed to load anime details</p>
	</div>
{:else if anime}
	<div class="space-y-8 p-4 relative">
		<div class="relative z-10">
			<div class="flex items-center justify-between mb-2">
				<div class="relative">
					<h1 class="text-4xl font-bold text-white relative z-10 tracking-wider">
						<span class="text-red-500">ANIME</span> DETAILS
						<span class="text-sm text-red-500 ml-2 font-normal">アニメの詳細</span>
					</h1>
					<div class="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-gradient-to-r from-red-500 to-transparent"></div>
				</div>
				<div class="flex items-center gap-2 text-sm text-gray-400 bg-[#1a0f0f] px-4 py-2 rounded-lg border border-red-500/20">
					<span class="font-mono">ID // {anime.id}</span>
				</div>
			</div>
			<p class="text-gray-400 text-sm tracking-wide uppercase">Explore Anime Universe In Detail</p>
		</div>

		<!-- Hero Section -->
		<div class="relative h-[50vh] w-full overflow-hidden rounded-[32px]">
			<img
				src={anime.images.jpg.large_image_url}
				alt={anime.title}
				class="h-full w-full object-cover"
			/>
			<div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent"></div>
			<div class="absolute bottom-0 left-0 right-0 p-8">
				<h1 class="text-4xl font-bold text-white">{anime.title}</h1>
				<div class="mt-4 flex items-center gap-6">
					<div class="flex items-center gap-2">
						<Star class="h-5 w-5 fill-yellow-500 text-yellow-500" />
						<span class="text-sm font-medium text-white">{anime.score || 'N/A'}</span>
					</div>
					<span class="text-sm text-gray-400">{anime.episodes} episodes</span>
					<span class="text-sm text-gray-400">{anime.duration}</span>
					<span class="text-sm text-gray-400">{anime.year || 'N/A'}</span>
				</div>
			</div>
		</div>

		<!-- Action Buttons -->
		<div class="flex items-center gap-4">
			<button
				class="flex items-center gap-2 rounded-xl bg-red-500 px-8 py-3 font-medium text-white hover:bg-red-600"
			>
				<Play class="h-5 w-5" />
				Watch Now
			</button>
			<button
				class="flex items-center gap-2 rounded-xl bg-red-500/10 px-8 py-3 font-medium text-red-500 hover:bg-red-500/20"
			>
				<Plus class="h-5 w-5" />
				Add to List
			</button>
			<button
				class="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20"
			>
				<Heart class="h-5 w-5" />
			</button>
			<button
				class="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20"
			>
				<Share2 class="h-5 w-5" />
			</button>
		</div>

		<!-- Synopsis -->
		<div class="space-y-4">
			<h2 class="text-2xl font-bold text-white">Synopsis</h2>
			<p class="text-gray-400">{anime.synopsis}</p>
		</div>

		<!-- Details -->
		<div class="space-y-4">
			<h2 class="text-2xl font-bold text-white">Details</h2>
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<div class="rounded-2xl bg-[#1a0f0f] p-4">
					<h3 class="text-sm font-medium text-gray-400">Type</h3>
					<p class="mt-1 text-white">{anime.type}</p>
				</div>
				<div class="rounded-2xl bg-[#1a0f0f] p-4">
					<h3 class="text-sm font-medium text-gray-400">Status</h3>
					<p class="mt-1 text-white">{anime.status}</p>
				</div>
				<div class="rounded-2xl bg-[#1a0f0f] p-4">
					<h3 class="text-sm font-medium text-gray-400">Season</h3>
					<p class="mt-1 text-white">{anime.season || 'N/A'}</p>
				</div>
				<div class="rounded-2xl bg-[#1a0f0f] p-4">
					<h3 class="text-sm font-medium text-gray-400">Studios</h3>
					<p class="mt-1 text-white">
						{anime.studios.map((s: AnimeStudio) => s.name).join(', ') || 'N/A'}
					</p>
				</div>
				<div class="rounded-2xl bg-[#1a0f0f] p-4">
					<h3 class="text-sm font-medium text-gray-400">Genres</h3>
					<p class="mt-1 text-white">
						{anime.genres.map((g: AnimeGenre) => g.name).join(', ')}
					</p>
				</div>
				<div class="rounded-2xl bg-[#1a0f0f] p-4">
					<h3 class="text-sm font-medium text-gray-400">Rating</h3>
					<p class="mt-1 text-white">{anime.rating || 'N/A'}</p>
				</div>
			</div>
		</div>
	</div>
{/if}
