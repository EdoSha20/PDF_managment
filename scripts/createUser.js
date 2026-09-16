import 'dotenv/config';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const [username, password, role = 'user'] = process.argv.slice(2);

if (!username || !password) {
	console.log('Benutzung: node scripts/createUser.js USERNAME PASSWORT ROLE');
	process.exit(1);
}

if (role !== 'user' && role !== 'admin') {
	console.log('Role muss user oder admin sein.');
	process.exit(1);
}

// Nur zum Prüfen - Passwort wird NICHT angezeigt
console.log('DB:', {
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	database: process.env.DB_NAME,
	passwordVorhanden: Boolean(process.env.DB_PASSWORD),
	passwordLength: process.env.DB_PASSWORD?.length
});

const connection = await mysql.createConnection({
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME
});

const passwordHash = await bcrypt.hash(password, 12);

try {
	await connection.execute(
		`
		INSERT INTO users
			(username, password_hash, role)
		VALUES (?, ?, ?)
		`,
		[username, passwordHash, role]
	);

	console.log(`User ${username} wurde erstellt.`);
	console.log(`Role: ${role}`);
} catch (error) {
	console.error('Fehler:', error.message);
} finally {
	await connection.end();
}