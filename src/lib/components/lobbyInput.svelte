<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import type { Error } from '$lib/types/state';
	import { cn } from '$lib/utils';
	import { getContext, setContext } from 'svelte';
	import { writable } from 'svelte/store';

	let className: string | undefined | null = undefined;
	export { className as class };

	export let error: Error[];
	export let username: string = '';
	export let lobbyName: string = '';

	let userDataStore = writable({ username: '', lobbyName: '' });
	setContext('userData', userDataStore);

	export let isLoading = false;

	$: {
		$userDataStore = {
			username,
			lobbyName
		};
	}
	// TODO: make fetch req, expose validationError and set it to a descriptive text to be shown on screen
	// TODO: Input validation
</script>

<div class={cn('flex', className)} on:change={() => {}}>
	<Input
		id="username"
		placeholder="nickname"
		type="text"
		autocapitalize="none"
		autocorrect="off"
		disabled={isLoading}
		class={error.includes('Username') ? 'border-red-600' : ''}
		bind:value={username}
	/>
	<Input
		id="lobby"
		placeholder="lobby name"
		type="text"
		autocapitalize="none"
		autocorrect="off"
		disabled={isLoading}
		class={error.includes('Lobby') ? 'border-red-600' : ''}
		bind:value={lobbyName}
	/>

	{#if error.length > 0}
		{#if error.includes('Lobby')}
			<p class="text-red-600">Lobby does not exist. Create a lobby by clicking the button below.</p>
		{:else if error.includes('Username')}
			<p class="text-red-600">Username is already taken. Pick a cooler one.</p>
		{:else}
			<p class="text-red-600">Server is not responding. Please try again later.</p>
		{/if}
	{/if}
</div>
