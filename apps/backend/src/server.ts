import app from "./app.js";
import http from "http";

const httpserver = http.createServer(app);

httpserver.listen(4000, "0.0.0.0");
