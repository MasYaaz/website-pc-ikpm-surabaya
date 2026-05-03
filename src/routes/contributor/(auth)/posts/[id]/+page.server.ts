import { db } from '$lib/server/db';
import { posts } from '$lib/server/db/schema';
import { requireAuth } from '$lib/utils/requireAuth';
import { error, fail, redirect } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import slugify from 'slugify';

// 1. LOAD DATA: Mengambil data artikel untuk ditampilkan di form
export const load = async ({ params, locals }) => {
	const session = await requireAuth(locals);
	const postId = Number(params.id);

	if (isNaN(postId)) throw error(400, 'ID Post tidak valid');

	// Ambil data post dan join dengan media untuk thumbnail
	const postData = await db.query.posts.findFirst({
		where: (posts, { eq }) => eq(posts.id, postId),
		with: {
			featuredImage: true
		}
	});

	if (!postData) throw error(404, 'Artikel tidak ditemukan');

	// Proteksi: Hanya author yang bisa edit artikelnya sendiri
	if (postData.authorId !== session.user.id) {
		throw error(403, 'Anda tidak memiliki akses untuk menyunting artikel ini');
	}

	return {
		post: postData
	};
};

// 2. ACTIONS: Menangani pengiriman form (Update & Delete)
export const actions = {
	// Action untuk Update Artikel
	update: async ({ request, params, locals }) => {
		// 1. Ambil user dengan destructuring
		const { user } = await requireAuth(locals);
		const postId = Number(params.id);

		const formData = await request.formData();
		const title = formData.get('title') as string;
		const content = formData.get('content') as string;
		const excerpt = formData.get('excerpt') as string;
		const status = formData.get('status') as 'draft' | 'publish';
		const featuredImageId = formData.get('featuredImageId');

		if (!title || !content) {
			return fail(400, { message: 'Judul dan konten tidak boleh kosong.' });
		}

		const newSlug = slugify(title, { lower: true });

		try {
			// Gunakan user.id (bukan session.user.id)
			await db
				.update(posts)
				.set({
					title,
					slug: newSlug,
					content,
					excerpt,
					status,
					featuredImageId: featuredImageId ? Number(featuredImageId) : null,
					updatedAt: new Date()
				})
				.where(and(eq(posts.id, postId), eq(posts.authorId, user.id)));
		} catch (err) {
			console.error('Update Error:', err);
			return fail(500, { message: 'Gagal memperbarui artikel.' });
		}

		// REDIRECT HARUS DI LUAR TRY/CATCH
		throw redirect(303, '/contributor/posts');
	},

	// Action tambahan jika kamu ingin ada tombol hapus di halaman edit
	delete: async ({ params, locals }) => {
		const { user } = await requireAuth(locals);
		const postId = Number(params.id); // Diambil otomatis dari URL /posts/1

		if (isNaN(postId)) return fail(400, { message: 'ID tidak valid' });

		try {
			await db.delete(posts).where(and(eq(posts.id, postId), eq(posts.authorId, user.id)));
		} catch (err) {
			console.error('Delete Error:', err);
			return fail(500, { message: 'Gagal menghapus artikel.' });
		}

		return { success: true };
	}
};
