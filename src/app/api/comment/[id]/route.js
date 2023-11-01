import { pool } from "@/lib/db";
import { verifyJwtToken } from "@/lib/jwt";

export async function GET(req, ctx) {
    // blog id !!
    const id = ctx.params.id;

    try {
        const query = 'SELECT * FROM comments WHERE blog_id = $1';
        const result = await pool.query(query, [id]);
        return new Response(JSON.stringify(result.rows), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify(null), { status: 500 });
    }
}

export async function DELETE(req, ctx) {
    const id = ctx.params.id;
    const accessToken = req.headers.get('authorization');
    const token = accessToken.split(" ")[1];
    const decodedToken = verifyJwtToken(token);

    if (!accessToken || !decodedToken) {
        return new Response(JSON.stringify({ error: "unauthorized (wrong or expired token)" }), { status: 403 });
    }

    try {
        const query = 'SELECT * FROM comments WHERE id = $1';
        const result = await pool.query(query, [id]);
        const comment = result.rows[0];

        if (comment.author_id !== decodedToken._id) {
            return new Response(JSON.stringify({ msg: "Only author can delete their comment" }), { status: 401 });
        }

        const deleteQuery = 'DELETE FROM comments WHERE id = $1';
        await pool.query(deleteQuery, [id]);

        return new Response(JSON.stringify({ msg: 'Successfully deleted comment' }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify(null), { status: 500 });
    }
}
