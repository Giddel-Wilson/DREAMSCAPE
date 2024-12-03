<script lang="ts">
	import { Star } from 'lucide-svelte';
	import { onMount } from 'svelte';

	interface MovieGenre {
		name: string;
	}

	interface MovieImage {
		jpg: {
			large_image_url: string;
		};
	}

	interface ApiMovie {
		title: string;
		score: number;
		duration: string;
		year: number;
		images: MovieImage;
		genres: MovieGenre[];
	}

	interface Movie {
		title: string;
		rating: number;
		duration: string;
		year: number;
		image: string;
		genres: string[];
	}

	let movies: Movie[] = [];
	let loading = true;
	let error: Error | null = null;

	const genres = ['All', 'Action', 'Adventure', 'Fantasy', 'Romance', 'Supernatural'];
	let selectedGenre = 'All';

	onMount(async () => {
		try {
			const response = await fetch('https://api.jikan.moe/v4/anime?type=Movie&limit=24');
			const data = await response.json();
			movies = data.data.map((movie: ApiMovie) => ({
				title: movie.title,
				rating: movie.score,
				duration: movie.duration,
				year: movie.year,
				image: movie.images.jpg.large_image_url,
				genres: movie.genres.map(g => g.name)
			}));
		} catch (e) {
			error = e instanceof Error ? e : new Error('Unknown error occurred');
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
					<span class="text-red-500">WATCH</span> HISTORY
					<span class="text-sm text-red-500 ml-2 font-normal">視 聴 履 歴</span>
				</h1>
				<div class="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-gradient-to-r from-red-500 to-transparent"></div>
			</div>
		</div>
		<p class="text-gray-400 text-sm tracking-wide uppercase">Relive Your Epic Adventures</p>
	</div>

	<div class="flex gap-2 overflow-x-auto">
		{#each genres as genre}
			<button
				class="flex-none rounded-full px-6 py-2 text-sm font-medium transition-colors {selectedGenre === genre
					? 'bg-red-500 text-white'
					: 'bg-[#1a0f0f] text-gray-400 hover:bg-[#2a1f1f]'}"
				on:click={() => (selectedGenre = genre)}
			>
				{genre}
			</button>
		{/each}
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
			<p class="text-red-500">Failed to load movies</p>
		</div>
	{:else}
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each movies.filter(movie => selectedGenre === 'All' || movie.genres.includes(selectedGenre)) as movie}
				<div class="overflow-hidden rounded-2xl bg-[#1a0f0f]">
					<div class="relative">
						<img src={movie.image} alt={movie.title} class="h-[300px] w-full object-cover" />
						<div
							class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1a0f0f] to-transparent p-4 pt-20"
						>
							<div class="flex items-center gap-2">
								<Star class="h-4 w-4 fill-yellow-500 text-yellow-500" />
								<span class="text-sm font-medium text-white">{movie.rating || 'N/A'}</span>
							</div>
						</div>
					</div>
					<div class="p-4">
						<h3 class="text-lg font-medium text-white">{movie.title}</h3>
						<div class="mt-2 flex items-center gap-4 text-sm text-gray-400">
							<span>{movie.duration || 'Unknown duration'}</span>
							<span>{movie.year || 'Year unknown'}</span>
						</div>
						<div class="mt-3 flex flex-wrap gap-2">
							{#each movie.genres as genre}
								<span class="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-500">
									{genre}
								</span>
							{/each}
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
