import { error, fail, redirect } from '@sveltejs/kit';
import slugify from 'slugify';

// 1. LOAD DATA: Mengambil data artikel
export const load = async ({ params, locals }) => {
	// Menggunakan data user yang sudah diolah oleh hooks (Blobs/Cache)
	const user = locals.user;
	const postId = params.id;

	if (!user) return fail(401, { message: 'Unauthorized' });
	if (!postId) throw error(400, 'ID Post tidak valid');

	// Ambil data post menggunakan Supabase Query
	const { data: postData, error: fetchError } = await locals.supabase
		.from('posts')
		.select(
			`
            *,
            featuredImage:media(*) 
        `
		)
		.eq('id', postId)
		.single();

	if (fetchError || !postData) {
		throw error(404, 'Artikel tidak ditemukan');
	}

	// Proteksi: Hanya author atau Admin yang bisa edit
	const isOwner = postData.author_id === user.id;
	const isAdmin = user.role === 'admin';

	if (!isOwner && !isAdmin) {
		throw error(403, 'Anda tidak memiliki akses untuk menyunting artikel ini');
	}

	return {
		post: postData
	};
};

// 2. ACTIONS: Update & Delete
export const actions = {
	update: async ({ request, params, locals }) => {
		const user = locals.user;
		const postId = params.id;

		if (!user) return fail(401, { message: 'Unauthorized' });
		if (user.status === 'nonactive') return fail(403, { message: 'Akun belum aktif.' });

		const formData = await request.formData();
		const title = (formData.get('title') as string)?.trim();
		const content = (formData.get('content') as string)?.trim();
		const excerpt = (formData.get('excerpt') as string)?.trim();
		const status = formData.get('status') as 'draft' | 'publish';
		const featuredImageId = formData.get('featuredImageId');

		if (!title || !content) {
			return fail(400, { message: 'Judul dan konten tidak boleh kosong.' });
		}

		const newSlug =
			slugify(title, { lower: true, strict: true }) + '-' + Math.random().toString(36).slice(-4);

		// Update menggunakan Supabase
		// RLS akan memastikan hanya owner/admin yang bisa melakukan ini jika sudah diset di DB
		const { error: updateError } = await locals.supabase
			.from('posts')
			.update({
				title,
				slug: newSlug,
				content,
				excerpt: excerpt || null,
				status: status || 'draft',
				featured_image_id: featuredImageId ? featuredImageId : null,
				updated_at: new Date().toISOString()
			})
			.eq('id', postId)
			.eq(user.role !== 'admin' ? 'author_id' : 'id', user.role !== 'admin' ? user.id : postId);
		// ^ Logika tambahan jika RLS belum mencakup Admin bypass

		if (updateError) {
			console.error('Update Error:', updateError);
			return fail(500, { message: 'Gagal memperbarui artikel di Supabase.' });
		}

		throw redirect(303, '/contributor/posts');
	},

	delete: async ({ params, locals }) => {
		const user = locals.user;
		const postId = params.id;

		if (!user) return fail(401, { message: 'Unauthorized' });

		// Delete menggunakan Supabase
		const { error: deleteError } = await locals.supabase
			.from('posts')
			.delete()
			.eq('id', postId)
			.eq(user.role !== 'admin' ? 'author_id' : 'id', user.role !== 'admin' ? user.id : postId);

		if (deleteError) {
			console.error('Delete Error:', deleteError);
			return fail(500, { message: 'Gagal menghapus artikel.' });
		}

		throw redirect(303, '/contributor/posts');
	}
};
