<script lang="ts">
	import CreateLobbyForm from './components/createLobbyForm.svelte';
	import MinimalHeader from '$lib/components/header/header.svelte';
	import Footer from '$lib/components/footer/footer.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import type { ReceiptEntry } from '$lib/types/state';

	let lobbyName: string;
	let data: ReceiptEntry[] = [];
</script>

<div class="flex h-screen w-screen flex-col p-8">
	<MinimalHeader />

	<Separator class="my-3" />

	<CreateLobbyForm bind:lobbyName bind:data />

	<Footer />
</div>
