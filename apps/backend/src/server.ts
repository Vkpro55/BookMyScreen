import app from "./app.js";
import { config } from "./config/config.js";
import "./config/redis.js";
import http from "http";
import { WebSocketServer } from "ws";
import { socketHandlers } from "./socket/socketHandlers.js";

function startServer() {
  const port = config.port;

  // Create the raw HTTP server and pass the Express application to it
  const httpServer = http.createServer(app);

  // Create the WebSocket Server instance, passing the HTTP server
  const allowedOrigins = ["http://localhost:5173"];

  const wss = new WebSocketServer({
    server: httpServer,
    verifyClient: (info, callback) => {
      const origin = info.req.headers.origin;

      if (!origin) {
        callback(false, 403, "Missing Origin header");
        return;
      }

      if (allowedOrigins.includes(origin)) {
        callback(true);
      } else {
        callback(false, 403, "Forbidden Origin");
      }
    },
  });

  wss.on("connection", function connection(ws) {
    void socketHandlers(ws, wss);
  });

  httpServer.listen(port, "0.0.0.0");
}

startServer();
