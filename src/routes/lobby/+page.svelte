<script lang="ts">
	import { io } from 'socket.io-client';

	const socket = io('ws://localhost:3000');

	socket.on('connect', () => {
		console.log('Successfully connected to socket');
	});

	let content: string;
	socket.on('messages', (messages: any) => {
		content = messages;
	});
</script>

{content}
