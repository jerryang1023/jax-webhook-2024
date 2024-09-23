import db from "@/lib/db";

export async function POST(req, res) {
    // Perform a database query to delete the corresponding trap
    const dbres = await db.run("DELETE FROM subscriptions WHERE " +
        "subscriptionId=(?)", req.nextUrl.searchParams.get("subscriptionId"));

    // Return the items as a JSON response with status 200
    return new Response(dbres.changes > 0 ? 'Trap has been diffused' : "No such trap was found", {
        headers: { "Content-Type": "application/json" },
        status: dbres.changes > 0 ? 200 : 400,
    });
}