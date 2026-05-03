import { posts } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm'; // Tambahkan eq
import { setRole } from '$lib/utils/setRole';
import type { PostWithAuthor } from '$lib/types';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from '../../$types';

export const load: PageServerLoad = async ({ locals }) => {
	// 1. Ambil session dari Better Auth
	const { user } = locals;

	// Proteksi tambahan: Jika tidak ada user, jangan jalankan query
	if (!user || !user.id) {
		throw error(401, 'Unauthorized: Silakan login terlebih dahulu');
	}

	const userId = user.id;
	const userRole = user.role ?? 'editor';

	// 2. Jalankan query dengan context RLS
	const contributorPosts: PostWithAuthor[] = await setRole(userId, userRole, async (tx) => {
		return await tx.query.posts.findMany({
			// FILTER: Hanya ambil post milik user ini
			where: eq(posts.authorId, userId),
			with: {
				author: {
					columns: { name: true, image: true, role: true }
				},
				featuredImage: {
					columns: {
						path: true,
						altText: true
					}
				}
			},
			orderBy: [desc(posts.createdAt)]
		});
	});

	return {
		posts: contributorPosts
	};
};
