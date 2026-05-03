<script lang="ts">
	import { page } from '$app/state';
	import { ArrowLeft } from 'lucide-svelte';
	import { fly } from 'svelte/transition';

	// Mengambil status error secara reaktif di Svelte 5
	const status = $derived(page.status);
</script>

<div
	class="flex min-h-screen flex-col items-center justify-center bg-white p-6 font-sans antialiased"
>
	<main in:fly={{ y: 10, duration: 600 }} class="w-full max-w-md text-center">
		<div
			class="mb-10 inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-green-900 text-white shadow-xl shadow-green-900/20"
		>
			<span class="text-4xl font-black">{status}</span>
		</div>

		<h1 class="mb-3 text-3xl font-black tracking-tight text-green-950 uppercase">
			{status === 404 ? 'Halaman Hilang' : 'Sistem Sibuk'}
		</h1>
		<p class="mb-10 px-4 leading-relaxed text-green-900/80">
			{status === 404
				? 'Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.'
				: 'Terjadi kesalahan internal. Mohon coba beberapa saat lagi.'}
		</p>

		<div class="flex flex-col gap-3">
			<a
				href="/"
				class="w-full rounded-2xl bg-green-900 py-4 text-sm font-bold text-white transition-all hover:bg-green-950 active:scale-[0.98]"
			>
				Kembali ke Beranda
			</a>

			<button
				onclick={() => history.back()}
				class="flex w-full items-center justify-center gap-2 py-3 text-sm font-bold text-green-900/80 transition-colors hover:text-green-900"
			>
				<ArrowLeft size={16} />
				Kembali ke halaman sebelumnya
			</button>
		</div>
	</main>

	<footer class="fixed bottom-10 w-full text-center">
		<p class="text-[10px] font-bold tracking-[0.2em] text-green-900/60 uppercase">
			PC IKPM Gontor Surabaya &copy; 2026
		</p>
	</footer>
</div>
