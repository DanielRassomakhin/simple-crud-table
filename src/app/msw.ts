export async function startMockWorker() {
  const { worker } = await import("@/infrastructure/msw/browser");

  await worker.start({
    onUnhandledRequest: "bypass",
  });
}
