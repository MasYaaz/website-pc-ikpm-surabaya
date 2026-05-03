import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getStore } from '@netlify/blobs';

export const load: PageServerLoad = async ({ locals }) => {
	const { supabase } = locals;
	const cacheKey = 'latest-posts-limit-10';
	const postStore = getStore('content-cache');

	// 1. Coba ambil dari Netlify Blobs (Cache)
	const cachedPosts = await postStore.get(cacheKey, { type: 'json' });

	if (cachedPosts) {
		return {
			posts: cachedPosts
		};
	}

	// 2. Jika tidak ada di cache, ambil dari Supabase
	const { data: posts, error: dbError } = await supabase
		.from('posts')
		.select(
			`
            *,
            author:author_id (
                name,
                avatar_url,
                role
            ),
            featuredImage:featured_image_id (
                path,
                alt_text
            )
        `
		)
		.order('created_at', { ascending: false })
		.limit(10);

	if (dbError) {
		console.error('Error fetching posts:', dbError);
		throw error(500, 'Gagal mengambil data postingan');
	}

	const postsData = posts ?? [];

	// 3. Simpan ke Netlify Blobs (Cache selama 10 menit)
	if (postsData.length > 0) {
		await postStore.setJSON(cacheKey, postsData, {
			metadata: { expires: Date.now() + 10 * 60 * 1000 }
		});
	}

	return {
		posts: postsData
	};
};
