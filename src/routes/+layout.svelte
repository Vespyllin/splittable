<script>
	import Footer from '$lib/components/layout/footer.svelte';
	import '../app.pcss';
	import { ModeWatcher } from 'mode-watcher';
</script>

<svelte:head>
	<title>BillSplitter.Svelte</title>
	<meta
		name="viewport"
		content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
	/>
</svelte:head>

<main class="relative flex h-screen max-h-svh flex-col overflow-scroll p-8 pb-2">
	<slot />
	<Footer />
</main>
