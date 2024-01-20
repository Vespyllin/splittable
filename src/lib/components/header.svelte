<script lang="ts">
	import { cn } from '$lib/utils';

	let className: string | undefined | null = undefined;
	export { className as class };

	export let img = './bill.png';
</script>

<a href="/" class={cn('flex h-[8%] justify-center', className)}>
	<img src={img} alt="" class="left-0 h-full invert" />
	<h1 class="my-auto ml-5 text-center text-4xl text-primary">Splittable</h1>
</a>
