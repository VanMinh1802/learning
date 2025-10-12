const BASE_URL = "http://localhost:3000/api";

const emoji = (ok) => (ok ? "✅" : "❌");
const title = (text) => {
  const line = "-".repeat(Math.max(6, text.length));
  console.log(`\n${text}\n${line}`);
};
// Minimal debug helper (no JSON dumps)
const note = (text) => console.log(text);

const request = async (path, init) => {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    });
    const json = await res.json().catch(() => ({ success: false, error: { code: "INVALID_JSON", message: `Non-JSON (${res.status})` } }));
    return json;
  } catch (e) {
    return { success: false, error: { code: "NETWORK_ERROR", message: String(e && e.message ? e.message : e) } };
  }
};

const expectSuccess = (json) => json && json.success === true;
const expectErrorCode = (json, code) => json && json.success === false && json.error && json.error.code === code;

async function test(name, run) {
  title(name);
  try {
    const passed = await run();
    console.log(`${emoji(!!passed)} ${name}`);
  } catch (e) {
    console.log(`${emoji(false)} ${name}`);
    note(`Error: ${String(e && e.message ? e.message : e)}`);
  }
}

async function main() {
  let createdId;
  await test("GET example always success - fetch google.com", async () => {
    // Test only request, no validation
    const json = await fetch("https://www.google.com");
    if (json.status >= 200 && json.status < 300) {
      return true;
    }
    return false;
  });

  await test("GET /todos — list", async () => {
    const json = await request("/todos");
    return expectSuccess(json) && Array.isArray(json.data);
  });

  await test("POST /todos — create valid", async () => {
    const json = await request("/todos", { method: "POST", body: JSON.stringify({ title: "Write integration test" }) });
    if (expectSuccess(json) && json.data && typeof json.data.id === "number") {
      createdId = json.data.id;
      return true;
    }
    return false;
  });

  await test("POST /todos — missing title -> 400", async () => {
    const json = await request("/todos", { method: "POST", body: JSON.stringify({}) });
    const ok = expectErrorCode(json, "VALIDATION_ERROR");
    if (!ok && json && json.error) note(`Got error: ${json.error.code || "UNKNOWN"} - ${json.error.message || ""}`);
    return ok;
  });

  await test("GET /todos/:id — existing", async () => {
    if (createdId === undefined) return false;
    const json = await request(`/todos/${createdId}`);
    return expectSuccess(json) && json.data && json.data.id === createdId;
  });

  await test("GET /todos/:id — non-existing -> 404", async () => {
    const json = await request(`/todos/999999`);
    const ok = expectErrorCode(json, "NOT_FOUND");
    if (!ok && json && json.error) note(`Got error: ${json.error.code || "UNKNOWN"} - ${json.error.message || ""}`);
    return ok;
  });

  await test("PUT /todos/:id — valid update", async () => {
    if (createdId === undefined) return false;
    const payload = { title: "Learn Express.js deeply", completed: true };
    const json = await request(`/todos/${createdId}`, { method: "PUT", body: JSON.stringify(payload) });
    return expectSuccess(json) && json.data && json.data.id === createdId && json.data.completed === true && json.data.title === payload.title;
  });

  await test("PUT /todos/:id — invalid body -> 400", async () => {
    const json = await request(`/todos/1`, { method: "PUT", body: JSON.stringify({ invalid: true }) });
    const ok = expectErrorCode(json, "VALIDATION_ERROR");
    if (!ok && json && json.error) note(`Got error: ${json.error.code || "UNKNOWN"} - ${json.error.message || ""}`);
    return ok;
  });

  await test("DELETE /todos/:id — existing", async () => {
    if (createdId === undefined) return false;
    const json = await request(`/todos/${createdId}`, { method: "DELETE" });
    return expectSuccess(json) && json.data && json.data.id === createdId;
  });

  await test("DELETE /todos/:id — non-existing -> 404", async () => {
    const json = await request(`/todos/999999`, { method: "DELETE" });
    const ok = expectErrorCode(json, "NOT_FOUND");
    if (!ok && json && json.error) note(`Got error: ${json.error.code || "UNKNOWN"} - ${json.error.message || ""}`);
    return ok;
  });
}

main().catch((err) => {
  console.error("Unexpected runner error:");
  console.error(err);
  if (globalThis && typeof globalThis === "object" && globalThis.process) {
    globalThis.process.exitCode = 1;
  }
});


