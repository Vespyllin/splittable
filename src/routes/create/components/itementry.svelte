<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	import { cn } from '$lib/utils';

	let className: string | undefined | null = undefined;
	export { className as class };

	const currencyRegex = /^[0-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/;

	export let name: string;
	export let total: string;
	export let quantity: string;
	export let price: string;

	export let buttonText: string;

	export let submitCallback: ((e: any) => void) | ((e: any) => Promise<void>);
	export { submitCallback as onSubmit };

	const validatePrice = (event: any) => {
		const value: string | null | undefined = event.target.value;
		if (!value || isNaN(parseFloat(value))) return;
		if (!currencyRegex.test(value)) price = value.substring(0, value.length - 1);
	};

	const validateTotal = (event: any) => {
		const value: string | null | undefined = event.target.value;
		if (!value || isNaN(parseFloat(value))) return;
		if (!currencyRegex.test(value)) total = value.substring(0, value.length - 1);
	};

	const validateQuantity = (event: any) => {
		const value: string | null | undefined = event.target.value;
		if (!value) return;
		quantity = `${parseInt(value)}`;
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
</script>

<div class={cn('grid grid-cols-3 gap-2', className)}>
	<Input class="col-span-2" placeholder="Item Name" bind:value={name} />
	<Input
		placeholder="Item Total"
		type="number"
		bind:value={total}
		on:input={validateTotal}
		on:change={() => {
			total = padDecimal(total);

			if (quantity) {
				price = padDecimal(`${round(parseFloat(total) / parseInt(quantity))}`);
			} else if (price) quantity = padDecimal(`${round(parseFloat(total) / parseInt(price))}`);
		}}
	/>
	<Input
		placeholder="# Ordered"
		type="number"
		bind:value={quantity}
		on:input={validateQuantity}
		on:change={() => {
			if (price) total = padDecimal(`${round(parseFloat(price) * parseInt(quantity))}`);
			else if (total) price = padDecimal(`${round(parseFloat(total) / parseInt(quantity))}`);
		}}
	/>
	<Input
		placeholder="Item Price"
		type="number"
		bind:value={price}
		on:input={validatePrice}
		on:change={() => {
			price = padDecimal(price);
			if (quantity) total = padDecimal(`${round(parseFloat(price) * parseInt(quantity))}`);
			else if (total) quantity = padDecimal(`${round(parseFloat(total) * parseInt(price))}`);
		}}
	/>
	<Button
		type="reset"
		on:click={(e) => {
			submitCallback(e);

			name = '';
			total = '';
			quantity = '';
			price = '';
		}}>{buttonText}</Button
	>
</div>
