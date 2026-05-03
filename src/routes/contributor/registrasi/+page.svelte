<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import SEO from '$lib/component/page/SEO.svelte';
	import InputField from '$lib/component/ui/InputField.svelte';
	import { uiMessage } from '$lib/stores/messageBoxStates.svelte.js';
	import { handleFormResult } from '$lib/utils/handleResult.js';
	import { Mail, Lock, User, ArrowLeft, CircleCheckBig } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';

	// Svelte 5 Props
	let { form } = $props();

	interface FormData {
		nama: string;
		email: string;
		password: string;
	}
	// 1. Svelte 5 Runes: Reaktivitas yang lebih clean
	let formData = $state<FormData>({
		nama: '',
		email: '',
		password: ''
	});
</script>

<SEO title="Registrasi Kontributor" />
<div
	class="flex min-h-screen items-center justify-center bg-[#fdfcfb] p-4 font-sans text-stone-900"
>
	<div
		in:fly={{ x: 20, duration: 800 }}
		class="w-full max-w-115 rounded-3xl border border-stone-100 bg-white p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)]"
	>
		<a
			href="/contributor/login"
			class="group mb-8 inline-flex items-center gap-2 text-xs font-bold tracking-widest text-green-900/80 uppercase transition-colors hover:text-green-900"
		>
			<ArrowLeft size={14} class="transition-transform group-hover:-translate-x-1" /> Kembali
		</a>

		<div class="mb-8">
			<h1 class="text-3xl font-bold tracking-tight text-green-900">Registrasi</h1>
			<p class="mt-1 text-sm text-green-900">Buat akun untuk mulai mengelola konten</p>
		</div>

		<form
			method="POST"
			use:enhance={() => {
				uiMessage.startLoading();
				return async ({ result, update }) => {
					await handleFormResult(result, async () => {
						// Gunakan goto dari $app/navigation
						await goto('/contributor/dashboard');
					});
					await update();
				};
			}}
			class="space-y-4"
		>
			<div class="space-y-1.5">
				<InputField
					label="Nama Lengkap"
					name="name"
					bind:value={formData.nama}
					placeholder="Masukkan nama anda"
					icon={User}
					isClearable={true}
					onClear={() => (formData.nama = '')}
				/>
			</div>

			<div class="space-y-1.5">
				<InputField
					label="Alamat Email"
					name="email"
					bind:value={formData.email}
					placeholder="email@gmail.com"
					icon={Mail}
					isClearable={true}
					onClear={() => (formData.email = '')}
				/>
			</div>

			<div class="space-y-1.5">
				<InputField
					label="Password"
					name="password"
					type="password"
					bind:value={formData.password}
					placeholder="Min. 8 Karakter"
					icon={Lock}
					isClearable={true}
					onClear={() => (formData.password = '')}
				/>
			</div>

			{#if form?.message}
				<div
					in:fade
					class="mb-6 flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-xs text-red-600"
				>
					<div class="h-1.5 w-1.5 animate-pulse rounded-full bg-red-600"></div>
					{form.message}
				</div>
			{/if}

			<button
				type="submit"
				class="mt-2 w-full rounded-xl bg-green-900 py-4 font-bold text-white shadow-lg transition-all hover:bg-green-950 active:scale-[0.98] disabled:opacity-50"
			>
				Buat Akun Sekarang
			</button>
		</form>

		<div class="mt-8 flex items-start gap-3 rounded-2xl border border-stone-100 bg-stone-50 p-4">
			<CircleCheckBig size={16} class="mt-0.5 shrink-0 text-green-900/50" />
			<p class="text-[10px] leading-relaxed font-medium tracking-wider text-green-900 uppercase">
				Akses Anda akan diverifikasi oleh Admin Utama sebelum fitur CMS dapat digunakan sepenuhnya.
			</p>
		</div>
	</div>
</div>
