<script lang="ts">
	import { onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Image from '@tiptap/extension-image';
	import Link from '@tiptap/extension-link';
	import Underline from '@tiptap/extension-underline';
	import TableRow from '@tiptap/extension-table-row';
	import TableCell from '@tiptap/extension-table-cell';
	import TableHeader from '@tiptap/extension-table-header';
	import Youtube from '@tiptap/extension-youtube';
	import Placeholder from '@tiptap/extension-placeholder';
	import { Table } from '@tiptap/extension-table';
	import {
		Bold,
		Italic,
		Underline as UnderIcon,
		Heading1,
		Heading2,
		List,
		Quote,
		Image as ImageIcon,
		Table as TableIcon,
		Undo,
		Redo
	} from 'lucide-svelte';

	const YoutubeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.14 1 12 1 12s0 3.86.46 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.86 23 12 23 12s0-3.86-.46-5.58z"></path><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon></svg>`;

	// PROPS: showMedia adalah fungsi yang dipassing dari +page.svelte
	let { content = $bindable(), showMedia } = $props();

	let element = $state<HTMLElement>();
	let editor = $state<Editor>();

	// EXPORT: Agar bisa dipanggil oleh editorInstance.insertImage() di +page.svelte
	export function insertImage(url: string) {
		editor?.chain().focus().setImage({ src: url }).run();
	}

	$effect(() => {
		if (element && !editor) {
			editor = new Editor({
				element,
				extensions: [
					StarterKit,
					Underline,
					Link.configure({
						openOnClick: false,
						HTMLAttributes: { class: 'text-green-700 underline underline-offset-4 font-medium' }
					}),
					Image.configure({
						HTMLAttributes: {
							class: 'rounded-2xl border border-stone-200 shadow-lg my-8 max-w-full'
						}
					}),
					Table.configure({
						resizable: true,
						HTMLAttributes: {
							class: 'border-collapse table-auto w-full border border-stone-200 my-6'
						}
					}),
					TableRow,
					TableHeader,
					TableCell,
					Youtube.configure({
						width: 840,
						height: 480,
						HTMLAttributes: {
							class: 'rounded-2xl overflow-hidden shadow-xl my-10 mx-auto aspect-video'
						}
					}),
					Placeholder.configure({
						placeholder: 'Tuliskan pemikiran atau berita terbaru di sini...'
					})
				],
				content,
				editorProps: {
					attributes: {
						class:
							'prose prose-stone prose-lg max-w-none focus:outline-none min-h-[600px] px-8 py-12 lg:px-16 selection:bg-green-100 selection:text-green-900'
					}
				},
				onUpdate: ({ editor }) => (content = editor.getHTML())
			});
		}
	});

	onDestroy(() => editor?.destroy());

	const addYoutube = () => {
		const url = window.prompt('Masukkan URL YouTube:');
		if (url) editor?.commands.setYoutubeVideo({ src: url });
	};
</script>

<div
	class="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-stone-200 bg-white transition-all duration-300 focus-within:border-green-900/20 focus-within:shadow-2xl focus-within:shadow-green-900/5"
>
	<div class="flex flex-col overflow-hidden">
		<div
			class="sticky top-0 z-20 flex flex-wrap items-center gap-1.5 border-b border-stone-100 bg-white/70 p-3 backdrop-blur-xl transition-colors group-focus-within:bg-white/90"
		>
			<div class="flex items-center gap-1 px-1">
				<button
					type="button"
					onclick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
					class="flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 {editor?.isActive(
						'heading',
						{ level: 1 }
					)
						? 'bg-stone-900 text-white shadow-md'
						: 'text-stone-400 hover:bg-stone-100 hover:text-stone-900'}"
				>
					<Heading1 size={18} strokeWidth={2.5} />
				</button>
				<button
					type="button"
					onclick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
					class="flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 {editor?.isActive(
						'heading',
						{ level: 2 }
					)
						? 'bg-stone-900 text-white shadow-md'
						: 'text-stone-400 hover:bg-stone-100 hover:text-stone-900'}"
				>
					<Heading2 size={18} strokeWidth={2.5} />
				</button>
			</div>

			<div class="mx-1 h-6 w-px bg-stone-200/60"></div>

			<div class="flex items-center gap-1 px-1">
				<button
					type="button"
					onclick={() => editor?.chain().focus().toggleBold().run()}
					class="flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 {editor?.isActive(
						'bold'
					)
						? 'bg-stone-900 text-white'
						: 'text-stone-400 hover:bg-stone-100 hover:text-stone-900'}"
				>
					<Bold size={18} strokeWidth={2.5} />
				</button>
				<button
					type="button"
					onclick={() => editor?.chain().focus().toggleItalic().run()}
					class="flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 {editor?.isActive(
						'italic'
					)
						? 'bg-stone-900 text-white'
						: 'text-stone-400 hover:bg-stone-100 hover:text-stone-900'}"
				>
					<Italic size={18} strokeWidth={2.5} />
				</button>
				<button
					type="button"
					onclick={() => editor?.chain().focus().toggleUnderline().run()}
					class="flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 {editor?.isActive(
						'underline'
					)
						? 'bg-stone-900 text-white'
						: 'text-stone-400 hover:bg-stone-100 hover:text-stone-900'}"
				>
					<UnderIcon size={18} strokeWidth={2.5} />
				</button>
			</div>

			<div class="mx-1 h-6 w-px bg-stone-200/60"></div>

			<div class="flex items-center gap-1 px-1">
				<button
					type="button"
					onclick={() => editor?.chain().focus().toggleBulletList().run()}
					class="flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 {editor?.isActive(
						'bulletList'
					)
						? 'bg-stone-900 text-white'
						: 'text-stone-400 hover:bg-stone-100 hover:text-stone-900'}"
				>
					<List size={18} strokeWidth={2.5} />
				</button>
				<button
					type="button"
					onclick={() => editor?.chain().focus().toggleBlockquote().run()}
					class="flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 {editor?.isActive(
						'blockquote'
					)
						? 'bg-stone-900 text-white'
						: 'text-stone-400 hover:bg-stone-100 hover:text-stone-900'}"
				>
					<Quote size={18} strokeWidth={2.5} />
				</button>

				<button
					type="button"
					onclick={showMedia}
					class="flex h-9 w-9 items-center justify-center rounded-xl text-stone-400 transition-all hover:bg-green-50 hover:text-green-900"
				>
					<ImageIcon size={18} strokeWidth={2.5} />
				</button>

				<button
					type="button"
					onclick={addYoutube}
					class="flex h-9 w-9 items-center justify-center rounded-xl text-stone-400 transition-all hover:bg-red-50 hover:text-red-600"
				>
					{@html YoutubeIcon}
				</button>
				<button
					type="button"
					onclick={() =>
						editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
					class="flex h-9 w-9 items-center justify-center rounded-xl text-stone-400 transition-all hover:bg-stone-100 hover:text-stone-900"
				>
					<TableIcon size={18} strokeWidth={2.5} />
				</button>
			</div>

			<div class="ml-auto flex items-center gap-1 px-2">
				<button
					type="button"
					onclick={() => editor?.chain().focus().undo().run()}
					class="flex h-8 w-8 items-center justify-center rounded-lg text-stone-300 transition-all hover:bg-stone-50 hover:text-stone-900"
				>
					<Undo size={16} />
				</button>
				<button
					type="button"
					onclick={() => editor?.chain().focus().redo().run()}
					class="flex h-8 w-8 items-center justify-center rounded-lg text-stone-300 transition-all hover:bg-stone-50 hover:text-stone-900"
				>
					<Redo size={16} />
				</button>
			</div>
		</div>

		<div class="flex-1 overflow-y-auto" bind:this={element}></div>
	</div>
</div>

<style>
	:global(.tiptap p.is-editor-empty:first-child::before) {
		content: attr(data-placeholder);
		float: left;
		color: #d6d3d1;
		pointer-events: none;
		height: 0;
	}
	:global(.tiptap table) {
		margin: 2rem 0;
		width: 100%;
		border-collapse: collapse;
		border: 1px solid #e7e5e4;
		border-radius: 0.75rem;
		overflow: hidden;
	}
	:global(.tiptap td, .tiptap th) {
		border: 1px solid #e7e5e4;
		padding: 1rem;
	}
	:global(.tiptap th) {
		background-color: #fafaf9;
		font-weight: 700;
	}
</style>
