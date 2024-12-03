<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { browser } from '$app/environment';
    import { Settings2, Monitor, Bell, PlayCircle, Languages, Shield, Download, Palette } from 'lucide-svelte';

    interface Setting {
        id: string;
        value: any;
        defaultValue: any;
    }

    const settings: Record<string, Setting> = {
        theme: { id: 'theme', value: 'dark', defaultValue: 'dark' },
        autoplay: { id: 'autoplay', value: false, defaultValue: false },
        notifications: { id: 'notifications', value: true, defaultValue: true },
        quality: { id: 'quality', value: 'Auto', defaultValue: 'Auto' },
        language: { id: 'language', value: 'Japanese', defaultValue: 'Japanese' },
        subtitles: { id: 'subtitles', value: 'English', defaultValue: 'English' },
        autoDownload: { id: 'autoDownload', value: false, defaultValue: false },
        nsfw: { id: 'nsfw', value: false, defaultValue: false },
        accentColor: { id: 'accentColor', value: 'red', defaultValue: 'red' }
    };

    const qualityOptions = ['Auto', '1080p', '720p', '480p', '360p'];
    const languageOptions = ['Japanese', 'English', 'Chinese', 'Korean'];
    const subtitleOptions = ['English', 'Spanish', 'French', 'German', 'Off'];
    const accentColors = ['red', 'blue', 'green', 'purple', 'pink'];

    onMount(() => {
        if (browser) {
            Object.keys(settings).forEach(key => {
                const stored = localStorage.getItem(`setting_${key}`);
                if (stored !== null) {
                    settings[key].value = JSON.parse(stored);
                }
            });
        }
    });

    function handleCheckboxChange(e: Event, key: string) {
        const target = e.target as HTMLInputElement;
        saveSetting(key, target.checked);
    }

    function handleSelectChange(e: Event, key: string) {
        const target = e.target as HTMLSelectElement;
        saveSetting(key, target.value);
    }

    function saveSetting(key: string, value: any) {
        if (browser) {
            settings[key].value = value;
            localStorage.setItem(`setting_${key}`, JSON.stringify(value));
        }
    }

    function resetSettings() {
        if (browser) {
            Object.keys(settings).forEach(key => {
                settings[key].value = settings[key].defaultValue;
                localStorage.setItem(`setting_${key}`, JSON.stringify(settings[key].defaultValue));
            });
        }
    }
</script>

