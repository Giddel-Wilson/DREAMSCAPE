<script lang="ts">
	import { page } from '$app/stores';
	import { isRightPanelExpanded } from '$lib/stores';
	import { onMount } from 'svelte';
	import {
		Search,
		Home,
		Newspaper,
		Bookmark,
		History,
		Settings,
		ChevronUp,
		ChevronDown,
		ChevronRight
	} from 'lucide-svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import logo from '$lib/assets/logo.png';
	import '../app.css';

	let searchQuery = '';
	let searchResults: any[] = [];
	let recommendedAnime: any[] = [];

	interface AnimeEntry {
		title: string;
		episodes: number | null;
		images: {
			jpg: {
				image_url: string;
			};
		};
	}

	interface Recommendation {
		entry: [AnimeEntry, AnimeEntry];
	}

	async function fetchRecommendations() {
		try {
			// Using top anime endpoint instead of recommendations for more reliable data
			const response = await fetch('https://api.jikan.moe/v4/top/anime?limit=6');
			const data = await response.json();
			console.log('Raw anime data:', data.data[0]);
			recommendedAnime = data.data.map((anime: any) => {
				console.log('Processing anime:', anime);
				return {
					title: anime.title,
					episodes: anime.episodes !== null ? `${anime.episodes} ep` : 'Unknown ep',
					image: anime.images.jpg.image_url
				};
			});
			console.log('Processed recommendations:', recommendedAnime);
		} catch (error) {
			console.error('Error fetching recommendations:', error);
		}
	}

	onMount(() => {
		fetchRecommendations();
	});

	function toggleRightPanel() {
		isRightPanelExpanded.update(value => !value);
	}

	async function handleSearch() {
		if (searchQuery.length > 2) {
			const response = await fetch(`https://api.jikan.moe/v4/anime?q=${searchQuery}`);
			const data = await response.json();
			searchResults = data.data;
		} else {
			searchResults = [];
		}
	}

	let popularList = [
		{ title: 'Black Clover: The Movie', episodes: 8 },
		{ title: 'The Disastrous Life of Saiki K.', episodes: 24 },
		{ title: 'ToraDora!', episodes: 24 },
		{ title: 'Black Clover: The Movie', episodes: 8 },
		{ title: 'The Disastrous Life of Saiki K.', episodes: 24 },
		{ title: 'ToraDora!', episodes: 24 }
	];

	let topList = [
		{ title: 'Bunny girl senpai', episodes: 12, date: '13 nov', year: '2018', status: 'Watch' },
		{ title: 'Jujutsu Kaisen', episodes: 24, date: '10 dec', year: '2020', status: 'Continue' },
		{ title: 'Chainsaw man', episodes: 24, date: '20 sep', year: '2021', status: 'Ongoing' }
	];

	$: showRightPanel = $page.url.pathname === '/';
</script>

