<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	import { cn } from '$lib/utils';
	import { Trash } from 'radix-icons-svelte';
	import { padDecimal, validateCurrency } from '$lib/utils';

	const round = (value: number) => {
		const roundedValue = Math.round(value * 100) / 100;
		if (isNaN(roundedValue)) return value;
		return roundedValue;
	};

	let className: string | undefined | null = undefined;
	export { className as class };

	export let item: {
		name: string;
		total: string;
		quantity: string;
		price: string;
	} = {
		name: '',
		total: '',
		quantity: '',
		price: ''
	};

	let { name, total, quantity, price } = item;

	$: item = {
		name,
		total,
		quantity,
		price
	};

	export let onDelete: ((e: any) => void) | ((e: any) => Promise<void>);

	const p = (v: any) => {
		return v * 1;
	};
</script>

<div class={cn('grid grid-cols-6 gap-2', className)}>
	<Input class="col-span-5 text-lg" placeholder="Item Name" bind:value={name} />

	<Button type="reset" on:click={onDelete}><Trash /></Button>
	<div class="col-span-2">
		<Input
			placeholder="Quantity"
			type="number"
			class="text-lg"
			bind:value={quantity}
			on:input={() => {
				quantity = `${p(quantity)}`;
				if (price) total = padDecimal(`${round(p(price) * p(quantity))}`);
				else if (total) price = padDecimal(`${round(p(total) / p(quantity))}`);
			}}
		/>
	</div>
	<div class="col-span-2">
		<Input
			placeholder="Price"
			type="number"
			class="text-lg"
			bind:value={price}
			on:input={() => {
				const validated = price == validateCurrency(price);
				if (validated && quantity) total = padDecimal(`${round(p(price) * p(quantity))}`);
			}}
			on:change={() => {
				price = validateCurrency(price);
				if (quantity) total = padDecimal(`${round(p(price) * p(quantity))}`);
			}}
		/>
	</div>
	<div class="col-span-2">
		<Input
			placeholder="Total"
			type="number"
			class="text-lg"
			bind:value={total}
			on:input={() => {
				const validated = total == validateCurrency(total);
				if (validated && quantity) price = padDecimal(`${round(p(total) / p(quantity))}`);
			}}
			on:change={() => {
				total = validateCurrency(total);
				if (quantity) price = padDecimal(`${round(p(total) / p(quantity))}`);
			}}
		/>
	</div>
</div>
