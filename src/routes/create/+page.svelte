<script lang="ts">
	import CreateLobbyForm from './createlobbyform.svelte';
	import MinimalHeader from '$lib/components/header/header.svelte';
	import Footer from '$lib/components/footer/footer.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	let lobbyName: string;
	let data: { name: string; total: string; quantity: string; price: string }[] = [];
</script>

<div class="flex h-screen w-screen flex-col p-8">
	<MinimalHeader />

	<Separator class="my-3" />

	<CreateLobbyForm bind:lobbyName bind:data />

	<Footer />
</div>
