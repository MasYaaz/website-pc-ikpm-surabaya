<script lang="ts">
	import type { HTMLInputAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import { X, Eye, EyeOff, Plus, Minus } from 'lucide-svelte';
	import { fly, scale } from 'svelte/transition';
	import { type Snippet } from 'svelte';

	interface Props {
		value: string | number;
		label?: string;
		name?: string;
		maxLength?: number;
		placeholder?: string;
		type?: 'text' | 'password' | 'tel' | 'number';
		icon?: any;
		isClearable?: boolean;
		min?: number;
		max?: number;
		required?: boolean;
		onClear?: HTMLButtonAttributes['onclick'];
		onFocus?: HTMLInputAttributes['onfocus'];
		onInput?: (e: Event & { currentTarget: EventTarget & HTMLInputElement }) => void;
		children?: Snippet;
	}

	let {
		value = $bindable(),
		label,
		name,
		maxLength,
		placeholder = '',
		type = 'text',
		icon: LeadingIcon,
		isClearable = true,
		min = 1,
		max = 99,
		required = false,
		onClear,
		onFocus,
		onInput,
		children
	}: Props = $props();

	let showPassword = $state(false);

	// Logic Reaktif Svelte 5
	const currentType = $derived(type === 'password' ? (showPassword ? 'text' : 'password') : type);
	const derivedMaxLength = $derived(
		maxLength || (type === 'tel' ? 15 : type === 'number' ? 3 : 100)
	);
	const isNumberType = $derived(type === 'number');

	const handleInput = (e: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		const input = e.currentTarget;

		if (type === 'tel') {
			input.value = input.value.replace(/[^0-9+]/g, '');
			value = input.value;
		}

		if (isNumberType) {
			let val = input.value.replace(/[^0-9]/g, '');
			let num = parseInt(val);

			if (!isNaN(num)) {
				if (num > max) num = max;
				if (num < min && val !== '') num = min;
				value = num;
				input.value = num.toString();
			} else {
				value = '';
			}
		}

		if (onInput) onInput(e);
	};

	const step = (amount: number) => {
		if (!isNumberType) return;
		const current = typeof value === 'number' ? value : parseInt(value as string) || 0;
		const newValue = current + amount;

		if (newValue >= min && newValue <= max) {
			value = newValue;
		}
	};
</script>

<div class="w-full space-y-1.5">
	{#if label}
		<label for={name} class="ml-1 text-xs font-bold tracking-wider text-green-800 uppercase">
			{label}
		</label>
	{/if}

	<div class="group relative">
		{#if LeadingIcon}
			<div
				class="absolute top-1/2 left-4 -translate-y-1/2 transition-colors duration-200
                       {value
					? 'text-green-900'
					: 'text-green-900/50 group-focus-within:text-green-900'}"
			>
				<LeadingIcon size={18} strokeWidth={2} />
			</div>
		{/if}

		<input
			id={name}
			type={currentType}
			{name}
			bind:value
			{placeholder}
			{required}
			onfocus={onFocus}
			oninput={handleInput}
			inputmode={isNumberType || type === 'tel' ? 'numeric' : 'text'}
			autocomplete="off"
			maxlength={derivedMaxLength}
			class="w-full rounded-xl border border-green-900/20 bg-stone-50/50 py-3 pr-12 font-medium text-green-900
                   placeholder-green-900/50 transition-all outline-none
                   focus:border-green-900 focus:bg-white
                   {LeadingIcon ? 'pl-11' : 'pl-4'}"
		/>

		<div class="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1.5">
			{#if isNumberType}
				<div class="mr-1 flex items-center gap-1" in:scale>
					<button
						type="button"
						onclick={() => step(-1)}
						disabled={Number(value) <= min}
						class="flex h-7 w-7 items-center justify-center rounded-lg border border-green-900/20 bg-white text-green-900/80 transition-all hover:border-green-900 hover:text-green-900 disabled:opacity-30"
					>
						<Minus size={14} />
					</button>
					<button
						type="button"
						onclick={() => step(1)}
						disabled={Number(value) >= max}
						class="flex h-7 w-7 items-center justify-center rounded-lg border border-green-900/20 bg-white text-green-900/80 transition-all hover:border-green-900 hover:text-green-900 disabled:opacity-30"
					>
						<Plus size={14} />
					</button>
				</div>
			{/if}

			{#if type === 'password' && value}
				<button
					type="button"
					transition:fly={{ duration: 150, x: 5 }}
					onclick={() => (showPassword = !showPassword)}
					class="p-1.5 text-green-900/80 transition-colors hover:text-green-900"
				>
					{#if showPassword}
						<EyeOff size={18} />
					{:else}
						<Eye size={18} />
					{/if}
				</button>
			{/if}

			{#if isClearable && value && !isNumberType}
				<button
					type="button"
					transition:fly={{ duration: 150, x: 5 }}
					onclick={onClear}
					class="p-1.5 text-green-900/80 transition-colors hover:text-red-600"
				>
					<X size={18} />
				</button>
			{/if}
		</div>
	</div>

	{#if children}
		<div class="mt-1 px-1">
			{@render children()}
		</div>
	{/if}
</div>

<style>
	input {
		-webkit-font-smoothing: antialiased;
		text-rendering: optimizeLegibility;
	}

	/* Hilangkan spinner default browser */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
</style>
