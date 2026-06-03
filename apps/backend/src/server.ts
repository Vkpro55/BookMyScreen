import app from "./app.js";
import { config } from "./config/config.js";

function startServer() {
  const port = config.port;

  app.listen(port, "0.0.0.0");
}

startServer();
