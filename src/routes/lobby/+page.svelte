<script lang="ts">
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { ArrowLeft } from 'radix-icons-svelte';

	import MinimalHeader from '$lib/components/layout/header.svelte';
	import ContributionDialog from '$lib/components/contributions/contributionDialog.svelte';
	import Loading from './loading.svelte';

	import { io } from 'socket.io-client';
	import { goto } from '$app/navigation';

	import type { Lobby } from '$lib/types/state';
	import type { UpdatePayload } from '$lib/types/server';
	import { PUBLIC_SOCKET_ENDPOINT } from '$env/static/public';

	export let data;

	let state: Lobby = {
		contributors: [],
		entries: []
	};

	const socket = io(`${PUBLIC_SOCKET_ENDPOINT}/${data.lobbyId}`);

	const init = async () => {
		const registerRes = await socket.timeout(3000).emitWithAck('register', data.username);

		if (!registerRes || registerRes.status == 'Failure') {
			socket.disconnect();
			throw new Error('Could not register with server.');
		}

		state = { ...registerRes.data };

		socket.on('join', (username: string) => {
			state.contributors.push(username);
			state = { ...state };
		});

		socket.on('update', (payload: UpdatePayload) => {
			console.log("RECV on 'UPDATE':", payload);

			const { username, itemName, amount } = payload;

			const entryIdx = state.entries.findIndex((x) => {
				return x.item.name == itemName;
			});

			if (entryIdx === -1) return console.log(`Could not find ${itemName} in state.`);

			const contributionIdx = state.entries[entryIdx].contributions.findIndex(
				(x) => x.username == username
			);

			if (contributionIdx !== -1 && amount != 0) {
				state.entries[entryIdx].contributions[contributionIdx].amount = amount;
			} else {
				if (amount != 0) {
					state.entries[entryIdx].contributions.push(payload);
				} else {
					state.entries[entryIdx].contributions.splice(contributionIdx, 1);
				}
			}

			state = { ...state };
		});

		socket.on('leave', (leaverName: string) => {
			console.log('RECV ON "LEAVE"', leaverName);
			state.contributors = [
				...state.contributors.filter((contributor) => contributor != leaverName)
			];
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

<div class="flex h-full w-full flex-col">
	<MinimalHeader />

	<Separator class="my-3" />

	{#await init()}
		<Loading />
	{:then _init}
		<h1 class="text-2xl font-semibold">Lobby members</h1>
		<div class="my-2 flex w-full flex-wrap">
			{#each state.contributors as contributor, idx}
				<p class="mx-1 text-xl text-primary">
					{#if idx != state.contributors.length - 1}
						{contributor}<span class="text-foreground">,</span>
					{:else}
						{contributor}
					{/if}
				</p>
			{/each}
		</div>
		<div class="mt-4">
			<h1 class="text-2xl font-semibold">Entries</h1>

			<div class="flew grow flex-col">
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
						<Separator class="m-1 mx-auto mb-1 mt-4 w-[75%] bg-primary" />
					{/if}
				{/each}
			</div>
		</div>
	{:catch error}
		<div class="flex h-full w-full flex-col">
			<h1 class="text-center text-3xl font-semibold text-primary">
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
