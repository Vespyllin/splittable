<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import { cn } from '$lib/utils';

	let className: string | undefined | null = undefined;
	export { className as class };
	export let username = '';
	export let lobbyName = '';
	export let isLoading = false;
	// TODO: make fetch req, expose validationError and set it to a descriptive text to be shown on screen
</script>

<div
	class={cn('flex', className)}
	on:change={() => {
		console.log('TODO: LobbyInput submit handler');
	}}
>
	<Input
		id="username"
		placeholder="nickname"
		type="text"
		autocapitalize="none"
		autocorrect="off"
		disabled={isLoading}
		bind:value={username}
	/>
	<Input
		id="lobby"
		placeholder="lobby name"
		type="text"
		autocapitalize="none"
		autocorrect="off"
		disabled={isLoading}
		bind:value={lobbyName}
	/>
</div>
