<script>
	import { page } from '$app/state';
	let {
		title = 'Website PC IKPM Surabaya',
		description = 'Kanal berita resmi PC IKPM Gontor Surabaya.',
		image = '/thumbnail.webp',
		url = '',
		type = 'website'
	} = $props();

	const baseDomain = 'https://pcikpmsurabaya.netlify.app';
	const absoluteImage = $derived(image.startsWith('http') ? image : `${baseDomain}${image}`);

	const autoUrl = $derived(url || `${baseDomain}${page.url.pathname}`);

	// Judul default jika title diisi manual
	const fullTitle = $derived(
		title.includes('PC IKPM Gontor Surabaya') || title.toLowerCase().startsWith('tiket')
			? title
			: `${title} - PC IKPM Gontor Surabaya`
	);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={autoUrl} />

	<meta property="og:type" content={type} />
	<meta property="og:url" content={autoUrl} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={absoluteImage} />
	<meta property="og:image:secure_url" content={absoluteImage} />
	<meta property="og:image:width" content="600" />
	<meta property="og:image:height" content="600" />

	<meta property="twitter:card" content="summary" />
	<meta property="twitter:url" content={autoUrl} />
	<meta property="twitter:title" content={fullTitle} />
	<meta property="twitter:description" content={description} />
	<meta property="twitter:image" content={image} />
</svelte:head>
