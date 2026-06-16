export const socket = new WebSocket("ws://localhost:3000");

/* eslint-disable no-console */

socket.addEventListener("open", () => {
  console.log("✅ WebSocket connected to backend");
});

socket.addEventListener("message", (event) => {
  console.log("📨 Message from backend:", event.data);
});

socket.addEventListener("error", (error) => {
  console.error("❌ WebSocket error:", error);
});

socket.addEventListener("close", () => {
  console.log("🔌 WebSocket closed");
});
