import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { supabase, user } = locals;

	// 1. Proteksi: Pastikan user terautentikasi (Sudah divalidasi di hooks via getUser)
	if (!user) {
		throw error(401, 'Unauthorized: Silakan login terlebih dahulu');
	}

	// 2. Jalankan query menggunakan Supabase Client
	// Supabase secara otomatis akan menerapkan RLS berdasarkan 'user.id' jika sudah diset di DB
	const { data: contributorPosts, error: dbError } = await supabase
		.from('posts')
		.select(
			`
            *,
            author:author_id (
                name:display_name, 
                avatar_url,
                role
            ),
            featuredImage:featured_image_id (
                path,
                alt_text
            )
        `
		)
		.eq('author_id', user.id) // Filter manual tetap bagus untuk kejelasan
		.order('created_at', { ascending: false });

	if (dbError) {
		console.error('Error fetching contributor posts:', dbError);
		throw error(500, 'Gagal mengambil data postingan Anda');
	}

	return {
		posts: contributorPosts ?? []
	};
};
