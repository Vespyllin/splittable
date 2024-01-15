<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	import { cn } from '$lib/utils';

	let className: string | undefined | null = undefined;
	export { className as class };

	export let isLoading = false;
	export let submitCallback: ((e: any) => void) | ((e: any) => Promise<void>);
	export { submitCallback as onSubmit };

	const onSubmit = async (event: any) => {
		console.log(event);
		const formData = new FormData(event.target);
		// console.log([...formData]);
		event.target.reset();

		isLoading = true;

		if (submitCallback) await submitCallback(event);

		setTimeout(() => {
			isLoading = false;
		}, 1000);
	};
</script>

<div class={cn('flex w-full flex-col items-center justify-center', className)}>
	<div class="flex flex-col space-y-2 text-center">
		<h1 class="text-2xl font-bold tracking-tight">Join a Lobby</h1>
		<p class="text-sm text-muted-foreground">Enter your chosen username and lobby code below</p>
	</div>

	<Separator class="my-2 w-full " />

	<!-- TODO: Zod validation -->
	<form on:submit={onSubmit} class="w-full">
		<div class="mt-1 grid gap-2">
			<div>
				<Input
					id="username"
					placeholder="Samwel"
					type="text"
					autocapitalize="none"
					autocorrect="off"
					disabled={isLoading}
				/>
			</div>
			<div>
				<Input
					id="lobby"
					placeholder="Ta' Mattea"
					type="text"
					autocapitalize="none"
					autocorrect="off"
					disabled={isLoading}
				/>
			</div>
			<Button class="mt-1" type="submit" disabled={isLoading}>Join Lobby</Button>
		</div>
	</form>
</div>
