const API = import.meta.env.VITE_API_BASE;

export async function listMessages({ username, order = "desc" } = {}) {
  let user = "";
  if (typeof username === "string") user = username.trim();
  else if (username && typeof username === "object" && "target" in username)
    user = String(username.target?.value ?? "").trim();
  else if (username != null) user = String(username).trim();

  const qs = new URLSearchParams();
  if (user) qs.set("username", user);
  if (order) qs.set("order", order);

  const url = `${API}/messages?${qs.toString()}`;
  console.log("[API] GET", url, { rawUsername: username, coerced: user, type: typeof username });

  const res = await fetch(url);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `GET failed: ${res.status}`);
  return data;
}

export async function createMessage({ username, text }) {
  const url = `${API}/messages`;

  if (!username?.trim() || !text?.trim()) {
    throw new Error("username and text (client) are required");
  }

  const body = { username: username.trim(), text: text.trim() };
  console.log("[API] POST", url, body);

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `POST failed: ${res.status}`);
  return data;
}


export async function updateMessage(id, { text }) {
  if (!id) throw new Error("id required");
  if (!text?.trim()) throw new Error("text (client) is required");

  const url = `${API}/messages/${id}`;
  const body = { text: text.trim() };
  console.log("[API] PUT", url, body);

  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `PUT failed: ${res.status}`);
  return data;
}

console.log("[ENV] VITE_API_BASE =", import.meta.env.VITE_API_BASE);
