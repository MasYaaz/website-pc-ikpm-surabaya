<script lang="ts">
	import SEO from '$lib/component/page/SEO.svelte';
	import { Calendar, UserIcon, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-svelte';
	import type { PageProps } from './$types';
	import { fly, fade } from 'svelte/transition';

	interface PostWithAuthor {
		id: number;
		title: string;
		slug: string;
		excerpt: string | null;
		status: string | null;
		created_at: string; // Berubah dari createdAt
		author: {
			name: string;
			image: string | null;
			role: string | null;
		} | null;
		featuredImage: {
			path: string;
			alt_text: string | null; // Berubah dari altText
		} | null;
	}

	let { data }: PageProps = $props();

	// --- LOGIK HERO SLIDER ---
	let featuredPosts = $derived((data.posts as PostWithAuthor[]).slice(0, 3));
	let currentSlide = $state(0);

	function nextSlide() {
		currentSlide = (currentSlide + 1) % featuredPosts.length;
	}
	function prevSlide() {
		currentSlide = (currentSlide - 1 + featuredPosts.length) % featuredPosts.length;
	}

	// Auto-play 5 detik
	$effect(() => {
		const interval = setInterval(nextSlide, 5000);
		return () => clearInterval(interval);
	});

	// --- LIST ARTIKEL (Tanpa Filter Search) ---
	let displayPosts = $derived(data.posts as PostWithAuthor[]);
</script>

<SEO title="Home" />

<div class="min-h-screen bg-primary font-sans antialiased">
	{#if featuredPosts.length > 0}
		<section class="relative h-[75vh] min-h-125 w-full overflow-hidden bg-stone-950 md:h-[85vh]">
			{#key currentSlide}
				<div in:fade={{ duration: 800 }} out:fade={{ duration: 500 }} class="absolute inset-0">
					<div
						class="absolute inset-0 z-10 bg-linear-to-t from-stone-950 via-stone-950/40 to-transparent md:bg-linear-to-r"
					></div>

					<img
						src={featuredPosts[currentSlide].featuredImage?.path}
						alt={featuredPosts[currentSlide].featuredImage?.alt_text}
						class="absolute inset-0 h-full w-full object-cover"
					/>

					<div
						class="relative z-20 mx-auto flex h-full max-w-7xl items-end px-6 pb-20 md:items-center md:pb-0"
					>
						<div
							in:fly={{ y: 30, x: 0, duration: 800, delay: 200 }}
							class="max-w-3xl md:in:fly={{ x: -50, y: 0 }}"
						>
							<div class="mb-4 flex items-center gap-3">
								<span
									class="inline-block rounded-full bg-green-800 px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase"
								>
									Editor's Pick
								</span>
								<span class="text-xs font-medium text-white">
									{new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
								</span>
							</div>

							<h1
								class="mb-4 text-4xl leading-[1.1] font-black text-white sm:text-5xl md:mb-6 md:text-7xl"
							>
								{featuredPosts[currentSlide].title}
							</h1>

							<p
								class="mb-8 line-clamp-2 max-w-xl text-base text-stone-300 md:text-xl md:leading-relaxed"
							>
								{featuredPosts[currentSlide].excerpt ||
									'Explore our latest analysis and official organizational updates.'}
							</p>

							<div class="flex flex-wrap items-center gap-4">
								<a
									href="/posts/{featuredPosts[currentSlide].slug}"
									class="group inline-flex items-center gap-3 rounded-xl bg-white px-8 py-4 text-sm font-bold text-stone-950 transition-all hover:bg-indigo-500 hover:text-white active:scale-95"
								>
									Buka Artikel
									<ArrowRight size={18} class="transition-transform group-hover:translate-x-1" />
								</a>
							</div>
						</div>
					</div>
				</div>
			{/key}

			<div class="absolute right-6 bottom-10 z-30 hidden items-center gap-6 md:right-12 md:flex">
				<div class="flex gap-2">
					<button
						onclick={prevSlide}
						class="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-stone-900/40 text-white backdrop-blur-md transition-all hover:bg-white hover:text-stone-950"
						aria-label="Previous slide"
					>
						<ChevronLeft size={24} />
					</button>
					<button
						onclick={nextSlide}
						class="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-stone-900/40 text-white backdrop-blur-md transition-all hover:bg-white hover:text-stone-950"
						aria-label="Next slide"
					>
						<ChevronRight size={24} />
					</button>
				</div>
			</div>

			<div class="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 gap-2 md:hidden">
				{#each featuredPosts as _, i}
					<button
						aria-label="change slide"
						onclick={() => (currentSlide = i)}
						class="h-1.5 rounded-full transition-all {currentSlide === i
							? 'w-8 bg-green-500'
							: 'w-2 bg-white/30'}"
					></button>
				{/each}
			</div>
		</section>
	{/if}

	<main class="mx-auto max-w-7xl px-6 py-24">
		<div class="mb-16 border-b border-stone-100 pb-8">
			<h2 class="text-3xl font-black tracking-tight text-stone-900">Artikel Terbaru</h2>
			<p class="mt-2 font-medium text-stone-500">Cari berita terbaru disini.</p>
		</div>

		{#if displayPosts.length > 0}
			<div class="grid grid-cols-1 gap-x-10 gap-y-20 md:grid-cols-2 lg:grid-cols-3">
				{#each displayPosts as post, i (post.id)}
					<article in:fly={{ y: 20, duration: 400, delay: i * 50 }} class="group flex flex-col">
						<a
							href="/posts/{post.slug}"
							class="relative mb-6 aspect-16/10 overflow-hidden rounded-3xl bg-stone-50 transition-all hover:ring-8 hover:ring-stone-50/50"
						>
							<img
								src={post.featuredImage?.path}
								alt={post.featuredImage?.alt_text}
								class="flex h-full w-full items-center justify-center object-cover text-stone-200 transition-transform duration-700 group-hover:scale-110 group-hover:text-stone-300"
							/>

							{#if post.status !== 'publish'}
								<div
									class="absolute top-5 left-5 rounded-lg bg-white/90 px-3 py-1 text-[10px] font-bold tracking-widest text-amber-700 uppercase shadow-sm backdrop-blur"
								>
									{post.status}
								</div>
							{/if}
						</a>

						<div class="flex flex-1 flex-col">
							<div
								class="mb-4 flex items-center gap-3 text-[10px] font-bold tracking-widest text-stone-400 uppercase"
							>
								<Calendar size={14} class="text-stone-300" />
								{new Date(post.created_at).toLocaleDateString('id-ID', {
									month: 'long',
									day: 'numeric',
									year: 'numeric'
								})}
							</div>

							<h3
								class="mb-4 text-2xl leading-tight font-bold text-stone-900 transition-colors group-hover:text-green-800"
							>
								<a href="/posts/{post.slug}">{post.title}</a>
							</h3>

							<p class="mb-8 line-clamp-3 text-sm leading-relaxed text-stone-500">
								{post.excerpt ||
									'Investigation details are currently under review by our editorial team.'}
							</p>

							<div class="mt-auto flex items-center gap-3 border-t border-stone-50 pt-6">
								<div
									class="h-10 w-10 overflow-hidden rounded-full border-2 border-white shadow-sm ring-1 ring-stone-100"
								>
									{#if post.author?.image}
										<img
											src={post.author.image}
											alt={post.author.name}
											class="h-full w-full object-cover"
										/>
									{:else}
										<div
											class="flex h-full w-full items-center justify-center bg-stone-50 text-stone-400"
										>
											<UserIcon size={18} />
										</div>
									{/if}
								</div>
								<div class="flex flex-col leading-tight">
									<span class="text-[10px] font-bold tracking-tight text-stone-400 uppercase"
										>Contributor</span
									>
									<span class="text-sm font-bold text-stone-800"
										>{post.author?.name || 'Anonymous'}</span
									>
								</div>
							</div>
						</div>
					</article>
				{/each}
			</div>
		{:else}
			<div class="py-20 text-center">
				<p class="text-stone-400">Belum ada publikasi yang tersedia.</p>
			</div>
		{/if}
	</main>

	<footer class="border-t border-stone-100 py-16">
		<div class="mx-auto max-w-7xl px-6 text-center">
			<p class="text-[10px] font-bold tracking-widest text-stone-400 uppercase">
				&copy; 2026 Organization Intelligence. All Rights Reserved.
			</p>
		</div>
	</footer>
</div>
