<script lang="ts" generics="P extends Record<string, any>">
	import { onMount, type Component } from 'svelte';

	// P adalah tipe props dari komponen yang akan di-load
	let {
		load,
		props
	}: {
		load: () => Promise<{ default: Component<P> }>;
		props: P;
	} = $props();

	let LoadedComponent = $state<Component<P>>();

	onMount(async () => {
		const module = await load();
		LoadedComponent = module.default;
	});
</script>

{#if LoadedComponent}
	<LoadedComponent {...props} />
{/if}