<div class="flex min-h-screen flex-col-reverse bg-[#0a0a0a]">
	<!-- Left Sidebar -->
	<aside
		class="fixed z-30 bottom-0 left-0 flex h-max w-full translate-y-1 items-center bg-[#0a0a0a] pb-6 pt-2 shadow-lg lg:top-0 lg:h-full lg:w-[80px] lg:translate-y-0 lg:flex-col lg:py-6 lg:pb-8 lg:pt-6"
	>
	<div class="relative mb-12 hidden lg:block">
		<img src={logo} alt="Anime App" class="h-full w-full rounded-full object-cover border-2 border-red-500/30" />
		<div class="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] font-mono text-red-500/70">DREAMSCAPE_v1.0</div>
	</div>

		<nav
			class="flex w-full items-center justify-evenly lg:flex-1 lg:flex-col lg:justify-normal lg:gap-8"
		>
			<a href="/" class="group hidden flex-col items-center lg:flex lg:gap-1">
				<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white">
					<Home class="h-5 w-5" />
				</div>
				<span class="text-xs text-gray-400 group-hover:text-white">Home</span>
			</a>

			<a href="/" class="group flex flex-col items-center lg:hidden lg:gap-1">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 hover:bg-white/10"
				>
					<Home class="h-5 w-5" />
				</div>
				<span class="text-xs text-gray-400 group-hover:text-white">News</span>
			</a>
			<a href="/news" class="group flex flex-col items-center lg:gap-1">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 hover:bg-white/10"
				>
					<Newspaper class="h-5 w-5" />
				</div>
				<span class="text-xs text-gray-400 group-hover:text-white">News</span>
			</a>
			<a href="/favorites" class="group flex flex-col items-center lg:gap-1">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 hover:bg-white/10"
				>
					<Bookmark class="h-5 w-5" />
				</div>
				<span class="text-xs text-gray-400 group-hover:text-white">Favorites</span>
			</a>
			<a href="/history" class="group flex flex-col items-center lg:gap-1">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 hover:bg-white/10"
				>
					<History class="h-5 w-5" />
				</div>
				<span class="text-xs text-gray-400 group-hover:text-white">History</span>
			</a>
		</nav>

		<div class="mt-auto hidden items-center gap-6 lg:flex lg:flex-col">
			<a href="/settings" class="group flex flex-col items-center lg:gap-1">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 hover:bg-white/10"
				>
					<Settings class="h-5 w-5" />
				</div>
				<span class="text-xs text-gray-400 group-hover:text-white">Settings</span>
			</a>
			<button class="h-10 w-10 overflow-hidden rounded-full bg-white/10">
				<img
					src="https://i.pinimg.com/236x/83/4f/e6/834fe637588ed7ccca41c0ebd659e855.jpg"
					alt="Profile"
					class="h-full w-full object-cover"
				/>
			</button>
		</div>
	</aside>

	<!-- Main Content Area -->
	<div
		class="flex h-full flex-1 flex-col justify-center space-y-6 overflow-x-hidden px-3 md:px-5 lg:justify-normal lg:p-2"
	>
		<div class="flex h-full">
			<!-- Scrollable Content Area -->
			<div class="z-20 flex-1 lg:ml-[72px]">
				<!-- Static Search Bar -->
				<div
					class="sticky top-0 z-30 flex h-20 w-max items-center bg-[#0a0a0a]/80 backdrop-blur lg:px-6"
				>
					<div class="relative mt-3 lg:w-[400px]">
						<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
						<input
							type="search"
							bind:value={searchQuery}
							on:input={handleSearch}
							placeholder="Search anime..."
							class="w-full rounded-full bg-white/10 py-2 pl-10 pr-4 text-sm text-white placeholder-gray-400 outline-none ring-1 ring-white/10 focus:ring-2"
						/>
						{#if searchResults.length > 0}
							<ScrollArea class="absolute h-80 mt-2 w-full rounded-2xl bg-[#1a0f0f] p-4 shadow-2xl">
								{#each searchResults as result}
									<a
										href="/anime/{result.mal_id}"
										class="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-white/10"
									>
										<img
											src={result.images.jpg.image_url}
											alt={result.title}
											class="h-12 w-12 rounded-lg object-cover"
										/>
										<div>
											<h3 class="font-medium text-white">{result.title}</h3>
											<p class="text-sm text-gray-400">
												{result.episodes} episodes • {result.status}
											</p>
										</div>
									</a>
								{/each}
							</ScrollArea>
						{/if}
					</div>
				</div>

				<!-- Scrollable Content -->
				<ScrollArea class="h-[calc(100vh-5rem)] w-full">
					<div class="flex-1 lg:px-10 2xl:px-6">
						<slot />
					</div>
				</ScrollArea>
			</div>
		</div>

	</div>

	{#if showRightPanel}
		<!-- Right Sidebar -->
		<div class="fixed right-2 top-2 z-30 hidden flex-col justify-between overflow-hidden overflow-y-auto rounded-xl p-6 lg:flex lg:w-1/4 2xl:w-96"
			class:h={!$isRightPanelExpanded}
			class:block={$isRightPanelExpanded}
		>
			<aside
				class="fixed right-2 top-2 flex-col justify-between overflow-hidden overflow-y-auto rounded-xl bg-[#3D0707] p-6 lg:flex lg:w-1/4 2xl:w-96"
				class:lg:h-[76vh]={!$isRightPanelExpanded}
				class:xl:h-[72vh]={!$isRightPanelExpanded}
				class:2xl:h-[70vh]={!$isRightPanelExpanded}
				class:h-[98.5vh]={$isRightPanelExpanded}
			>
				<div class="overflow-y-hidden">
					<div class="flex items-center justify-between">
						<h2 class="mb-3 mt-3 text-lg font-medium text-white">Recommendations</h2>
						<button class="rounded-full p-1 hover:bg-white/10" on:click={toggleRightPanel}>
							{#if $isRightPanelExpanded}
								<ChevronUp class="h-4 w-4" />
							{:else}
								<ChevronDown class="h-4 w-4" />
							{/if}
						</button>
					</div>

					<div class="mt-4">
						<div class="rounded-2xl bg-red-600/20 p-4">
							<p class="text-sm text-gray-300">Your last anime</p>
							<div class="mt-2 flex items-center justify-between">
								<span class="font-medium text-white">Jujutsu Kaisen</span>
								<div class="flex items-center gap-2">
									<span class="text-sm text-gray-300">21 ep</span>
									<ChevronRight class="h-4 w-4 text-gray-300" />
								</div>
							</div>
						</div>
					</div>

					<!-- Categories -->
					{#each ['Movies', 'Anime'] as category}
						<div class="mt-8">
							<h3 class="mb-4 text-sm font-medium text-gray-300">{category}</h3>
							<div class="space-y-4">
								{#each recommendedAnime.slice(0, 3) as anime}
									<div class="flex items-center gap-3">
										<img src={anime.image} alt={anime.title} class="h-12 w-12 rounded-lg object-cover" />
										<div class="flex-1 min-w-0">
											<h4 class="text-sm font-medium text-white line-clamp-2">{anime.title}</h4>
											<p class="text-xs text-gray-400">{anime.episodes}</p>
										</div>
										<div class="flex text-xs lg:gap-1 shrink-0">
											<span>⭐️</span>
											<span>💭</span>
											<span>❤️</span>
										</div>
									</div>
								{/each}
							</div>
						</div>
					{/each}
				</div>

				<!-- Recommendation Input -->
				<div
					class="relative mt-8 flex items-center gap-2 rounded-full border border-white/10 text-sm text-gray-400"
				>
					<input
						type="search"
						placeholder="Give your own recommendation..."
						class="h-full w-full rounded-full bg-transparent p-4 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-red-500"
					/>
					<button class="absolute right-4 ml-auto rounded-full bg-white/10 p-2 hover:bg-white/20">
						<ChevronRight class="h-4 w-4" />
					</button>
				</div>
			</aside>
		</div>
	{/if}
</div>

<style lang="postcss">
	:global(body) {
		@apply bg-[#0a0a0a] text-white;
	}
</style>
