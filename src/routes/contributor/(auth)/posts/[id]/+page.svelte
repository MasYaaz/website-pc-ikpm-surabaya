<script lang="ts">
	import { enhance } from '$app/forms';
	import Editor from '$lib/component/ui/Editor.svelte';
	import MediaSidebar from '$lib/component/ui/MediaSidebar.svelte';
	import { ArrowLeft, Globe, Save, Image as ImageIcon, LoaderCircle } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	let { data } = $props();

	// Gunakan $state agar bisa di-bind dan diedit (inisialisasi dari data server)
	let title = $derived(data.post.title);
	let content = $derived(data.post.content || '');
	let excerpt = $derived(data.post.excerpt || '');
	let featuredImageId = $derived(data.post.featuredImageId);
	let previewUrl = $derived(data.post.featuredImage?.path || '');

	// Media Library States
	let showMedia = $state(false);
	let mediaTarget = $state<'thumbnail' | 'editor'>('editor');
	let editorInstance = $state<any>(null);

	// Fungsi buka media
	function openMediaForThumbnail() {
		mediaTarget = 'thumbnail';
		showMedia = true;
	}

	function openMediaForEditor() {
		mediaTarget = 'editor';
		showMedia = true;
	}

	function handleMediaSelect(item: any) {
		if (!item) {
			showMedia = false;
			return;
		}

		if (mediaTarget === 'thumbnail') {
			featuredImageId = item.id;
			previewUrl = item.path;
		} else {
			editorInstance?.insertImage(item.path);
		}
		showMedia = false;
	}
</script>

<div class="flex">
	<form
		method="POST"
		action="?/update"
		use:enhance={({ formData }) => {
			formData.set('content', content);
			formData.set('excerpt', excerpt);
			if (featuredImageId) formData.set('featuredImageId', featuredImageId.toString());

			return async ({ update }) => {
				await update();
			};
		}}
		class="mx-auto max-w-6xl flex-1 space-y-8 px-6 pb-20"
	>
		<div
			class="sticky top-0 z-30 flex items-center justify-between border-b border-stone-200/50 bg-stone-50/80 py-4 backdrop-blur-md"
		>
			<div class="flex items-center gap-4">
				<a
					href="/contributor/posts"
					class="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white shadow-sm transition-all hover:border-green-900/30 hover:text-green-900"
				>
					<ArrowLeft size={20} />
				</a>
				<div class="hidden sm:block">
					<p class="text-[10px] font-black tracking-widest text-stone-400 uppercase">
						Penyuntingan Artikel
					</p>
					<h1 class="max-w-50 truncate text-sm font-bold text-stone-900 lg:max-w-md">
						{title || 'Draf Tanpa Judul'}
					</h1>
				</div>
			</div>

			<div class="flex items-center gap-3">
				<button
					type="submit"
					name="status"
					value="draft"
					class="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-5 py-2.5 text-sm font-bold text-stone-600 transition-all hover:bg-stone-50 active:scale-95"
				>
					<Save size={16} />
					<span class="hidden md:inline">Simpan Draft</span>
				</button>
				<button
					type="submit"
					name="status"
					value="publish"
					class="flex items-center gap-2 rounded-xl bg-green-900 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-green-900/20 transition-all hover:bg-green-950 active:scale-95"
				>
					<Globe size={16} />
					<span>Perbarui</span>
				</button>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-10 lg:grid-cols-4">
			<div class="space-y-6 lg:col-span-3">
				<div class="space-y-2">
					<label for="post-title" class="sr-only">Judul Artikel</label>
					<input
						id="post-title"
						bind:value={title}
						name="title"
						type="text"
						placeholder="Masukkan Judul Artikel..."
						class="w-full border-none bg-transparent p-0 text-5xl font-black tracking-tight placeholder:text-stone-200 focus:ring-0"
					/>
				</div>

				<div class="min-h-125">
					<Editor bind:this={editorInstance} bind:content showMedia={openMediaForEditor} />
				</div>
			</div>

			<aside class="space-y-6">
				<div class="rounded-3xl border border-stone-200/60 bg-white p-6 shadow-sm">
					<label
						for="thumbnail-btn"
						class="mb-4 block text-[10px] font-black tracking-widest text-stone-500 uppercase"
					>
						Gambar Utama
					</label>

					<button
						id="thumbnail-btn"
						type="button"
						onclick={openMediaForThumbnail}
						class="group relative aspect-video w-full overflow-hidden rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50 transition-all hover:border-green-900/20 hover:bg-stone-100/50"
					>
						{#if previewUrl}
							<img
								src={previewUrl}
								alt="Thumbnail preview"
								class="h-full w-full object-cover"
								in:fade
							/>
							<div
								class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
							>
								<span
									class="rounded-lg bg-white/20 px-4 py-2 text-xs font-bold text-white backdrop-blur-md"
									>Ganti Gambar</span
								>
							</div>
						{:else}
							<div
								class="flex h-full flex-col items-center justify-center text-stone-300 transition-colors group-hover:text-stone-400"
							>
								<ImageIcon size={32} strokeWidth={1.5} />
								<p class="mt-2 text-[10px] font-bold uppercase">Pilih Media</p>
							</div>
						{/if}
					</button>
				</div>

				<div class="rounded-3xl border border-stone-200/60 bg-white p-6 shadow-sm">
					<label
						for="excerpt-input"
						class="mb-3 block text-[10px] font-black tracking-widest text-stone-500 uppercase"
					>
						Ringkasan Artikel
					</label>
					<textarea
						id="excerpt-input"
						name="excerpt"
						bind:value={excerpt}
						rows="5"
						placeholder="Ringkasan singkat..."
						class="w-full resize-none rounded-xl border-none bg-stone-50 p-4 text-sm leading-relaxed placeholder:text-stone-300 focus:ring-2 focus:ring-green-900/5"
					></textarea>
					<div class="mt-2 flex justify-end">
						<span class="text-[10px] font-medium text-stone-400">{excerpt.length}/200</span>
					</div>
				</div>
			</aside>
		</div>
	</form>

	{#if showMedia}
		<MediaSidebar onSelect={handleMediaSelect} onUpdate={() => console.log('Library updated!')} />
	{/if}
</div>
