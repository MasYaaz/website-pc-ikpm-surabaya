import { json, error } from '@sveltejs/kit';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '$lib/utils/S3Client';
import { env } from '$env/dynamic/private';

export const DELETE = async ({ params, locals: { supabase, user } }) => {
	// 1. Cek Autentikasi Dasar
	if (!user) throw error(401, 'Unauthorized');

	const id = params.id;
	if (!id) throw error(400, 'ID tidak valid');

	try {
		// 2. Ambil data dari database untuk mendapatkan Key R2
		// RLS otomatis membatasi agar user hanya bisa mengambil data miliknya (atau Admin)
		const { data: fileRecord, error: fetchError } = await supabase
			.from('media')
			.select('path, uploader_id')
			.eq('id', id)
			.single();

		if (fetchError || !fileRecord) {
			throw error(404, 'Media tidak ditemukan atau Anda tidak memiliki akses');
		}

		// 3. Hapus objek dari Cloudflare R2
		// Kita gunakan fileRecord.path atau fileRecord.filename agar lebih akurat
		// Jika path kamu berbentuk URL lengkap, ambil bagian akhirnya saja (Key)
		const fileKey = fileRecord.path.split('/').pop();

		await s3.send(
			new DeleteObjectCommand({
				Bucket: env.R2_BUCKET_NAME,
				Key: fileKey
			})
		);

		// 4. Hapus data dari Database Supabase
		// RLS akan memastikan hanya uploader_id yang sesuai atau Admin yang bisa menghapus
		const { error: deleteError } = await supabase.from('media').delete().eq('id', id);

		if (deleteError) throw deleteError;

		return json({ message: 'Media berhasil dihapus dari R2 dan Database' });
	} catch (err) {
		console.error('Delete failed:', err);
		return json({ error: 'Proses penghapusan gagal' }, { status: 500 });
	}
};
