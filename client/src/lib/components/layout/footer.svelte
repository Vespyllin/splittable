<script lang="ts">
	import { cn } from '$lib/utils';

	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<footer
	class={cn('text-muted-foreground justify-evenly text-center text-[0.7rem] text-sm', className)}
>
	Għal Kyle għax kien qed jitnejjikli bid-degree.
</footer>
