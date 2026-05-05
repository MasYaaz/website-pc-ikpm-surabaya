import { json } from '@sveltejs/kit';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { env } from '$env/dynamic/private';
import { s3 } from '$lib/utils/S3Client';

export const GET = async ({ locals: { supabase } }) => {
	const { data: allMedia, error } = await supabase
		.from('media')
		.select('*')
		.order('uploaded_at', { ascending: false });

	if (error) return json({ error: 'Gagal mengambil data' }, { status: 500 });
	return json(allMedia);
};

export const POST = async ({ request, locals: { supabase, user } }) => {
	if (!user) return json({ error: 'Unauthorized' }, { status: 401 });
	const formData = await request.formData();
	const file = formData.get('file') as File;

	// Upload ke R2 (logika S3 sama seperti sebelumnya)
	const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
	const buffer = Buffer.from(await file.arrayBuffer());

	try {
		await s3.send(
			new PutObjectCommand({
				Bucket: env.R2_BUCKET_NAME,
				Key: fileName,
				Body: buffer,
				ContentType: file.type
			})
		);

		const publicUrl = `${env.R2_PUBLIC_URL}/${fileName}`;

		// 2. Simpan metadata ke Supabase (skema public)
		const { data: newMedia, error: dbError } = await supabase
			.from('media')
			.insert({
				filename: fileName,
				path: publicUrl,
				mime_type: file.type,
				size: file.size,
				alt_text: file.name,
				uploader_id: user.id // Menghubungkan ke ID user di tabel profiles
			})
			.select()
			.single();

		if (dbError) throw dbError;

		return json(newMedia);
	} catch (err) {
		console.log(err);
		return json({ error: 'Upload failed' }, { status: 500 });
	}
};
