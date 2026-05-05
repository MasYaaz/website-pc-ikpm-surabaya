import { fail, redirect } from '@sveltejs/kit';
import slugify from 'slugify';

export const actions = {
	default: async ({ request, locals }) => {
		// 1. Ambil user dari locals (hasil olahan hooks + Netlify Blobs)
		const user = locals.user;

		if (!user) return fail(401, { message: 'Unauthorized' });

		// Proteksi tambahan jika user nonactive mencoba kirim data
		if (user.status === 'nonactive') {
			return fail(403, {
				message: 'Akun Anda belum aktif. Akses menulis ditolak.'
			});
		}

		const formData = await request.formData();

		// 2. Ambil data & bersihkan
		const title = (formData.get('title') as string)?.trim();
		const content = (formData.get('content') as string)?.trim();
		const excerpt = (formData.get('excerpt') as string)?.trim();
		const featuredImageId = formData.get('featuredImageId');
		const status = formData.get('status') as 'draft' | 'publish';

		// 3. VALIDASI INPUT
		const errors: Record<string, string> = {};

		if (!title) errors.title = 'Judul artikel tidak boleh kosong';
		else if (title.length < 5) errors.title = 'Judul terlalu pendek';

		if (!content || content === '<p></p>') errors.content = 'Konten tidak boleh kosong';

		if (Object.keys(errors).length > 0) {
			return fail(400, {
				errors,
				data: { title, excerpt, featuredImageId, status }
			});
		}

		// 4. Generate Slug
		const slug = slugify(title, { lower: true, strict: true });

		// 5. INSERT MENGGUNAKAN SUPABASE QUERY
		const { error } = await locals.supabase.from('posts').insert({
			author_id: user.id, // Sesuaikan nama kolom di DB (snake_case)
			title,
			slug,
			content,
			excerpt: excerpt || null,
			status: status || 'draft',
			featured_image_id: featuredImageId ? featuredImageId : null,
			post_type: 'post'
		});

		if (error) {
			console.error('Supabase Error:', error);

			// Cek error kode unik Postgres (23505 = Unique Violation)
			if (error.code === '23505') {
				return fail(400, { message: 'Slug atau judul sudah digunakan.' });
			}

			return fail(500, { message: 'Gagal menyimpan artikel ke Supabase.' });
		}

		throw redirect(303, '/contributor/posts');
	}
};
