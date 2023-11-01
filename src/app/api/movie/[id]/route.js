import pool from "@/lib/db";
import { verifyJwtToken } from "@/lib/jwt";

export async function GET(req, ctx) {
    const id = ctx.params.id
    try {
        const query = 'SELECT * FROM movies where id = $1';
        const result = await pool.query(query, [id]);
        console.log('movie get api', result)
        return new Response(JSON.stringify(result), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify(null), { status: 500 })
    }
}

export async function PUT(req, ctx) {
    const id = ctx.params.id;
    const accessToken = req.headers.get('authorization');
    const token = accessToken.split(" ")[1];
    const decodedToken = verifyJwtToken(token);

    if (!accessToken || !decodedToken) {
        return new Response(JSON.stringify({ error: "unauthorized (wrong or expired token)" }), { status: 403 });
    }

    try {
        const body = await req.json();
        const query = 'SELECT * FROM blogs WHERE id = $1';
        const result = await pool.query(query, [id]);
        const blog = result.rows[0];

        if (blog.author_id.toString() !== decodedToken._id.toString()) {
            return new Response(JSON.stringify({ msg: 'Only author can update their blog' }), { status: 403 });
        }

        const updateQuery = 'UPDATE blogs SET column1 = $1, column2 = $2 WHERE id = $3'; // Modify the query according to your column names
        await pool.query(updateQuery, [body.column1, body.column2, id]); // Adjust the values based on your columns

        return new Response(JSON.stringify({ msg: 'Successfully updated blog' }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify(null), { status: 500 });
    }
}

export async function DELETE(req, ctx) {
    const id = ctx.params.id;
    const accessToken = req.headers.get('authorization');
    const token = accessToken.split(' ')[1];
    const decodedToken = verifyJwtToken(token);

    if (!accessToken || !decodedToken) {
        return new Response(JSON.stringify({ error: "unauthorized (wrong or expired token)" }), { status: 403 });
    }

    try {
        const query = 'SELECT * FROM blogs WHERE id = $1';
        const result = await pool.query(query, [id]);
        const blog = result.rows[0];

        if (blog.author_id.toString() !== decodedToken._id.toString()) {
            return new Response(JSON.stringify({ msg: 'Only author can delete their blog' }), { status: 403 });
        }

        const deleteQuery = 'DELETE FROM blogs WHERE id = $1';
        await pool.query(deleteQuery, [id]);

        return new Response(JSON.stringify({ msg: 'Successfully deleted blog' }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify(null), { status: 500 });
    }
}
// blog -> [id] -> like -> route.js


// http://localhost:3000/api/blog/someid/like