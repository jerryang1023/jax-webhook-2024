import db from "@/lib/db";

export async function POST(req, res) {
    // Perform a database query to delete the corresponding event subscription
    const dbres = await db.run("DELETE FROM subscriptions WHERE " +
        "subscriptionId=(?)", req.nextUrl.searchParams.get("subscriptionId"));

    // Return the items as a JSON response
    return new Response(dbres.changes > 0 ? 'Event subscription has been removed!' : "No event subscription matching the id was found", {
        headers: { "Content-Type": "application/json" },
        status: dbres.changes > 0 ? 200 : 400,
    });
}