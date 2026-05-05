<script lang="ts">
	import Logo from '$lib/assets/logo-light.svg';
	import Logoppikpm from '$lib/assets/ppikpm.svg';
	import { FileText, Search, LoaderCircle, Menu } from 'lucide-svelte';
	import { fly, fade } from 'svelte/transition';

	// 1. Definisikan Interface agar TypeScript tidak menganggap 'never'
	interface SearchResult {
		id: number;
		title: string;
		slug: string;
		excerpt: string | null;
		status: string;
		featured_image: {
			path: string;
			alt: string;
		};
		author: {
			name: string;
			avatar_url: string;
		};
	}

	let { isSidebarOpen = $bindable() } = $props();

	// State untuk scroll position
	let y = $state(0);

	// Threshold kapan logo navbar muncul (sesuaikan dengan tinggi div logo atas)
	const scrollThreshold = 96;

	let searchQuery = $state('');
	// 2. Berikan tipe eksplisit pada array state
	let searchResults = $state<SearchResult[]>([]);
	let isSearching = $state(false);
	let showDropdown = $state(false);

	// Variabel untuk menyimpan timer debounce
	let debounceTimer: ReturnType<typeof setTimeout>;

	async function performSearch() {
		if (searchQuery.length < 2) {
			searchResults = [];
			showDropdown = false;
			return;
		}

		isSearching = true;
		showDropdown = true;

		try {
			const response = await fetch(`/api/search?q=${searchQuery}`);
			if (response.ok) {
				searchResults = await response.json();
			}
		} catch (err) {
			console.error('Search failed', err);
		} finally {
			isSearching = false;
		}
	}

	// Fungsi handleInput yang akan memicu debounce
	function handleSearchInput() {
		// Hapus timer sebelumnya jika user masih mengetik
		clearTimeout(debounceTimer);

		if (searchQuery.length < 2) {
			searchResults = [];
			showDropdown = false;
			return;
		}

		// Tampilkan loader segera setelah mengetik agar UX terasa responsif
		isSearching = true;
		showDropdown = true;

		// Atur timer baru (500ms adalah angka standar yang nyaman)
		debounceTimer = setTimeout(() => {
			performSearch();
		}, 500);
	}

	function closeSearch() {
		showDropdown = false;
		searchQuery = '';
		clearTimeout(debounceTimer);
	}

	function logoSlide(node: HTMLElement, { duration = 200 }) {
		return {
			duration,
			css: (t: number) => {
				// t bergerak dari 0 ke 1
				return `
                opacity: ${t};
                width: ${t * 100}px; 
                overflow: hidden;
            `;
			}
		};
	}
</script>

<svelte:window bind:scrollY={y} />

<div class="relative z-50 hidden border-b border-slate-100 bg-primary px-6 pt-4 lg:flex">
	<div class="mx-auto flex w-full max-w-7xl items-center justify-between">
		<a href="/">
			<img src={Logo} alt="Logo PC IKPM Gontor Surabaya" class="h-10 w-auto max-w-none lg:h-20" />
		</a>
		<a href="/">
			<img src={Logoppikpm} alt="Logo PP IKPM Gontor" class="h-auto w-26 lg:w-24" />
		</a>
	</div>
</div>

<nav
	class="sticky top-0 z-50 hidden border-b border-slate-200 bg-primary/90 px-6 py-3 backdrop-blur-md lg:block"
