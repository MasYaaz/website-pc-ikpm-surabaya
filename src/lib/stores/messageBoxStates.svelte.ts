class MessageState {
	// Gunakan $state untuk reaktivitas
	open = $state(false);
	message = $state<string>('');
	status = $state<{
		type: 'success' | 'warning' | 'error';
		text: string;
	} | null>(null);

	// Panggil ini saat mulai proses (Loading)
	startLoading() {
		this.status = null; // Reset status jadi null supaya spinner muncul
		this.message = '';
		this.open = true;
	}

	updateProgress(text: string) {
		this.message = text;
	}

	// Kamu bisa tambah fungsi helper di sini (Opsional tapi sangat disarankan)
	show(text: string, type: 'success' | 'warning' | 'error' = 'success') {
		this.status = { text, type };
		this.open = true;
		this.message = '';

		// Otomatis tutup setelah 3 detik
		setTimeout(() => this.close(), 2000);
	}

	close() {
		this.open = false;
	}
}

// EKSPOR INSTANCE (Singleton)
// Ini yang menggantikan 'writable' agar bisa di-import di mana saja
export const uiMessage = new MessageState();
