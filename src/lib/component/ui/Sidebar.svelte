<script lang="ts">
	import Logo from '$lib/assets/logo-light.svg';
	import { X, LayoutGrid, Info, House } from 'lucide-svelte';
	import { fly, fade } from 'svelte/transition';

	// Menggunakan $bindable agar perubahan di sini tersinkron ke Navbar
	let { isSidebarOpen = $bindable(), data } = $props();

	function close() {
		isSidebarOpen = false;
	}
</script>

{#if isSidebarOpen}
	<button
		transition:fade={{ duration: 200 }}
		class="fixed inset-0 z-60 block w-full border-none bg-slate-900/40 backdrop-blur-sm lg:hidden"
		onclick={close}
		aria-label="Close Sidebar"
	></button>

	<aside
		transition:fly={{ x: -300, duration: 300 }}
		class="fixed inset-y-0 left-0 z-70 w-72 bg-white p-6 shadow-2xl lg:hidden"
	>
		<div class="mb-8 flex items-center justify-between">
			<img src={Logo} alt="logo" class="h-14 w-auto" />
			<button
				onclick={close}
				class="rounded-full bg-slate-50 p-2 text-slate-500 transition-all hover:bg-slate-100 active:scale-90"
			>
				<X size={20} />
			</button>
		</div>

		<nav class="flex flex-col gap-2">
			<a
				href="/"
				onclick={close}
				class="flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-green-50 hover:text-green-600"
			>
				<House size={18} /> Home
			</a>
			<a
				href="/categories"
				onclick={close}
				class="flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-green-50 hover:text-green-600"
			>
				<LayoutGrid size={18} /> Categories
			</a>
			<a
				href="/about"
				onclick={close}
				class="flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-green-50 hover:text-green-600"
			>
				<Info size={18} /> About
			</a>
		</nav>

		{#if data?.user}
			<div class="absolute right-6 bottom-6 left-6 border-t border-slate-100 pt-6">
				<div class="flex items-center gap-3">
					<img
						src={data.user.image || `https://ui-avatars.com/api/?name=${data.user.name}`}
						alt=""
						class="h-10 w-10 rounded-full ring-2 ring-slate-50"
					/>
					<div class="overflow-hidden leading-tight">
						<p class="truncate text-sm font-bold text-slate-800">{data.user.name}</p>
						<span class="text-[10px] font-medium tracking-widest text-indigo-500 uppercase">
							{data.user.role}
						</span>
					</div>
				</div>
			</div>
		{/if}
	</aside>
{/if}

<style>
	:global(body:has(aside)) {
		overflow: hidden;
	}
</style>
