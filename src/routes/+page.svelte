<script lang="ts">
	import JoinLobbyForm from '$lib/components/joinLobbyForm.svelte';
	import LoveSpiteHeader from '$lib/components/loveSpiteHeader.svelte';
	import Footer from '$lib/components/footer.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	let isFetching = false;
</script>

<!-- TODO: Make header smaller, increase size of other elements -->
<div class="flex h-svh w-full flex-col p-8">
	<LoveSpiteHeader class="mb-10 mt-5 h-[15%] justify-center" />

	<JoinLobbyForm bind:isFetching />

	<div class="my-2 flex-col space-y-2 text-center">
		<h1 class="text-2xl font-semibold tracking-tight">Or</h1>
	</div>
	<a href="/create">
		<Button disabled={isFetching} class="h-auto w-full text-xl">Create Your Own Lobby</Button>
	</a>

	<Footer />
</div>
