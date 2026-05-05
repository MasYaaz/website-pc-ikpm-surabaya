import { json } from '@sveltejs/kit';

export const GET = async ({ url, locals: { supabase } }) => {
	// 1. Ambil query dari URL
	const query = url.searchParams.get('q') || '';

	// Validasi minimal karakter agar tidak membebani database
	if (query.length < 2) {
		return json([]);
	}

	try {
		// 2. Jalankan query dengan Supabase
		// RLS akan otomatis membatasi hasil pencarian sesuai role user yang login
		const { data, error } = await supabase
			.from('posts')
			.select(
				`
                id,
                title,
                slug,
                excerpt,
                created_at,
                author:author_id (
                    name
                ),
				featured_image:featured_image_id (
                    path,
                    alt_text
                )
            `
			)
			// Logika pencarian: cari di judul ATAU ringkasan
			.or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
			.order('created_at', { ascending: false })
			.limit(5);

		if (error) throw error;

		return json(data);
	} catch (err) {
		console.error('Search API Error:', err);
		return json({ error: 'Failed to fetch search results' }, { status: 500 });
	}
};
