<script lang="ts">
	import Navbar from '$lib/component/ui/Navbar.svelte';
	import Sidebar from '$lib/component/ui/Sidebar.svelte';

	let { children, data } = $props();
	let isSidebarOpen = $state(false);
</script>

<Navbar bind:isSidebarOpen {data} />
<Sidebar bind:isSidebarOpen {data} />
{@render children()}
