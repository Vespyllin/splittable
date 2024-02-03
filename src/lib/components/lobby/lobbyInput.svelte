<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';

	import type { ValidationStatus } from '$lib/types/state';
	import { cn } from '$lib/utils';

	let className: string | undefined | null = undefined;
	export { className as class };

	export let error: ValidationStatus;
	export let username: string = '';
	export let lobbyName: string = '';

	export let isLoading = false;
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
</div>
