<script lang="ts">
	import { X, Search, CloudUpload, LoaderCircle, CircleCheck, Trash2 } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import imageCompression from 'browser-image-compression';

	let { onSelect, onUpdate } = $props();

	let mediaLibrary = $state<any[]>([]);
	let isLoadingMedia = $state(false);
	let searchQuery = $state('');

	async function fetchMedia() {
		isLoadingMedia = true;
		try {
			const res = await fetch('/api/media');
			const data = await res.json();
			mediaLibrary = data;
		} catch (e) {
			console.error('Gagal memuat media', e);
		} finally {
			isLoadingMedia = false;
		}
	}

	let filteredMedia = $derived(
		mediaLibrary.filter((m) =>
			// Tambahkan optional chaining agar tidak error jika filename null
			m.filename?.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	async function handleNewUpload(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		isLoadingMedia = true;

		try {
			const options = {
				maxSizeMB: 0.1,
				maxWidthOrHeight: 1280,
				useWebWorker: true,
				initialQuality: 0.7,
				fileType: 'image/webp'
			};

			const compressedFile = await imageCompression(file, options);
			const originalName = file.name.substring(0, file.name.lastIndexOf('.'));
			const webpFileName = `${originalName}.webp`;

			const formData = new FormData();
			formData.append('file', compressedFile, webpFileName);

			const res = await fetch('/api/media', { method: 'POST', body: formData });

			if (!res.ok) throw new Error('Upload gagal');

			const uploadedItem = await res.json();

			// 1. Refresh list media di background (opsional tapi bagus untuk sinkronisasi)
			await fetchMedia();

			// 2. Kirim data yang baru diupload ke parent
			// Pastikan API /api/upload mengembalikan objek yang punya properti: id, path, filename
			if (onSelect) {
				onSelect(uploadedItem);
			}

			// 3. Jalankan onUpdate jika ada (biasanya untuk trigger notifikasi atau refresh komponen lain)
			if (onUpdate) onUpdate();
		} catch (error) {
			console.error('Konversi WebP atau Upload gagal:', error);
			alert('Gagal mengonversi gambar ke WebP atau upload.');
		} finally {
			isLoadingMedia = false;
			target.value = '';
		}
	}

	// --- Fungsi Hapus Baru ---
	async function handleDelete(id: number, e: MouseEvent) {
		// Mencegah trigger onSelect pada parent button
		e.stopPropagation();

		if (!confirm('Hapus media ini secara permanen?')) return;

		try {
			const res = await fetch(`/api/media/${id}`, { method: 'DELETE' });
			if (!res.ok) throw new Error('Gagal menghapus');

			// Refresh list agar sinkron
			await fetchMedia();
			if (onUpdate) onUpdate();
		} catch (e) {
			console.error('Delete error:', e);
			alert('Gagal menghapus media.');
		}
	}

	$effect(() => {
		fetchMedia();
	});
</script>

<div
	transition:fly={{ x: 350, duration: 400 }}
	class="fixed top-0 right-0 z-50 flex h-screen w-80 flex-col border-l border-stone-100 bg-stone-50/95 shadow-2xl backdrop-blur-sm lg:static lg:z-0 lg:h-auto lg:min-h-full"
>
	<div class="flex shrink-0 items-center justify-between border-b border-stone-200/50 p-5">
		<h2 class="text-[10px] font-black tracking-widest text-stone-900 uppercase">Pustaka Media</h2>
		<button
			onclick={() => onSelect(null)}
			class="text-stone-400 transition-colors hover:text-stone-900"
			aria-label="Tutup Sidebar"
		>
			<X size={20} />
		</button>
	</div>

	<div class="shrink-0 space-y-3 p-4">
		<div class="relative">
			<Search size={14} class="absolute top-2.5 left-3 text-stone-400" />
			<input
				bind:value={searchQuery}
				placeholder="Cari aset media..."
				class="w-full rounded-xl border-none bg-white py-2 pl-9 text-xs shadow-sm placeholder:text-stone-300 focus:ring-2 focus:ring-green-900/10"
			/>
		</div>

		<label
			class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-200 py-3 text-stone-400 transition-all hover:border-green-900/30 hover:bg-green-50 hover:text-green-900"
		>
			<CloudUpload size={16} />
			<span class="text-[10px] font-bold uppercase">Unggah Baru</span>
			<input type="file" accept="image/*" class="hidden" onchange={handleNewUpload} />
		</label>
	</div>

	<div class="custom-scrollbar flex-1 overflow-y-auto p-4 pt-0">
		{#if isLoadingMedia && mediaLibrary.length === 0}
			<div class="flex h-40 items-center justify-center">
				<LoaderCircle size={24} class="animate-spin text-stone-200" />
			</div>
		{:else if filteredMedia.length === 0}
			<div class="flex h-40 flex-col items-center justify-center text-stone-300">
				<p class="text-[10px] font-bold tracking-widest uppercase">Tidak ada media</p>
			</div>
		{:else}
			<div class="grid grid-cols-2 gap-3 pb-20">
				{#each filteredMedia as item (item.id)}
					<div class="group relative aspect-square">
						<button
							onclick={() => onSelect(item)}
							class="relative h-full w-full overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition-all hover:ring-4 hover:ring-green-900/10 focus:ring-4 focus:ring-green-900/20 focus:outline-none"
						>
							<img
								src={item.path}
								alt={item.filename}
								class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
								loading="lazy"
							/>
							<div
								class="absolute inset-0 flex items-center justify-center bg-green-900/40 opacity-0 transition-opacity group-hover:opacity-100"
							>
								<CircleCheck size={24} class="text-white" />
							</div>
						</button>

						<button
							onclick={(e) => handleDelete(item.id, e)}
							class="absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500 text-white opacity-0 shadow-lg transition-all group-hover:opacity-100 hover:bg-rose-600"
						>
							<Trash2 size={14} />
						</button>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	/* Agar scrollbar lebih estetik dan tipis */
	.custom-scrollbar::-webkit-scrollbar {
		width: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background-color: #e7e5e4;
		border-radius: 10px;
	}
</style>
