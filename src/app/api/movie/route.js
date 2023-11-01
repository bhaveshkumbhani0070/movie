import { verifyJwtToken, verifyToken } from '@/lib/jwt'
import pool from "@/lib/db";

export async function GET(req) {
    try {
        console.log('movie get api');
        const query = 'SELECT * FROM movies';
        const result = await pool.query(query);
        console.log('result', result.rows);
        return new Response(JSON.stringify(result.rows), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify(null), { status: 500 });
    }
}

export async function POST(req) {
    const accessToken = req.headers.get("authorization");
    const token = accessToken.split(' ')[1];
    const decodedToken = verifyJwtToken(token);

    if (!accessToken || !decodedToken) {
        return new Response(JSON.stringify({ error: "unauthorized (wrong or expired token)" }), { status: 403 });
    }

    try {
        const body = await req.json();
        const query = 'INSERT INTO blogs (column1, column2) VALUES ($1, $2) RETURNING *'; // Modify the query according to your column names
        const result = await pool.query(query, [body.column1, body.column2]); // Adjust the values based on your columns

        return new Response(JSON.stringify(result.rows[0]), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify(null), { status: 500 });
    }
}