>
	<div class="mx-auto flex max-w-7xl items-center justify-center lg:justify-between">
		<div class="flex items-center gap-8">
			{#if y > scrollThreshold}
				<div transition:logoSlide={{ duration: 200 }} class="flex items-center">
					<a href="/" class="block">
						<img src={Logo} alt="navbar logo small" class="h-auto w-25 max-w-none object-left" />
					</a>
				</div>
			{/if}
			<a href="/" class="text-sm font-bold text-green-950 transition-colors hover:text-green-800"
				>Home</a
			>
			<a
				href="/categories"
				class="text-sm font-bold text-green-950 transition-colors hover:text-green-800"
				>Categories</a
			>
			<a
				href="/about"
				class="text-sm font-bold text-green-950 transition-colors hover:text-green-800">About</a
			>
		</div>

		<div class="flex items-center gap-6">
			<div class="relative hidden md:block">
				<div class="relative z-61">
					<Search class="absolute top-1/2 left-3 -translate-y-1/2 text-green-600" size={16} />
					<input
						type="text"
						placeholder="Search posts..."
						bind:value={searchQuery}
						oninput={handleSearchInput}
						onfocus={() => searchQuery.length >= 3 && (showDropdown = true)}
						class="w-64 rounded-full border-none bg-slate-100 py-2 pr-4 pl-10 text-sm focus:shadow-green-600 focus:outline-2 focus:outline-green-600/50"
					/>
				</div>

				{#if showDropdown}
					<div
						transition:fly={{ y: 10, duration: 200 }}
						class="absolute top-full right-0 z-60 mt-2 w-96 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
					>
						<div class="p-2">
							{#if isSearching}
								<div class="flex items-center justify-center py-8 text-slate-400">
									<LoaderCircle class="animate-spin" size={20} />
									<span class="ml-2 text-xs font-medium">Searching...</span>
								</div>
							{:else if searchResults.length > 0}
								<p
									class="px-3 py-2 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase"
								>
									Results
								</p>
								<div class="max-h-100 overflow-y-auto">
									{#each searchResults as post (post.id)}
										<a
											href="/posts/{post.slug}"
											onclick={closeSearch}
											class="group flex items-start gap-4 rounded-xl p-3 transition-colors hover:bg-slate-50"
										>
											<!-- Container Gambar -->
											<div
												class="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100 transition-colors group-hover:bg-green-100"
											>
												{#if post.featured_image?.path}
													<img
														src={post.featured_image.path}
														alt={post.title}
														class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
													/>
												{:else}
													<div
														class="flex h-full w-full items-center justify-center text-slate-400 group-hover:text-green-600"
													>
														<FileText size={18} />
													</div>
												{/if}
											</div>

											<div class="flex-1 overflow-hidden">
												<h4
													class="truncate text-sm font-bold text-slate-800 transition-colors group-hover:text-green-600"
												>
													{post.title}
												</h4>
												<p class="truncate text-xs text-slate-500">
													{post.excerpt || 'No description available'}
												</p>
												<!-- Opsional: Info Author -->
												<div class="mt-1 flex items-center gap-1 opacity-60">
													<span class="text-[10px] text-slate-400"
														>By {post.author?.name || 'Unknown'}</span
													>
												</div>
											</div>
										</a>
									{/each}
								</div>
							{:else}
								<div class="py-10 text-center">
									<p class="text-sm font-medium text-slate-400">No matches for "{searchQuery}"</p>
								</div>
							{/if}
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</nav>

<!-- Navbar Mobile -->
<nav
	class="sticky top-0 z-50 border-b border-slate-200 bg-white/90 px-6 py-3 backdrop-blur-md lg:hidden"
>
	<div class="mx-auto flex max-w-7xl items-center justify-center">
		<div class="flex w-full items-center justify-between">
			<a href="/">
				<img src={Logo} alt="navbar logo small" class="h-12 w-auto" />
			</a>
			<button
				type="button"
				onclick={() => (isSidebarOpen = true)}
				class="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
			>
				<Menu size={24} />
			</button>
		</div>
	</div>
</nav>

{#if showDropdown}
	<button
		type="button"
		transition:fade={{ duration: 150 }}
		class="fixed inset-0 z-10 hidden h-full w-full cursor-default border-none bg-slate-900/5 backdrop-blur-[2px] lg:block"
		onclick={() => (showDropdown = false)}
		aria-label="Close search"
	></button>
{/if}
