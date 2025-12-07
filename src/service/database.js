import { MariaDBDatabase as Database } from 'fibo-database-mariadb';

export default new Database({
	host: process.env.DATABASE_HOST,
	database: process.env.DATABASE,
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	connectionLimit: 5
});
