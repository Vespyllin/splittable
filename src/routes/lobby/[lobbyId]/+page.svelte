<script lang="ts">
	import { Socket, io } from 'socket.io-client';

	export let data;

	let content: string = 'waiting';

	const setSocket = async () => {
		const socketCheck = await fetch(`http://localhost:5173/check_lobby/${data.lobbyID}`);

		if (socketCheck.status != 200) return false;

		const URL = `ws://localhost:3000/${data.lobbyID}`;
		console.log(`URL ${URL}`);
		const socket = io(URL);
		console.log(socket.connected);
		socket.on('connect', () => {
			console.log('Successfully connected to socket');
		});

		socket.on('messages', (messages: any) => {
			console.log('received msg');
			content = messages;
		});

		return true;
	};

	let haveSocketPromise = setSocket();
</script>

<!-- {#await haveSocketPromise}
	<p>...waiting</p>
{:then haveSocket}
	{#if haveSocket}
		<p>Found</p>
	{:else}
		<p>Not Found</p>
	{/if}
{:catch error}
	<p style="color: red">{error.message}</p>
{/await} -->

{content}
