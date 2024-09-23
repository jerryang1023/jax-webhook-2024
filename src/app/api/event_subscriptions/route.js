import db from '@/lib/db'

export async function GET(req, res) {

    // Perform a database query to retrieve all items from the "items" table
    const items = await db.all("SELECT * FROM subscriptions");

    // Return the items as a JSON response with status 200
    return new Response(JSON.stringify(items), {
        headers: { "Content-Type": "application/json" },
        status: 200,
    });
}