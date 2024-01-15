<script lang="ts">
	import { cn } from '$lib/utils';

	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<a href="/" class={cn('flex h-[8%] justify-center', className)}>
	<img src="./bill.png" alt="" class="left-0 h-full invert" />
	<h1 class="my-auto ml-5 text-center text-4xl text-primary">Il-Bill Splitter</h1>
</a>
