<script lang="ts">
	import { enhance } from '$app/forms';
	import SEO from '$lib/component/page/SEO.svelte';
	import InputField from '$lib/component/ui/InputField.svelte';
	import { Mail, Lock, ArrowRight } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';
	import Logo from '$lib/assets/logo-dark.svg';
	import { authClient } from '$lib/authClient.js';

	// Svelte 5 Props Rune
	let { form } = $props();

	// Svelte 5 State Rune
	let loading = $state(false);

	interface FormData {
		email: string;
		password: string;
	}
	// 1. Svelte 5 Runes: Reaktivitas yang lebih clean
	let formData = $state<FormData>({
		email: '',
		password: ''
	});

	// async function loginWithGoogle() {
	// 	loading = true;
	// 	try {
	// 		await authClient.signIn.social({
	// 			provider: 'google',
	// 			callbackURL: '/kontributor/dashboard'
	// 		});
	// 	} catch (error) {
	// 		console.error('Login failed:', error);
	// 		loading = false;
	// 	}
	// }
</script>

<SEO
	title="Login Kontributor"
	description="Laman login kontributor untuk masuk ke dashboard kontributor"
/>
<div
	class="flex min-h-screen items-center justify-center bg-[#fdfcfb] p-4 font-sans text-stone-900"
>
	<div
		in:fly={{ y: 20, duration: 800 }}
		class="z-10 w-full max-w-105 rounded-3xl border border-stone-100 bg-white p-10 py-16 shadow-[0_20px_50px_rgba(0,0,0,0.04)]"
	>
		<div class="mb-10 text-center">
			<div
				class="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-green-950 p-2 text-white shadow-lg outline-3 outline-offset-3 outline-green-950"
			>
				<img src={Logo} alt="Logo PC IKPM" class="h-auto w-20" />
			</div>
			<h1 class="text-3xl font-extrabold tracking-tight text-green-950 uppercase">Kontributor</h1>
			<p class="mt-1 text-sm font-medium text-green-900">Masuk dan tulis artikel anda sendiri.</p>
		</div>

		<form
			method="POST"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					loading = false;
					update();
				};
			}}
			class="space-y-4"
		>
			<div class="space-y-1.5">
				<InputField
					label="Email"
					name="email"
					bind:value={formData.email}
					placeholder="Kontributor@gmail.com"
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
					placeholder="Masukkan password anda"
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
				disabled={loading}
				class="group relative mt-2 w-full overflow-hidden rounded-xl bg-green-900 py-4 font-bold text-white transition-all hover:bg-green-950 active:scale-[0.98] disabled:opacity-70"
			>
				<div class="flex items-center justify-center gap-2">
					{#if loading}
						<div
							class="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
						></div>
					{:else}
						<span>Masuk Ke Panel</span>
						<ArrowRight size={18} class="transition-transform group-hover:translate-x-1" />
					{/if}
				</div>
			</button>
		</form>

		<!-- <div class="relative my-8">
			<div class="absolute inset-0 flex items-center">
				<span class="w-full border-t border-stone-100"></span>
			</div>
			<div class="relative flex justify-center text-[10px] font-bold tracking-[0.2em] uppercase">
				<span class="bg-white px-4 text-stone-400">SSO Login</span>
			</div>
		</div>

		<button
			type="button"
			onclick={loginWithGoogle}
			disabled={loading}
			class="flex w-full items-center justify-center gap-3 rounded-xl border border-stone-200 bg-white py-3 font-bold text-stone-700 transition-all hover:border-stone-300 hover:bg-stone-50 active:scale-[0.98] disabled:opacity-50"
		>
			{#if loading}
				<div
					class="h-5 w-5 animate-spin rounded-full border-2 border-stone-200 border-t-stone-800"
				></div>
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="h-5 w-5">
					<path
						fill="#EA4335"
						d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
					/>
					<path
						fill="#4285F4"
						d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
					/>
					<path
						fill="#FBBC05"
						d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"
					/>
					<path
						fill="#34A853"
						d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
					/>
					<path fill="none" d="M0 0h48v48H0z" />
				</svg>
				<span class="text-sm">Google Workspace</span>
			{/if}
		</button> -->

		<p class="mt-8 text-center text-xs font-medium text-green-900/80">
			Belum punya akun? <a
				href="/kontributor/registrasi"
				class="font-bold text-green-900 hover:underline">Registrasi</a
			>
		</p>
	</div>
</div>
