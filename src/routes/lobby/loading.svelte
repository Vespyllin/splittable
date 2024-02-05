<script>
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
</script>

<div class="mb-4 space-y-1">
	<Skeleton class="h-8 w-[70%] bg-muted" />
	<Skeleton class="h-8 w-full " />
	<Skeleton class="h-8 w-full" />
</div>
<Skeleton class="mb-2 h-8 w-[35%] bg-muted" />
<div class="space-y-3">
	{#each { length: 3 } as _}
		<div class="grid grid-cols-3 gap-2">
			<Skeleton class="col-span-3 h-8" />
			<Skeleton class="h-8" />
			<Skeleton class="h-8" />
			<Skeleton class="h-8" />
		</div>
	{/each}
</div>
