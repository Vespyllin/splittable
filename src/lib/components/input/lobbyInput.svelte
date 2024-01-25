<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import type { ValidationStatus } from '$lib/types/state';
	import { cn } from '$lib/utils';
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	let className: string | undefined | null = undefined;
	export { className as class };

	export let error: ValidationStatus;
	export let username: string = '';
	export let lobbyName: string = '';

	let usernameStore = writable(username);
	setContext('username', usernameStore);
	// .subscribe((a) => {console.log('updated username', a)});

	export let isLoading = false;

	let errorMessage = '';
	$: errorMessage = (() => {
		if (!error || error === 'Valid') return '';

		if (error === 'NoLobby') return 'Could not find specified lobby.';
		else if (error === 'BadUsername') return `Username not available in lobby.`;

		return 'Server is not responding. Please try again later.';
	})();

	$: {
		$usernameStore = username;
	}

	// TODO: make fetch req, expose validationError and set it to a descriptive text to be shown on screen
	// TODO: Input validation
</script>

<div class={cn('flex flex-col space-y-2', className)} on:change={() => {}}>
	<Input
		id="username"
		placeholder="nickname"
		type="text"
		autocapitalize="none"
		autocorrect="off"
		disabled={isLoading}
		class={cn('h-auto text-lg', error === 'BadUsername' ? 'border-red-600' : '')}
		bind:value={username}
	/>
	<Input
		id="lobby"
		placeholder="lobby name"
		type="text"
		autocapitalize="none"
		autocorrect="off"
		disabled={isLoading}
		class={cn('h-auto text-lg', error === 'NoLobby' ? 'border-red-600' : '')}
		bind:value={lobbyName}
	/>

	<p class="text-sm text-red-600">{`${errorMessage}`}</p>
</div>
