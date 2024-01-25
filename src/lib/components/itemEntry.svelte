<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	import { cn } from '$lib/utils';
	import { Label } from './ui/label';

	let className: string | undefined | null = undefined;
	export { className as class };

	const currencyRegex = /^[0-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/;

	export let entryData: {
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

	let { name, total, quantity, price } = entryData;

	$: entryData = {
		name,
		total,
		quantity,
		price
	};

	export let submitCallback: ((e: any) => void) | ((e: any) => Promise<void>);
	export { submitCallback as onSubmit };

	const validateCurrency = (value: string) => {
		const decimal = value.indexOf('.');
		const correctLength =
			decimal > -1 ? Math.min(2, value.length - decimal) + decimal + 1 : value.length;
		if (!currencyRegex.test(value)) value = value.substring(0, correctLength);

		return padDecimal(value);
	};

	const padDecimal = (value: string) => {
		const decimalIdx = value.lastIndexOf('.');
		const { length } = value;

		if (decimalIdx != -1 && length - decimalIdx < 3) {
			return value.padEnd(2 * length - decimalIdx - 1, '0');
		} else if (decimalIdx == -1) {
			return `${value}.00`;
		}

		return value;
	};

	const round = (value: number) => {
		const roundedValue = Math.round(value * 100) / 100;
		if (isNaN(roundedValue)) return value;
		return roundedValue;
	};

	const p = (v: any) => {
		return v * 1;
	};
</script>

<div class={cn('grid grid-cols-6 gap-2', className)}>
	<Input class="col-span-5 text-lg" placeholder="Item Name" bind:value={name} />
	<!-- TODO: Trash Icon -->
	<Button
		type="reset"
		on:click={(e) => {
			submitCallback(e);
			name = '';
			total = '';
			quantity = '';
			price = '';
		}}>-</Button
	>
	<div class="col-span-2">
		<Input
			placeholder="Quantity"
			type="number"
			class="text-lg"
			bind:value={quantity}
			on:change={() => {
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
			on:change={() => {
				total = validateCurrency(total);
				if (quantity) price = padDecimal(`${round(p(total) / p(quantity))}`);
			}}
		/>
	</div>
</div>
