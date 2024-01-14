<script lang="ts">
	import LobbyForm from '$lib/components/LobbyForm/lobbyform.svelte';
	import LoveSpiteHeader from '$lib/components/LoveSpiteHeader/lovespiteheader.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<div class="flex h-screen w-screen flex-col p-8">
	<LoveSpiteHeader />

	<LobbyForm />

	<div class="my-2 flex-col space-y-2 text-center">
		<h1 class="text-xl font-semibold tracking-tight">Or</h1>
	</div>
	<Button class="w-full">Create Your Own Lobby</Button>

	<div class="absolute inset-x-0 bottom-3 mx-auto h-fit max-w-[95%]">
		<footer class="justify-evenly text-center text-[0.7rem] text-sm text-muted-foreground">
			Għal Kyle għax kien qed jitnejjikli bid-degree.
		</footer>
	</div>
</div>
