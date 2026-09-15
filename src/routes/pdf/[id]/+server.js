import { db } from '$lib/server/database.js';
 
import {
	error,
	redirect
} from '@sveltejs/kit';
 
 
export async function GET({
	params,
	locals
}) {
 
	if (!locals.user) {
		redirect(303, '/login');
	}
 
 
	const id =
		Number(params.id);
 
 
	if (
		!Number.isInteger(id) ||
		id <= 0
	) {
 
		error(
			400,
			'Ungültige PDF-ID'
		);
	}
 
 
	let rows;
 
 
	// Admin darf jede PDF herunterladen
	if (locals.user.role === 'admin') {
 
		[rows] = await db.execute(
			`
			SELECT
				original_name,
				mime_type,
				data
 
			FROM pdfs
 
			WHERE id = ?
 
			LIMIT 1
			`,
			[id]
		);
	}
 
	// User darf nur eigene PDF herunterladen
	else {
 
		[rows] = await db.execute(
			`
			SELECT
				original_name,
				mime_type,
				data
 
			FROM pdfs
 
			WHERE id = ?
			AND user_id = ?
 
			LIMIT 1
			`,
			[
				id,
				locals.user.id
			]
		);
	}
 
 
	if (rows.length === 0) {
 
		error(
			404,
			'PDF nicht gefunden.'
		);
	}
 
 
	const pdf = rows[0];
 
 
	const filename =
		encodeURIComponent(
			pdf.original_name
		);
 
 
	return new Response(
		new Uint8Array(pdf.data),
		{
			headers: {
 
				'Content-Type':
					pdf.mime_type,
 
				'Content-Disposition':
					`attachment; filename*=UTF-8''${filename}`,
 
				'Cache-Control':
					'private, no-store'
			}
		}
	);
}