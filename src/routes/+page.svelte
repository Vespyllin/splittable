<script lang="ts">
	import JoinLobbyForm from '$lib/components/joinLobbyForm.svelte';
	import LoveSpiteHeader from '$lib/components/loveSpiteHeader.svelte';
	import Footer from '$lib/components/footer.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	let isLoading = false;
</script>

<div class="flex h-screen w-screen flex-col p-8">
	<LoveSpiteHeader class="mb-10 mt-5 h-[25%] justify-center" />

	<JoinLobbyForm bind:isLoading />

	<div class="my-2 flex-col space-y-2 text-center">
		<h1 class="text-xl font-semibold tracking-tight">Or</h1>
	</div>
	<a href="/create">
		<Button disabled={isLoading} class="w-full">Create Your Own Lobby</Button>
	</a>

	<Footer />
</div>
