// lib/api.ts

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// Helper: convert empty strings to null
function cleanBody(body: any) {
  if (!body || typeof body !== "object") return body;

  const cleaned: any = {};
  for (const key in body) {
    const value = body[key];

    // Convert empty string → null
    if (value === "") {
      cleaned[key] = null;
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

export async function apiRequest(
  path: string,
  method: string = "GET",
  body?: any,
  token?: string
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const cleanedBody = body ? cleanBody(body) : undefined;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: cleanedBody ? JSON.stringify(cleanedBody) : undefined,
  });

  let data: any = {};
  try {
    data = await res.json();
  } catch (err) {
    data = {};
  }

  if (!res.ok) {
    const errorMessage =
      data.detail || data.message || JSON.stringify(data) || "Request failed";

    console.error("API Error:", data);
    throw new Error(
      typeof data.detail === "object"
        ? JSON.stringify(data.detail, null, 2)
        : errorMessage
    );
  }

  return data;
}
