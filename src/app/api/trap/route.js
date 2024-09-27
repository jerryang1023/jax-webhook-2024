export async function GET(req, res) {
    return new Response(JSON.stringify("API success!"), {
        status: 200,
    });
}