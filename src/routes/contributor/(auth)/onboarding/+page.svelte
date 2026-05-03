<script lang="ts">
	import { page } from '$app/state';
	import { LogOut, RefreshCw, MessageCircle } from 'lucide-svelte';
	import { fly } from 'svelte/transition';

	// Mengambil data user secara reaktif dari data layout
	const user = $derived(page.data.user);
</script>

<div
	class="flex min-h-screen flex-col items-center justify-center bg-white p-6 font-sans antialiased"
>
	<main in:fly={{ y: 10, duration: 600 }} class="w-full max-w-md text-center">
		<!-- Ikon Status: Menunggu Verifikasi -->
		<div
			class="mb-10 inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-green-900 text-white shadow-xl shadow-green-900/20"
		>
			<RefreshCw class="animate-spin-slow h-12 w-12" />
		</div>

		<h1 class="mb-3 text-3xl font-black tracking-tight text-green-950 uppercase">
			Verifikasi Akun
		</h1>

		<p class="mb-4 px-4 font-bold text-green-900">
			Halo, {user?.displayName || 'Kontributor'}!
		</p>

		<p class="mb-10 px-4 leading-relaxed text-green-900/80">
			Saat ini akun Anda sedang dalam proses peninjauan oleh admin. Mohon tunggu maksimal 1x24 jam
			untuk aktivasi fitur dashboard **BedahSaham**.
		</p>

		<div class="flex flex-col gap-3">
			<!-- Tombol untuk cek status (Refresh halaman) -->
			<button
				onclick={() => window.location.reload()}
				class="w-full rounded-2xl bg-green-900 py-4 text-sm font-bold text-white shadow-lg shadow-green-900/10 transition-all hover:bg-green-950 active:scale-[0.98]"
			>
				Cek Status Aktivasi
			</button>

			<!-- Hubungi Admin via WhatsApp -->
			<a
				href="https://wa.me/6281234567890?text=Halo%20Admin%2C%20mohon%20aktivasi%20akun%20saya%20di%20BedahSaham"
				target="_blank"
				class="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-green-900/10 py-3.5 text-sm font-bold text-green-900 transition-colors hover:bg-green-50"
			>
				<MessageCircle size={18} />
				Hubungi Admin
			</a>

			<!-- Logout jika ingin masuk dengan akun lain -->
			<form action="/contributor?/logout" method="POST" class="w-full">
				<button
					type="submit"
					class="flex w-full items-center justify-center gap-2 py-3 text-sm font-bold text-red-600/80 transition-colors hover:text-red-600"
				>
					<LogOut size={16} />
					Keluar dari Akun
				</button>
			</form>
		</div>
	</main>

	<footer class="fixed bottom-10 w-full text-center">
		<p class="text-[10px] font-bold tracking-[0.2em] text-green-900/60 uppercase">
			PC IKPM Gontor Surabaya &copy; 2026
		</p>
	</footer>
</div>

<style>
	/* Custom animation untuk ikon refresh */
	:global(.animate-spin-slow) {
		animation: spin 3s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
