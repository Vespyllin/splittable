<script>
	import Footer from '$lib/components/layout/footer.svelte';
	import '../app.pcss';
</script>

<svelte:head>
	<title>Splittable</title>
	<meta
		name="viewport"
		content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
	/>
</svelte:head>

<main class="flex h-screen max-h-svh flex-col overflow-hidden p-8 pb-2">
	<slot />
	<Footer />
</main>
