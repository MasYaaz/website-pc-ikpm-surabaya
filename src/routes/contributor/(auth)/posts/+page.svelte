<script lang="ts">
	import { enhance } from '$app/forms';
	import {
		Plus,
		Search,
		MoreVertical,
		FileText,
		ExternalLink,
		Trash2,
		Edit3,
		Loader2,
		LoaderCircle,
		PenLine
	} from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';

	// Props dari +page.ts / +page.server.ts
	let { data } = $props();

	let searchQuery = $state('');
	let isDeleting = $state<number | null>(null);

	// Filter data posts secara reaktif berdasarkan input pencarian
	let filteredPosts = $derived(
		data.posts.filter((post: any) => post.title.toLowerCase().includes(searchQuery.toLowerCase()))
	);

	// Fungsi format tanggal yang lebih tangguh
	const formatDate = (date: Date | string | null) => {
		if (!date) return '-'; // Kembalikan strip jika tanggal null

		const d = typeof date === 'string' ? new Date(date) : date;

		return d.toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	};

	// Fungsi hapus draf (memanggil server-side action)
	async function deletePost(id: number) {
		if (!confirm('Hapus artikel ini? Tindakan ini tidak bisa dibatalkan.')) return;
		isDeleting = id;
	}
</script>

<div class="mx-auto max-w-6xl px-6 py-10" in:fade>
	<div class="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<p class="text-[10px] font-black tracking-widest text-stone-400 uppercase">
				Kontributor Center
			</p>
			<h1 class="text-3xl font-black tracking-tight text-stone-900">Artikel Saya</h1>
		</div>

		<a
			href="/contributor/posts/new"
			class="flex items-center justify-center gap-2 rounded-2xl bg-green-900 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-green-900/20 transition-all hover:bg-green-950 active:scale-95"
		>
			<Plus size={18} />
			<span>Tulis Artikel Baru</span>
		</a>
	</div>

	<div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div class="relative w-full sm:max-w-xs">
			<Search size={16} class="absolute top-3 left-4 text-stone-400" />
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Cari judul artikel..."
				class="w-full rounded-2xl border-stone-200 bg-white py-2.5 pl-12 text-sm shadow-sm transition-all focus:border-green-900/30 focus:ring-4 focus:ring-green-900/5"
			/>
		</div>

		<div class="flex items-center gap-2 text-xs font-bold tracking-wider text-stone-400 uppercase">
			<span>Total: {filteredPosts.length} Post</span>
		</div>
	</div>

	<div class="overflow-hidden rounded-3xl border border-stone-200/60 bg-white shadow-sm">
		<div class="overflow-x-auto">
			<table class="w-full border-collapse text-left">
				<thead>
					<tr class="border-b border-stone-100 bg-stone-50/50">
						<th class="px-6 py-4 text-[10px] font-black tracking-widest text-stone-400 uppercase"
							>Artikel</th
						>
						<th class="px-6 py-4 text-[10px] font-black tracking-widest text-stone-400 uppercase"
							>Status</th
						>
						<th class="px-6 py-4 text-[10px] font-black tracking-widest text-stone-400 uppercase"
							>Tanggal</th
						>
						<th
							class="px-6 py-4 text-right text-[10px] font-black tracking-widest text-stone-400 uppercase"
							>Aksi</th
						>
					</tr>
				</thead>
				<tbody class="divide-y divide-stone-50">
					{#each filteredPosts as post (post.id)}
						<tr class="group transition-colors hover:bg-stone-50/50">
							<td class="px-6 py-5">
								<div class="flex items-center gap-4">
									<div
										class="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-stone-100 bg-stone-100"
									>
										{#if post.featuredImage?.path}
											<img
												src={post.featuredImage.path}
												alt=""
												class="h-full w-full object-cover"
											/>
										{:else}
											<div class="flex h-full items-center justify-center text-stone-300">
												<FileText size={18} />
											</div>
										{/if}
									</div>
									<div>
										<a
											href="/contributor/posts/{post.id}"
											class="line-clamp-1 block font-bold text-stone-900 transition-colors hover:text-green-900"
										>
											{post.title}
										</a>
										<p class="text-[10px] font-medium text-stone-400">ID: #{post.id}</p>
									</div>
								</div>
							</td>
							<td class="px-6 py-5">
								{#if post.status === 'publish'}
									<span
										class="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold tracking-tighter text-green-700 uppercase"
									>
										Published
									</span>
								{:else}
									<span
										class="inline-flex items-center rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-bold tracking-tighter text-stone-500 uppercase"
									>
										Draft
									</span>
								{/if}
							</td>
							<td class="px-6 py-5">
								<p class="text-xs font-medium text-stone-600">{formatDate(post.createdAt)}</p>
							</td>
							<td class="px-6 py-5">
								<div class="flex items-center justify-end gap-2">
									<a
										href="/contributor/posts/{post.id}"
										class="rounded-lg p-2 text-stone-400 transition-all hover:bg-green-50 hover:text-green-900"
										title="Edit"
									>
										<PenLine size={18} />
									</a>
									<script lang="ts">
										import { enhance } from '$app/forms';
										import { Trash2, LoaderCircle } from 'lucide-svelte';

										let { data } = $props();
										let isDeleting = $state<number | null>(null);
									</script>

									<form
										method="POST"
										action="/contributor/posts/{post.id}?/delete"
										use:enhance={() => {
											isDeleting = post.id;
											return async ({ update }) => {
												await update();
												isDeleting = null;
											};
										}}
									>
										<button
											type="submit"
											class="rounded-lg p-2 text-stone-400 transition-all hover:bg-rose-50 hover:text-rose-600"
											title="Hapus"
											disabled={isDeleting === post.id}
										>
											{#if isDeleting === post.id}
												<LoaderCircle size={18} class="animate-spin" />
											{:else}
												<Trash2 size={18} />
											{/if}
										</button>
									</form>
								</div>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="4" class="px-6 py-20 text-center">
								<div class="flex flex-col items-center justify-center text-stone-300">
									<FileText size={48} strokeWidth={1} />
									<p class="mt-4 text-sm font-bold uppercase tracking-widest text-stone-400">
										Belum ada artikel
									</p>
									<p class="text-xs text-stone-400">Mulai tulis artikel pertamamu hari ini.</p>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

<style>
	/* Hindari teks terpotong pada mobile jika judul kepanjangan */
	.line-clamp-1 {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
