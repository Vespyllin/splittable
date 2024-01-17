<script lang="ts">
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
</script>

<div class="flex w-full">
	<Skeleton class="h-12 w-12 rounded-full" />
	<Skeleton class="h-12 w-12 rounded-full" />
	<Skeleton class="h-12 w-12 rounded-full" />
</div>

<Separator class="my-2" />

<div class="grid grid-cols-3 gap-1">
	<div class="col-span-3 h-10"><Skeleton class=" h-full w-full" /></div>
	<div class="h-10"><Skeleton class=" h-full w-full" /></div>
	<div class="h-10"><Skeleton class=" h-full w-full" /></div>
	<div class="h-10"><Skeleton class=" h-full w-full" /></div>
</div>
