<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';

	import type { ValidationCode } from '$lib/types/lobby';
	import { cn } from '$lib/utils';

	let className: string | undefined | null = undefined;
	export { className as class };

	export let error: ValidationCode;
	export let username: string = '';
	export let lobbyName: string = '';

	export let isLoading = false;
</script>

<div class={cn('space-y-2', className)} on:change={() => {}}>
	<Input
		id="username"
		placeholder="Username"
		type="text"
		autocapitalize="none"
		autocorrect="off"
		disabled={isLoading}
		class={cn('h-auto text-lg', error === 'Username' && 'border-red-600')}
		bind:value={username}
	/>
	<Input
		id="lobby"
		placeholder="Lobby Name"
		type="text"
		autocapitalize="none"
		autocorrect="off"
		disabled={isLoading}
		class={cn('h-auto text-lg', error === 'Lobby' && 'border-red-600')}
		bind:value={lobbyName}
	/>
</div>
