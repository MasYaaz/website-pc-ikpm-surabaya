<script lang="ts">
	import { fade, fly, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { CircleCheck, CircleX, LoaderCircle, TriangleAlert } from 'lucide-svelte'; // Tambah TriangleAlert
	import { uiMessage } from '$lib/stores/messageBoxStates.svelte';

	const hideMessage = () => {
		if (uiMessage.status) {
			uiMessage.close();
		}
	};

	// Helper untuk menentukan warna berdasarkan tipe
	const getColorClass = (type: string) => {
		if (type === 'success') return 'bg-green-500';
		if (type === 'warning') return 'bg-amber-500'; // Oranye/Kuning untuk warning
		return 'bg-red-500';
	};
</script>

{#if uiMessage.open}
	<div
		transition:fade={{ duration: 300 }}
		class="fixed inset-0 z-100 flex items-center justify-center bg-white/10 p-6 backdrop-blur-md"
		role="dialog"
	>
		<button
			class="absolute inset-0 cursor-default bg-slate-900/20"
			onclick={hideMessage}
			aria-label="Tutup"
		></button>

		<div
			in:scale={{ duration: 500, start: 0.9, opacity: 0, easing: quintOut }}
			class="relative w-full max-w-sm overflow-hidden rounded-[2.5rem] border border-gold/10 bg-white shadow-[0_20px_50px_rgba(149,42,6,0.1)]"
		>
			<div class="flex flex-col items-center px-10 py-12">
				{#if !uiMessage.status}
					<div class="flex flex-col items-center gap-8" in:fade>
						<div class="relative flex items-center justify-center">
							<div class="absolute h-20 w-20 animate-ping rounded-full bg-gold/10"></div>
							<div
								class="relative flex h-16 w-16 rotate-45 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20"
							>
								<LoaderCircle
									class="h-8 w-8 -rotate-45 animate-spin text-yellow"
									strokeWidth={2.5}
								/>
							</div>
						</div>
						<div class="space-y-1 text-center">
							<p class="font-body text-sm font-black text-primary uppercase">
								{uiMessage.message ? 'Memproses Data...' : 'Loading'}
							</p>
							<p class="font-body text-[10px] font-medium tracking-widest text-slate-400 uppercase">
								{uiMessage.message || 'Mohon tunggu sebentar...'}
							</p>
						</div>
					</div>
				{:else}
					<div
						class="flex flex-col items-center text-center"
						in:fly={{ y: 20, duration: 600, easing: quintOut }}
					>
						<div class="relative mb-8">
							<div
								class="absolute inset-0 opacity-20 blur-xl {getColorClass(uiMessage.status.type)}"
							></div>

							<div
								class="relative flex h-20 w-20 rotate-45 items-center justify-center rounded-2xl border-4 border-white shadow-xl transition-all
                                {getColorClass(uiMessage.status.type)} text-white"
							>
								<div class="-rotate-45">
									{#if uiMessage.status.type === 'success'}
										<CircleCheck size={36} strokeWidth={2} />
									{:else if uiMessage.status.type === 'warning'}
										<TriangleAlert size={36} strokeWidth={2} />
									{:else}
										<CircleX size={36} strokeWidth={2} />
									{/if}
								</div>
							</div>
						</div>

						<h4
							class="font-body text-xl font-black tracking-tight text-primary uppercase sm:text-2xl"
						>
							{#if uiMessage.status.type === 'success'}
								Berhasil
							{:else if uiMessage.status.type === 'warning'}
								Perhatian
							{:else}
								Gagal
							{/if}
						</h4>

						<p
							class="mt-4 font-body text-xs leading-relaxed font-bold tracking-wide text-slate-500"
						>
							{uiMessage.status.text}
						</p>

						<button
							onclick={() => uiMessage.close()}
							class="group relative mt-10 w-full overflow-hidden rounded-xl py-4 transition-all active:scale-95"
						>
							<div class="absolute inset-0 bg-primary/90 transition-colors hover:bg-primary"></div>
							<span class="relative font-body text-[10px] font-black text-secondary uppercase">
								Mengerti
							</span>
						</button>
					</div>
				{/if}
			</div>

			<div class="flex h-1.5 w-full">
				<div class="h-full flex-1 bg-primary"></div>
				<div class="h-full flex-1 bg-gold"></div>
				<div class="h-full flex-1 bg-primary"></div>
			</div>
		</div>
	</div>
{/if}
