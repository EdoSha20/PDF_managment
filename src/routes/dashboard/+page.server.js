import { db } from '$lib/server/database.js';
import { fail, redirect } from '@sveltejs/kit';
import { put, del } from '@vercel/blob';
import { env } from '$env/dynamic/private';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

// =====================================================
// DASHBOARD LADEN
// =====================================================

export async function load({ locals }) {
	// Nicht eingeloggte Benutzer zum Login schicken
	if (!locals.user) {
		redirect(303, '/login');
	}

	let pdfs;

	// -------------------------------------------------
	// ADMIN: sieht alle PDFs von allen Benutzern
	// -------------------------------------------------

	if (locals.user.role === 'admin') {
		const [rows] = await db.execute(`
			SELECT
				pdfs.id,
				pdfs.original_name,
				pdfs.size_bytes,
				pdfs.blob_url,
				pdfs.uploaded_at,
				users.username
			FROM pdfs
			JOIN users
				ON users.id = pdfs.user_id
			ORDER BY pdfs.uploaded_at DESC
		`);

		pdfs = rows;
	}

	// -------------------------------------------------
	// USER: sieht nur seine eigenen PDFs
	// -------------------------------------------------

	else {
		const [rows] = await db.execute(
			`
			SELECT
				id,
				original_name,
				size_bytes,
				blob_url,
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

// =====================================================
// FORM ACTIONS
// =====================================================

export const actions = {
	// =================================================
	// PDF HOCHLADEN
	// =================================================

	upload: async ({ request, locals }) => {
		// Benutzer muss eingeloggt sein
		if (!locals.user) {
			redirect(303, '/login');
		}

		// Admin darf laut Aufgabenstellung nicht hochladen
		if (locals.user.role === 'admin') {
			return fail(403, {
				error: 'Admins dürfen keine PDFs hochladen.'
			});
		}

		// Prüfen, ob der Blob-Token vorhanden ist
		if (!env.BLOB_READ_WRITE_TOKEN) {
			console.error('BLOB_READ_WRITE_TOKEN fehlt.');

			return fail(500, {
				error: 'Blob-Konfiguration fehlt.'
			});
		}

		const formData = await request.formData();
		const file = formData.get('pdf');

		// -------------------------------------------------
		// DATEI PRÜFEN
		// -------------------------------------------------

		if (!file || typeof file === 'string' || file.size === 0) {
			return fail(400, {
				error: 'Bitte eine PDF auswählen.'
			});
		}

		// Maximale Größe: 5 MB
		if (file.size > MAX_FILE_SIZE) {
			return fail(400, {
				error: 'Die PDF darf maximal 5 MB groß sein.'
			});
		}

		// MIME-Type prüfen
		if (file.type !== 'application/pdf') {
			return fail(400, {
				error: 'Nur PDF-Dateien sind erlaubt.'
			});
		}

		// -------------------------------------------------
		// PDF-INHALT PRÜFEN
		// -------------------------------------------------

		const arrayBuffer = await file.arrayBuffer();
		const bytes = new Uint8Array(arrayBuffer);

		// Eine PDF beginnt normalerweise mit %PDF-
		const header = new TextDecoder().decode(bytes.slice(0, 5));

		if (header !== '%PDF-') {
			return fail(400, {
				error: 'Die Datei ist keine gültige PDF.'
			});
		}

		try {
			// -------------------------------------------------
			// PDF ZU VERCEL BLOB HOCHLADEN
			// -------------------------------------------------

			const blobName = `pdfs/${locals.user.id}/${Date.now()}-${file.name}`;

			const blob = await put(blobName, file, {
				access: 'public',
				addRandomSuffix: true,
				token: env.BLOB_READ_WRITE_TOKEN
			});

			try {
				// ---------------------------------------------
				// URL UND INFORMATIONEN IN MYSQL SPEICHERN
				// ---------------------------------------------

				await db.execute(
					`
					INSERT INTO pdfs
						(
							original_name,
							size_bytes,
							blob_url,
							user_id
						)
					VALUES (?, ?, ?, ?)
					`,
					[
						file.name,
						file.size,
						blob.url,
						locals.user.id
					]
				);
			} catch (databaseError) {
				// Falls MySQL fehlschlägt:
				// bereits hochgeladene Datei wieder aus Blob löschen
				await del(blob.url, {
					token: env.BLOB_READ_WRITE_TOKEN
				}).catch(() => {});

				throw databaseError;
			}

			return {
				success: 'PDF wurde erfolgreich hochgeladen.'
			};
		} catch (error) {
			console.error('PDF Upload Fehler:', error);

			return fail(500, {
				error: 'PDF konnte nicht hochgeladen werden.'
			});
		}
	},

	// =================================================
	// PDF LÖSCHEN
	// =================================================

	delete: async ({ request, locals }) => {
		// Benutzer muss eingeloggt sein
		if (!locals.user) {
			redirect(303, '/login');
		}

		// Nur Admin darf löschen
		if (locals.user.role !== 'admin') {
			return fail(403, {
				error: 'Keine Berechtigung.'
			});
		}

		// Blob-Token kontrollieren
		if (!env.BLOB_READ_WRITE_TOKEN) {
			console.error('BLOB_READ_WRITE_TOKEN fehlt.');

			return fail(500, {
				error: 'Blob-Konfiguration fehlt.'
			});
		}

		const formData = await request.formData();
		const id = Number(formData.get('id'));

		// PDF-ID kontrollieren
		if (!Number.isInteger(id) || id <= 0) {
			return fail(400, {
				error: 'Ungültige PDF-ID.'
			});
		}

		// -------------------------------------------------
		// PDF AUS MYSQL HOLEN
		// -------------------------------------------------

		const [rows] = await db.execute(
			`
			SELECT blob_url
			FROM pdfs
			WHERE id = ?
			LIMIT 1
			`,
			[id]
		);

		if (rows.length === 0) {
			return fail(404, {
				error: 'PDF wurde nicht gefunden.'
			});
		}

		const blobUrl = rows[0].blob_url;

		try {
			// -------------------------------------------------
			// DATEI AUS VERCEL BLOB LÖSCHEN
			// -------------------------------------------------

			await del(blobUrl, {
				token: env.BLOB_READ_WRITE_TOKEN
			});

			// -------------------------------------------------
			// DATENSATZ AUS MYSQL LÖSCHEN
			// -------------------------------------------------

			await db.execute(
				`
				DELETE FROM pdfs
				WHERE id = ?
				`,
				[id]
			);

			return {
				success: 'PDF wurde erfolgreich gelöscht.'
			};
		} catch (error) {
			console.error('PDF Löschen Fehler:', error);

			return fail(500, {
				error: 'PDF konnte nicht gelöscht werden.'
			});
		}
	}
};