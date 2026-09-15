import { db } from '$lib/server/database.js';
 
import {
	fail,
	redirect
} from '@sveltejs/kit';
 
import { Buffer } from 'node:buffer';
 
 
const MAX_FILE_SIZE =
	5 * 1024 * 1024;
 
 
// Dashboard laden
export async function load({ locals }) {
 
	if (!locals.user) {
		redirect(303, '/login');
	}
 
 
	let pdfs;
 
 
	// Admin sieht alle PDFs
	if (locals.user.role === 'admin') {
 
		const [rows] = await db.execute(
			`
			SELECT
				pdfs.id,
				pdfs.original_name,
				pdfs.size_bytes,
				pdfs.uploaded_at,
				users.username
 
			FROM pdfs
 
			JOIN users
				ON users.id = pdfs.user_id
 
			ORDER BY pdfs.uploaded_at DESC
			`
		);
 
 
		pdfs = rows;
	}
 
	// Normaler User sieht nur eigene PDFs
	else {
 
		const [rows] = await db.execute(
			`
			SELECT
				id,
				original_name,
				size_bytes,
				uploaded_at
 
			FROM pdfs
 
			WHERE user_id = ?
 
			ORDER BY uploaded_at DESC
			`,
			[locals.user.id]
		);
 
 
		pdfs = rows;
	}
 
 
	return {
		user: locals.user,
		pdfs
	};
}
 
 
export const actions = {
 
	// PDF hochladen
	upload: async ({ request, locals }) => {
 
		if (!locals.user) {
			redirect(303, '/login');
		}
 
 
		// Admin darf nicht hochladen
		if (locals.user.role === 'admin') {
 
			return fail(403, {
				error:
					'Admins dürfen keine PDFs hochladen.'
			});
		}
 
 
		const formData =
			await request.formData();
 
 
		const file =
			formData.get('pdf');
 
 
		if (
			!file ||
			typeof file === 'string' ||
			file.size === 0
		) {
 
			return fail(400, {
				error:
					'Bitte eine PDF auswählen.'
			});
		}
 
 
		// Maximale Größe 5 MB
		if (file.size > MAX_FILE_SIZE) {
 
			return fail(400, {
				error:
					'Die PDF darf maximal 5 MB groß sein.'
			});
		}
 
 
		// Dateityp prüfen
		if (file.type !== 'application/pdf') {
 
			return fail(400, {
				error:
					'Nur PDF-Dateien sind erlaubt.'
			});
		}
 
 
		const arrayBuffer =
			await file.arrayBuffer();
 
 
		const bytes =
			new Uint8Array(arrayBuffer);
 
 
		// PDF-Dateien beginnen mit %PDF-
		const header =
			new TextDecoder()
				.decode(
					bytes.slice(0, 5)
				);
 
 
		if (header !== '%PDF-') {
 
			return fail(400, {
				error:
					'Die Datei ist keine gültige PDF.'
			});
		}
 
 
		const buffer =
			Buffer.from(bytes);
 
 
		// PDF als LONGBLOB speichern
		await db.execute(
			`
			INSERT INTO pdfs
			(
				original_name,
				mime_type,
				size_bytes,
				data,
				user_id
			)
 
			VALUES (?, ?, ?, ?, ?)
			`,
			[
				file.name,
				'application/pdf',
				file.size,
				buffer,
				locals.user.id
			]
		);
 
 
		return {
			success:
				'PDF wurde erfolgreich hochgeladen.'
		};
	},
 
 
	// PDF löschen
	delete: async ({ request, locals }) => {
 
		if (!locals.user) {
			redirect(303, '/login');
		}
 
 
		// Nur Admin darf löschen
		if (locals.user.role !== 'admin') {
 
			return fail(403, {
				error:
					'Keine Berechtigung.'
			});
		}
 
 
		const formData =
			await request.formData();
 
 
		const id =
			Number(
				formData.get('id')
			);
 
 
		if (
			!Number.isInteger(id) ||
			id <= 0
		) {
 
			return fail(400, {
				error:
					'Ungültige PDF-ID.'
			});
		}
 
 
		await db.execute(
			`
			DELETE FROM pdfs
			WHERE id = ?
			`,
			[id]
		);
 
 
		return {
			success:
				'PDF wurde gelöscht.'
		};
	}
};