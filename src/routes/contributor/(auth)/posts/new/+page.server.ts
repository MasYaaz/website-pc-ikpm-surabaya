import { db } from '$lib/server/db';
import { posts } from '$lib/server/db/schema';
import { requireAuth } from '$lib/utils/requireAuth.js';
import { fail, redirect } from '@sveltejs/kit';
import slugify from 'slugify';

export const actions = {
	default: async ({ request, locals }) => {
		const { user } = await requireAuth(locals);
		const formData = await request.formData();

		// 1. Ambil data & bersihkan (trim)
		const title = (formData.get('title') as string)?.trim();
		const content = (formData.get('content') as string)?.trim();
		const excerpt = (formData.get('excerpt') as string)?.trim();
		const featuredImageId = formData.get('featuredImageId');
		const status = formData.get('status') as 'draft' | 'publish';

		// 2. VALIDASI INPUT (Guard Clauses)
		// Simpan error dalam objek agar bisa ditampilkan di UI per field
		const errors: Record<string, string> = {};

		if (!title) errors.title = 'Judul artikel tidak boleh kosong';
		else if (title.length < 5) errors.title = 'Judul terlalu pendek (min. 5 karakter)';

		if (!content || content === '<p></p>') errors.content = 'Konten artikel tidak boleh kosong';

		// Jika ada error validasi, kirim balik ke client
		if (Object.keys(errors).length > 0) {
			return fail(400, {
				errors,
				data: { title, excerpt, featuredImageId, status } // Kirim balik data agar input tidak hilang
			});
		}

		// 3. Generate Slug
		const slug =
			slugify(title, { lower: true, strict: true }) + '-' + Math.random().toString(36).slice(-4);

		try {
			await db.insert(posts).values({
				authorId: user.id,
				title,
				slug,
				content,
				excerpt: excerpt || null,
				status: status || 'draft',
				featuredImageId: featuredImageId ? Number(featuredImageId) : null,
				postType: 'post'
			});
		} catch (err: any) {
			// Cek error spesifik dari Postgres (misal slug duplikat)
			if (err.code === '23505') {
				return fail(400, { message: 'Judul ini sudah digunakan, coba judul lain.' });
			}

			console.error('Error Database:', err);
			return fail(500, { message: 'Terjadi kesalahan sistem, silakan coba lagi nanti.' });
		}

		throw redirect(303, '/contributor/posts');
	}
};
