const base = process.env.SMOKE_BASE_URL ?? "http://localhost:5000";

async function post(path: string, body: unknown) {
  const res = await fetch(`${base}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${path} failed: ${res.status} ${text}`);
  return JSON.parse(text);
}

async function main() {
  console.log("Health...");
  const health = await fetch(`${base}/api/health`);
  console.log("health status:", health.status);

  console.log("Track example metabolomics report download...");
  await post("/api/events/track", {
    type: "METABOLOMICS_EXAMPLE_REPORT_DOWNLOADED",
    path: "/blood-testing/metabolomics/example",
    meta: { asset: "example-metabolomics-report" },
  });

  console.log("Track pilot signup attempt...");
  await post("/api/events/track", {
    type: "METABOLOMICS_PILOT_SIGNUP_ATTEMPTED",
    userEmail: "smoke@test.com",
    meta: { step: "clicked" },
  });

  console.log("DONE smoke tests");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
