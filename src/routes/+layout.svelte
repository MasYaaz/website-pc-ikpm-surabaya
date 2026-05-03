<script lang="ts">
	import './layout.css';
	import faviconLight from '$lib/assets/logo-light.svg';
	import faviconDark from '$lib/assets/logo-dark.svg';
	import LazyLoad from '$lib/component/page/LazyLoad.svelte';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={faviconLight} media="(prefers-color-scheme: light)" />
	<link rel="icon" href={faviconDark} media="(prefers-color-scheme: dark)" />
</svelte:head>

<LazyLoad load={() => import('$lib/component/UI/MessageBox.svelte')} props={{}} />
{@render children()}
