export async function handler(event, context) {
  try {
    const response = await fetch("https://api.modrinth.com/v2/user/Cinnaminin");
    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch Modrinth data" })
    };
  }
}