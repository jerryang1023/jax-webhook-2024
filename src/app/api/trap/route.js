import db from '@/lib/db'

export async function GET(req, res) {
    // preform a db query to fetch all traps
    const items = await db.all("SELECT * FROM traps");

    // Return the items as a JSON response with status 200
    return new Response(JSON.stringify(items), {
        headers: { "Content-Type": "application/json" },
        status: 200,
    });
}