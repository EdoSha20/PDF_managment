
import mysql from 'mysql2/promise';
import { env } from '$env/dynamic/private';
 
// Verbindungspool zur MySQL-Datenbank
export const db = mysql.createPool({
	host: env.DB_HOST,
	port: Number(env.DB_PORT),
	user: env.DB_USER,
	password: env.DB_PASSWORD,
	database: env.DB_NAME,
 
	waitForConnections: true,
	connectionLimit: 5
});