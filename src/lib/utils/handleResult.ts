import { type ActionResult } from '@sveltejs/kit';
import { uiMessage } from '$lib/stores/messageBoxStates.svelte';

/**
 * Helper untuk memproses hasil Server Action tanpa 'any'
 */
export const handleFormResult = async <T extends Record<string, unknown>>(
	result: ActionResult,
	onSuccess?: (data: T) => void | Promise<void>
) => {
	// 1. Validasi Error/Failure lewat helper kamu
	if (result.type === 'failure') {
		uiMessage.show(result.data?.message ?? 'Gagal memproses data', 'error');
		return true;
	}
	if (result.type === 'error') {
		uiMessage.show('Kesalahan sistem', 'error');
		return true;
	}

	// 2. Tangani Success
	if (result.type === 'success') {
		// Casting ke T (Generic) yang dibatasi oleh Record<string, unknown>
		const data = result.data as T;

		// Cek apakah 'message' ada dan bertipe string sebelum ditampilkan
		if (typeof data?.message === 'string') {
			uiMessage.show(data.message, 'success');
		}

		if (onSuccess) {
			await onSuccess(data);
		}
	}
};
