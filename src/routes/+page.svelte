<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { ChevronRight, ChevronLeft } from 'lucide-svelte';
	import { isRightPanelExpanded } from '$lib/stores';
	import levi from '$lib/assets/levi.png';
	import deku from '$lib/assets/deku.png';
	import zenitsu from '$lib/assets/zenitsu.png';
	import sukuna from '$lib/assets/sukuna.png';
	import luffy from '$lib/assets/luffy.png';
	import Marquee from '$lib/components/ui/marquee.svelte';

	interface AnimeImages {
		jpg: {
			image_url: string;
		};
	}

	interface ApiAnime {
		title: string;
		episodes: number | null;
		aired: {
			from: string;
		};
		season: string | null;
		status: string;
		images: AnimeImages;
	}

	interface TopAnime {
		title: string;
		episodes: string | number;
		date: number;
		year: string;
		status: string;
		image: string;
	}

	interface PopularAnime {
		title: string;
		episodes: string | number;
		image: string;
	}

	interface Slide {
		title: string;
		japaneseTitle: string;
		episodes: number;
		image: string;
		isNew: boolean;
		class: string;
	}

	let currentSlide = 0;
	let timer: ReturnType<typeof setInterval>;

	// Data stores with proper types
	let topAnimeList: TopAnime[] = [];
	let popularAnimeList: PopularAnime[] = [];

	const slides: Slide[] = [
		{
			title: 'Attack on Titan: Final season 2',
			japaneseTitle: '進撃の巨人 The Final Season Part 2',
			episodes: 12,
			image: levi,
			isNew: true,
			class:
				'absolute right-10 top-1/2 h-[130%] w-auto max-w-none -translate-y-1/2 translate-x-[20%] object-cover'
		},
		{
			title: 'My Hero Academia: Season 5',
			japaneseTitle: '僕のヒーローアカデミア 5期',
			episodes: 25,
			image: deku,
			isNew: false,
			class:
				'absolute right-12 top-1/2 h-[140%] w-auto max-w-none -translate-y-1/2 translate-x-[20%] object-cover'
		},
		{
			title: 'Demon Slayer: Entertainment District Arc',
			japaneseTitle: '鬼滅の刃 遊郭編',
			episodes: 11,
			image: zenitsu,
			isNew: true,
			class:
				'absolute right-28 top-1/2 h-[100%] w-auto max-w-none -translate-y-1/2 translate-x-[20%] object-cover'
		},
		{
			title: 'Jujutsu Kaisen 0',
			japaneseTitle: '劇場版 呪術廻戦 0',
			episodes: 1,
			image: sukuna,
			isNew: true,
			class:
				'absolute right-20 top-48 h-[140%] w-auto max-w-none -translate-y-1/2 translate-x-[20%] object-cover'
		},
		{
			title: 'One Piece: Wano Arc',
			japaneseTitle: 'ワノ国編',
			episodes: 51,
			image: luffy,
			isNew: false,
			class:
				'absolute right-12 top-64 h-[140%] w-auto max-w-none -translate-y-1/2 translate-x-[20%] object-cover'
		}
	];

	async function fetchTopAnime() {
		try {
			const response = await fetch('https://api.jikan.moe/v4/top/anime?limit=3');
			const data = await response.json();
			topAnimeList = data.data.map((anime: ApiAnime) => ({
				title: anime.title,
				episodes: anime.episodes || '?',
				date: new Date(anime.aired.from).getFullYear(),
				year: anime.season || 'Unknown',
				status: anime.status,
				image: anime.images.jpg.image_url
			}));
		} catch (error) {
			console.error('Error fetching top anime:', error);
		}
	}

	async function fetchPopularAnime() {
		try {
			const response = await fetch(
				'https://api.jikan.moe/v4/top/anime?filter=bypopularity&limit=10'
			);
			const data = await response.json();
			popularAnimeList = data.data.map((anime: ApiAnime) => ({
				title: anime.title,
				episodes: anime.episodes || '?',
				image: anime.images.jpg.image_url
			}));
		} catch (error) {
			console.error('Error fetching popular anime:', error);
		}
	}

	onMount(() => {
		fetchTopAnime();
		fetchPopularAnime();

		timer = setInterval(() => {
			currentSlide = (currentSlide + 1) % slides.length;
		}, 5000);
	});

	onDestroy(() => {
		if (timer) {
			clearInterval(timer);
		}
	});
</script>

