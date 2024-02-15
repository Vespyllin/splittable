import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, '');
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
};

const currencyRegex = /^[0-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/;

export const validateCurrency = (value: string) => {
	const decimal = value.indexOf('.');
	const correctLength =
		decimal > -1 ? Math.min(2, value.length - decimal) + decimal + 1 : value.length;
	if (!currencyRegex.test(value)) value = value.substring(0, correctLength);

	return padDecimal(value);
};

export const padDecimal = (value: string) => {
	const decimalIdx = value.lastIndexOf('.');
	const { length } = value;

	if (decimalIdx != -1 && length - decimalIdx < 3) {
		return value.padEnd(2 * length - decimalIdx - 1, '0');
	} else if (length == 3 && decimalIdx == 0) {
		return `0${value}`;
	} else if (decimalIdx == -1) {
		return `${value}.00`;
	}

	return value;
};

export const Euro = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'EUR'
});
