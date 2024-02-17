<script lang="ts">
	import { PUBLIC_SOCKET_ENDPOINT } from '$env/static/public';

	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { ArrowLeft } from 'radix-icons-svelte';

	import MinimalHeader from '$lib/components/layout/header.svelte';
	import ContributionDialog from '$lib/components/contributions/contributionDialog.svelte';
	import Loading from './loading.svelte';

	import { io } from 'socket.io-client';
	import { goto } from '$app/navigation';

	import { cn, Euro } from '$lib/utils';
	import type { Lobby } from '$lib/types/lobby';

	import { usernameStore } from '$lib/store/username';
	import type { UpdatePayload } from '$lib/types/server';

	export let data;
	$usernameStore = data.username;

	let state: Lobby = {
		contributors: [],
		entries: []
	};

	const socket = io(`${PUBLIC_SOCKET_ENDPOINT}/${data.lobbyId}`);

	const init = async () => {
		const registerRes = await socket.timeout(3000).emitWithAck('register', $usernameStore);

		if (!registerRes || registerRes.status == 'Failure') {
			socket.disconnect();
			throw new Error('Could not register with server.');
		}

		const { contributors, entries } = registerRes.data as Lobby;
		contributors.sort((a, b) => (b == $usernameStore ? 1 : 0) - (a == $usernameStore ? 1 : 0));

		state = { entries, contributors };

		socket.on('join', (username: string) => {
			state.contributors.push(username);
			state = { ...state };
		});

		socket.on('update', (payload: UpdatePayload) => {
			const { username, itemName, amount } = payload;

			const entryIdx = state.entries.findIndex((x) => {
				return x.item.name == itemName;
			});

			if (entryIdx === -1) throw new Error(`State inconsistency error.`);

			const contributionIdx = state.entries[entryIdx].contributions.findIndex(
				(x) => x.username == username
			);

			if (amount != 0) {
				if (contributionIdx !== -1) {
					state.entries[entryIdx].contributions[contributionIdx].amount = amount;
				} else {
					state.entries[entryIdx].contributions.push({ username, amount });
				}

				state.entries[entryIdx].contributions.sort(
					({ username: a }, { username: b }) =>
						(b == $usernameStore ? 1 : 0) - (a == $usernameStore ? 1 : 0)
				);
			} else {
				state.entries[entryIdx].contributions.splice(contributionIdx, 1);
			}

			state = { ...state };
		});

		socket.on('leave', (leaverName: string) => {
			state.contributors = state.contributors.filter((contributor) => contributor != leaverName);
			state.entries = state.entries.map((entry) => {
				entry.contributions = entry.contributions.filter(
					(contribution) => contribution.username != leaverName
				);
				return entry;
			});

			state = { ...state };
		});

		return true;
	};
</script>

<div class="flex grow flex-col">
	<MinimalHeader />

	<Separator class="my-3" />

	{#await init()}
		<Loading />
	{:then}
		<h1 class="text-2xl font-semibold">Lobby Members</h1>
		<div class="my-2 flex w-full flex-wrap">
			{#each state.contributors as contributor, idx}
				<p
					class={cn(
						'mx-1 text-xl',
						contributor == data.username ? 'text-primary' : 'text-muted-foreground'
					)}
				>
					{#if idx != state.contributors.length - 1}
						{contributor}<span class="text-foreground">,</span>
					{:else}
						{contributor}
					{/if}
				</p>
			{/each}
		</div>

		<div class="my-2 flex">
			<h2 class="text-foreground mr-2 text-xl font-semibold">My Total:</h2>
			<p class="text-primary text-xl font-semibold">
				{Euro.format(
					state.entries
						.map(
							(x) =>
								x.item.price *
								(x.contributions.find((x) => x.username == data.username)?.amount ?? 0)
						)
						.reduce((acc, val) => acc + val, 0)
				)}
			</p>
		</div>

		<div class="mt-4 h-full">
			<h1 class="text-2xl font-semibold">Entries</h1>

			<div class="flew mb-2 grow flex-col">
				{#each state.entries as entry, idx}
					<ContributionDialog
						{entry}
						defaultValue={entry.contributions.find((x) => x.username == data.username)?.amount}
						sendUpdate={(v) => {
							socket.emit('update', {
								username: data.username,
								itemName: entry.item.name,
								amount: v
							});
						}}
					/>
					{#if state.entries.length - 1 != idx}
						<Separator class="bg-primary mx-auto  mt-3 w-[75%]" />
					{/if}
				{/each}
			</div>
		</div>
	{:catch error}
		<div class="flex h-full w-full flex-col">
			<h1 class="text-primary text-center text-3xl font-semibold">
				An Unexpected Error has Occurred
			</h1>
			<p class="mt-4 text-lg">Please try to join the lobby again through the home page.</p>
			<Button class="mx-auto mt-2 h-10 w-1/3" on:click={() => goto('/')}>
				<ArrowLeft size={35} />
			</Button>
			<p class="mt-4 text-lg text-red-600">Error Message: {error.message}</p>
		</div>
	{/await}
</div>