<div class="space-y-8 p-4 relative min-h-screen" in:fade={{ duration: 300 }}>
    <div class="relative z-10">
        <div class="flex items-center justify-between mb-2">
            <div class="relative">
                <h1 class="text-4xl font-bold text-white relative z-10 tracking-wider">
                    <span class="text-red-500">SYSTEM</span> SETTINGS
                    <span class="text-sm text-red-500 ml-2 font-normal">システム設定</span>
                </h1>
                <div class="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-gradient-to-r from-red-500 to-transparent"></div>
            </div>
            <button 
                class="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg border border-red-500/20 hover:bg-red-500/20 transition-colors duration-300"
                on:click={resetSettings}
            >
                Reset All // リセット
            </button>
        </div>
        <p class="text-gray-400 text-sm tracking-wide uppercase">Customize Your Anime Experience</p>
    </div>

    <div class="grid gap-6 lg:grid-cols-2" transition:fade={{ duration: 400 }}>
        <!-- Appearance -->
        <div class="rounded-2xl bg-[#1a0f0f] p-6 border border-red-500/20">
            <div class="flex items-center gap-3 mb-6">
                <Palette class="h-6 w-6 text-red-500" />
                <h2 class="text-2xl font-bold text-white">Appearance</h2>
            </div>
            <div class="space-y-4">
                <div class="flex items-center justify-between">
                    <span class="text-gray-300">Theme</span>
                    <label class="relative inline-flex cursor-pointer items-center">
                        <input 
                            type="checkbox" 
                            checked={settings.theme.value === 'dark'}
                            on:change={(e) => handleCheckboxChange(e, 'theme')}
                            class="peer sr-only"
                        >
                        <div class="peer h-6 w-11 rounded-full bg-gray-600 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-red-500 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                    </label>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-gray-300">Accent Color</span>
                    <select 
                        bind:value={settings.accentColor.value} 
                        on:change={(e) => handleSelectChange(e, 'accentColor')}
                        class="rounded-lg bg-gray-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        {#each accentColors as color}
                            <option value={color}>{color.charAt(0).toUpperCase() + color.slice(1)}</option>
                        {/each}
                    </select>
                </div>
            </div>
        </div>

        <!-- Playback -->
        <div class="rounded-2xl bg-[#1a0f0f] p-6 border border-red-500/20">
            <div class="flex items-center gap-3 mb-6">
                <PlayCircle class="h-6 w-6 text-red-500" />
                <h2 class="text-2xl font-bold text-white">Playback</h2>
            </div>
            <div class="space-y-4">
                <div class="flex items-center justify-between">
                    <span class="text-gray-300">Autoplay Next Episode</span>
                    <label class="relative inline-flex cursor-pointer items-center">
                        <input 
                            type="checkbox" 
                            checked={settings.autoplay.value}
                            on:change={(e) => handleCheckboxChange(e, 'autoplay')}
                            class="peer sr-only"
                        >
                        <div class="peer h-6 w-11 rounded-full bg-gray-600 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-red-500 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                    </label>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-gray-300">Video Quality</span>
                    <select 
                        bind:value={settings.quality.value} 
                        on:change={(e) => handleSelectChange(e, 'quality')}
                        class="rounded-lg bg-gray-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        {#each qualityOptions as quality}
                            <option value={quality}>{quality}</option>
                        {/each}
                    </select>
                </div>
            </div>
        </div>

        <!-- Language -->
        <div class="rounded-2xl bg-[#1a0f0f] p-6 border border-red-500/20">
            <div class="flex items-center gap-3 mb-6">
                <Languages class="h-6 w-6 text-red-500" />
                <h2 class="text-2xl font-bold text-white">Language</h2>
            </div>
            <div class="space-y-4">
                <div class="flex items-center justify-between">
                    <span class="text-gray-300">Audio Language</span>
                    <select 
                        bind:value={settings.language.value} 
                        on:change={(e) => handleSelectChange(e, 'language')}
                        class="rounded-lg bg-gray-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        {#each languageOptions as language}
                            <option value={language}>{language}</option>
                        {/each}
                    </select>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-gray-300">Subtitles</span>
                    <select 
                        bind:value={settings.subtitles.value} 
                        on:change={(e) => handleSelectChange(e, 'subtitles')}
                        class="rounded-lg bg-gray-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        {#each subtitleOptions as subtitle}
                            <option value={subtitle}>{subtitle}</option>
                        {/each}
                    </select>
                </div>
            </div>
        </div>

        <!-- Content -->
        <div class="rounded-2xl bg-[#1a0f0f] p-6 border border-red-500/20">
            <div class="flex items-center gap-3 mb-6">
                <Shield class="h-6 w-6 text-red-500" />
                <h2 class="text-2xl font-bold text-white">Content</h2>
            </div>
            <div class="space-y-4">
                <div class="flex items-center justify-between">
                    <span class="text-gray-300">Auto-Download Episodes</span>
                    <label class="relative inline-flex cursor-pointer items-center">
                        <input 
                            type="checkbox" 
                            checked={settings.autoDownload.value}
                            on:change={(e) => handleCheckboxChange(e, 'autoDownload')}
                            class="peer sr-only"
                        >
                        <div class="peer h-6 w-11 rounded-full bg-gray-600 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-red-500 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                    </label>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-gray-300">Show NSFW Content</span>
                    <label class="relative inline-flex cursor-pointer items-center">
                        <input 
                            type="checkbox" 
                            checked={settings.nsfw.value}
                            on:change={(e) => handleCheckboxChange(e, 'nsfw')}
                            class="peer sr-only"
                        >
                        <div class="peer h-6 w-11 rounded-full bg-gray-600 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-red-500 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                    </label>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    :global(body) {
        background-color: black;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
</style>
