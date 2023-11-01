import { pool } from "@/lib/db";
import { verifyJwtToken } from "@/lib/jwt";

export async function PUT(req, ctx) {
    const id = ctx.params.id;
    const accessToken = req.headers.get("authorization");
    const token = accessToken.split(" ")[1];
    console.log(token);
    const decodedToken = verifyJwtToken(token);

    if (!accessToken || !decodedToken) {
        return new Response(JSON.stringify({ error: "unauthorized (wrong or expired token)" }), { status: 403 });
    }

    try {
        const query = 'SELECT * FROM blogs WHERE id = $1';
        const result = await pool.query(query, [id]);
        const blog = result.rows[0];

        const likes = JSON.parse(blog.likes);
        if (likes.includes(decodedToken._id)) {
            const filteredLikes = likes.filter((like) => like !== decodedToken._id);
            const updateQuery = 'UPDATE blogs SET likes = $1 WHERE id = $2';
            await pool.query(updateQuery, [JSON.stringify(filteredLikes), id]);
        } else {
            likes.push(decodedToken._id);
            const updateQuery = 'UPDATE blogs SET likes = $1 WHERE id = $2';
            await pool.query(updateQuery, [JSON.stringify(likes), id]);
        }

        return new Response(JSON.stringify({ msg: 'Successfully interacted with the blog' }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify(null), { status: 500 });
    }
}
