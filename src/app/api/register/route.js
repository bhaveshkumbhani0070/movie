import { pool } from "@/lib/db";
import bcrypt from 'bcrypt';

export async function POST(req) {
    try {
        const { username, email, password: pass } = await req.json();

        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(query, [email]);
        const isExisting = result.rows[0];

        if (isExisting) {
            throw new Error("User already exists");
        }

        const hashedPassword = await bcrypt.hash(pass, 10);

        const insertQuery = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *';
        const insertResult = await pool.query(insertQuery, [username, email, hashedPassword]);
        const newUser = insertResult.rows[0];

        const { password, ...user } = newUser;

        return new Response(JSON.stringify(user), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify(error.message), { status: 500 });
    }
}
