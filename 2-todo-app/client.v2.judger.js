const BASE_URL = "http://localhost:3000/api";

const emoji = (ok) => (ok ? "✅" : "❌");
const title = (text) => {
  const line = "-".repeat(Math.max(6, text.length));
  console.log(`\n${text}\n${line}`);
};
const note = (text) => console.log(text);

async function requestRaw(path, init) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    });
    let json;
    try {
      json = await res.json();
    } catch {
      json = undefined;
    }
    return { res, json };
  } catch (e) {
    return { res: undefined, json: undefined, networkError: String(e && e.message ? e.message : e) };
  }
}

// Spec2 contract validators
function isSuccessJson(json) {
  return json && json.success === true && Object.prototype.hasOwnProperty.call(json, "data");
}

function isErrorJson(json) {
  return json && json.success === false && json.error && typeof json.error.message === "string";
}

function expectStatus(res, expected) {
  return res && res.status === expected;
}

function expectTodoShape(todo) {
  return (
    todo && typeof todo.id === "number" && typeof todo.title === "string" && typeof todo.completed === "boolean"
  );
}

function expectTodosArray(data) {
  return Array.isArray(data) && data.every(expectTodoShape);
}

async function judge(name, run) {
  title(name);
  try {
    const { ok, details } = await run();
    console.log(`${emoji(!!ok)} ${name}`);
    if (!ok && details) {
      note(details);
    }
  } catch (e) {
    console.log(`${emoji(false)} ${name}`);
    note(`Error: ${String(e && e.message ? e.message : e)}`);
  }
}

async function main() {
  let createdId;

  await judge("GET /todos — expect 200 + success true + array of todos", async () => {
    const { res, json, networkError } = await requestRaw("/todos");
    if (networkError) return { ok: false, details: `Network error: ${networkError}` };
    const okStatus = expectStatus(res, 200);
    const okJson = isSuccessJson(json) && expectTodosArray(json.data);
    return { ok: okStatus && okJson, details: okStatus ? undefined : `Status ${res?.status}` };
  });

  await judge("POST /todos — valid -> 201 + todo shape", async () => {
    const payload = { title: "Write integration test" };
    const { res, json, networkError } = await requestRaw("/todos", { method: "POST", body: JSON.stringify(payload) });
    if (networkError) return { ok: false, details: `Network error: ${networkError}` };
    const okStatus = expectStatus(res, 201);
    const okJson = isSuccessJson(json) && expectTodoShape(json.data);
    if (okJson) createdId = json.data.id;
    return { ok: okStatus && okJson, details: !okStatus ? `Status ${res?.status}` : undefined };
  });

  await judge("POST /todos — missing title -> 400 + error json with code", async () => {
    const { res, json, networkError } = await requestRaw("/todos", { method: "POST", body: JSON.stringify({}) });
    if (networkError) return { ok: false, details: `Network error: ${networkError}` };
    const okStatus = expectStatus(res, 400);
    const okJson = isErrorJson(json) && json.error && typeof json.error.code === "string" && json.error.code === "VALIDATION_ERROR";
    return { ok: okStatus && okJson, details: !okStatus ? `Status ${res?.status}` : JSON.stringify(json) };
  });

  await judge("GET /todos/:id — existing -> 200 + todo shape", async () => {
    if (createdId === undefined) return { ok: false, details: "createdId missing" };
    const { res, json, networkError } = await requestRaw(`/todos/${createdId}`);
    if (networkError) return { ok: false, details: `Network error: ${networkError}` };
    const okStatus = expectStatus(res, 200);
    const okJson = isSuccessJson(json) && expectTodoShape(json.data) && json.data.id === createdId;
    return { ok: okStatus && okJson, details: !okStatus ? `Status ${res?.status}` : undefined };
  });

  await judge("GET /todos/:id — non-existing -> 404 + NOT_FOUND", async () => {
    const { res, json, networkError } = await requestRaw(`/todos/999999`);
    if (networkError) return { ok: false, details: `Network error: ${networkError}` };
    const okStatus = expectStatus(res, 404);
    const okJson = isErrorJson(json) && json.error && json.error.code === "NOT_FOUND";
    return { ok: okStatus && okJson, details: !okStatus ? `Status ${res?.status}` : JSON.stringify(json) };
  });

  await judge("PUT /todos/:id — valid -> 200 + updated todo", async () => {
    if (createdId === undefined) return { ok: false, details: "createdId missing" };
    const payload = { title: "Learn Express.js deeply", completed: true };
    const { res, json, networkError } = await requestRaw(`/todos/${createdId}`, { method: "PUT", body: JSON.stringify(payload) });
    if (networkError) return { ok: false, details: `Network error: ${networkError}` };
    const okStatus = expectStatus(res, 200);
    const okJson = isSuccessJson(json) && expectTodoShape(json.data) && json.data.id === createdId && json.data.completed === true && json.data.title === payload.title;
    return { ok: okStatus && okJson, details: !okStatus ? `Status ${res?.status}` : JSON.stringify(json) };
  });

  await judge("PUT /todos/:id — invalid body -> 400 + VALIDATION_ERROR", async () => {
    const { res, json, networkError } = await requestRaw(`/todos/1`, { method: "PUT", body: JSON.stringify({ invalid: true }) });
    if (networkError) return { ok: false, details: `Network error: ${networkError}` };
    const okStatus = expectStatus(res, 400);
    const okJson = isErrorJson(json) && json.error && json.error.code === "VALIDATION_ERROR";
    return { ok: okStatus && okJson, details: !okStatus ? `Status ${res?.status}` : JSON.stringify(json) };
  });

  await judge("DELETE /todos/:id — existing -> 200 + deleted todo", async () => {
    if (createdId === undefined) return { ok: false, details: "createdId missing" };
    const { res, json, networkError } = await requestRaw(`/todos/${createdId}`, { method: "DELETE" });
    if (networkError) return { ok: false, details: `Network error: ${networkError}` };
    const okStatus = expectStatus(res, 200);
    const okJson = isSuccessJson(json) && expectTodoShape(json.data) && json.data.id === createdId;
    return { ok: okStatus && okJson, details: !okStatus ? `Status ${res?.status}` : JSON.stringify(json) };
  });

  await judge("DELETE /todos/:id — non-existing -> 404 + NOT_FOUND", async () => {
    const { res, json, networkError } = await requestRaw(`/todos/999999`, { method: "DELETE" });
    if (networkError) return { ok: false, details: `Network error: ${networkError}` };
    const okStatus = expectStatus(res, 404);
    const okJson = isErrorJson(json) && json.error && json.error.code === "NOT_FOUND";
    return { ok: okStatus && okJson, details: !okStatus ? `Status ${res?.status}` : JSON.stringify(json) };
  });
}

main().catch((err) => {
  console.error("Unexpected judger error:");
  console.error(err);
  if (globalThis && typeof globalThis === "object" && globalThis.process) {
    globalThis.process.exitCode = 1;
  }
});


