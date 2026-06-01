import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend server");
});

app.listen(4000, "0.0.0.0");
