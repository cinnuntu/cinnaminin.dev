export async function handler(event, context) {
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
}