<div class="flex flex-col space-y-6">
  <div class="w-full space-y-8 lg:w-[60vw] xl:w-[63vw] 2xl:w-[72vw]">
    <!-- Featured Anime Slider -->
    <div class="relative mt-4 w-full overflow-hidden rounded-2xl lg:rounded-[32px] bg-gradient-to-t from-[#580A0B] to-[#7A0A0B]">
      <div class="relative h-[40vh] sm:h-[50vh] md:h-[55vh] w-full lg:h-[60vh] lg:aspect-[21/9]">
        {#each slides as slide, index}
          <div class="absolute inset-0 transition-opacity duration-500 {currentSlide === index ? 'opacity-100' : 'opacity-0'}">
            <div class="absolute inset-0 overflow-hidden">
              <img src={slide.image} alt={slide.title} class={slide.class} />
            </div>
            <div class="absolute inset-0 bg-gradient-to-r from-[#1a0f0f] via-[#1a0f0f]/90 to-transparent sm:via-[#1a0f0f]/80">
              <div class="flex h-full flex-col justify-center p-4 sm:p-6 md:p-8 lg:p-12">
                {#if slide.isNew}
                  <div class="w-fit rounded bg-red-500 px-2 py-1 text-[10px] sm:text-xs font-mono uppercase tracking-wider">
                    NEW // 新作
                  </div>
                {/if}
                <h1 class="mt-2 sm:mt-4 text-2xl sm:text-3xl md:text-4xl font-bold w-[80%] sm:w-[70%] md:w-[60%] lg:w-[25vw]">
                  {slide.title}
                  <span class="block text-xs sm:text-sm text-red-500 mt-1 font-normal">{slide.japaneseTitle || ''}</span>
                </h1>
                <div
                  class="mt-4 sm:mt-6 md:mt-8 lg:mt-10 flex w-max items-center justify-between gap-3 sm:gap-4 md:gap-6 rounded-xl bg-[#3D0707] p-1"
                >
                  <span class="px-2 sm:px-3 text-xs sm:text-sm text-gray-300">{slide.episodes} episodes</span>
                  <button class="rounded-xl bg-red-600 px-4 sm:px-6 md:px-8 py-2 sm:py-3 text-sm sm:text-base font-medium hover:bg-red-700">
                    Watch
                  </button>
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
      <div class="absolute bottom-4 sm:bottom-6 left-1/2 flex -translate-x-1/2 gap-1">
        {#each slides as _, index}
          <div
            class="h-1 w-4 sm:w-6 md:w-8 rounded-full {currentSlide === index ? 'bg-white' : 'bg-white/20'}"
          ></div>
        {/each}
      </div>
    </div>
  </div>

  <!-- Top 3 and Most Popular -->
  <div
    class="flex h-full w-full flex-col-reverse lg:flex-row lg:items-center lg:space-x-8"
    class:lg:w-full={!$isRightPanelExpanded}
    class:lg:w-[calc(100%-30rem)]={$isRightPanelExpanded}
    class:lg:z-40={!$isRightPanelExpanded}
    class:lg:z-20={$isRightPanelExpanded}
  >
    <!-- Top of the Week -->
    <div class="mb-20 mt-8 w-full rounded-2xl bg-[#1a0f0f] p-8 md:mb-24 lg:mb-0 lg:mt-0 lg:w-[30%]">
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-xl font-bold text-white relative z-10 tracking-wider flex items-center">
			Top 3 of the week
			<span class="text-sm text-red-500 ml-2 font-normal">トップ3</span>
			<div class="absolute -bottom-2 left-0 w-1/4 h-0.5 bg-gradient-to-r from-red-500 to-transparent"></div>
		</h2>
        <button class="rounded-full p-2 hover:bg-white/10">
          <ChevronRight class="h-5 w-5 text-gray-400" />
        </button>
      </div>

      <div class="space-y-6">
        {#each topAnimeList as anime}
          <div class="flex items-center gap-6">
            <img
              src={anime.image}
              alt={anime.title}
              class="h-14 w-14 shrink-0 rounded-xl object-cover"
            />
            <div class="min-w-0 flex-1">
              <h3 class="line-clamp-2 text-lg font-medium leading-snug text-white">
                {anime.title}
              </h3>
              <div class="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <span>{anime.episodes} episodes</span>
                <span>{anime.date}</span>
                <span>{anime.year}</span>
              </div>
            </div>
            <button
              class="shrink-0 rounded-full border border-red-500/20 bg-red-500/10 px-6 py-2.5 text-sm font-medium text-red-500"
            >
              {anime.status}
            </button>
          </div>
        {/each}
      </div>
    </div>

    <!-- Most Popular Anime -->
    <div class="space-y-4 lg:mt-8 bg-[#0A0A0A] lg:w-[60%]">
		<h2 class="text-xl font-bold text-white relative z-10 tracking-wider flex items-center">
			Most popular anime
			<span class="text-sm text-red-500 ml-2 font-normal">人気アニメ</span>
			<div class="absolute -bottom-2 left-0 w-1/4 h-0.5 bg-gradient-to-r from-red-500 to-transparent"></div>
		</h2>
      <div class="relative">
        <Marquee pauseOnHover={true} speed={40} className="py-4">
          {#each popularAnimeList as anime}
            <a href="./" class="w-[180px] flex-none">
              <div class="relative h-56 w-full">
                <img
                  src={anime.image}
                  alt={anime.title}
                  class="h-full w-full rounded-xl object-cover"
                />
              </div>
              <div class="mt-3">
                <h3 class="line-clamp-2 text-sm font-medium leading-snug text-white">
                  {anime.title}
                </h3>
                <p class="mt-1.5 text-xs text-gray-400">{anime.episodes} episodes</p>
              </div>
            </a>
          {/each}
        </Marquee>
      </div>
    </div>
  </div>
</div>

<style>
	.no-scrollbar {
		scrollbar-width: none;
		-ms-overflow-style: none;
	}
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}
</style>
