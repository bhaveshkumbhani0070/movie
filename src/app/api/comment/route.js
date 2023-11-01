import pool from "@/lib/db";
import { verifyJwtToken } from "@/lib/jwt";

export async function POST(req) {
    await db.connect()

    const accessToken = req.headers.get('authorization')
    const token = accessToken.split(" ")[1]

    const decodedToken = verifyJwtToken(token)

    if (!accessToken || !decodedToken) {
        return new Response(JSON.stringify({ error: "unauthorized (wrong or expired token)" }), { status: 403 })
    }

    try {
        const body = await req.json()

        let newComment = await pool.query('Insert into comment set $1', [body])

        return new Response(JSON.stringify(newComment), { status: 201 })
    } catch (error) {
        return new Response(JSON.stringify(null), { status: 500 })
    }
}