import express from "express";
import prisma from "@repo/db/client";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend server");
});

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();

  return res.json({
    msg: "Get data",
    users,
  });
});

app.post("/user", async (req, res) => {
  const { email, name } = req.body;
  const user = await prisma.user.create({
    data: {
      email,
      name,
    },
  });

  return res.json({
    msg: "Post data",
    user,
  });
});

// by default bind to localhost, so it only listens to the traffic coming from your machine or ec2 machine
// if this app present inside the docker container of vm then it only listen localhost of vm machine
// to make it accessible to outside world of vm make sure it bind to 
// apply the binds
app.listen(4000, '0.0.0.0', () => {
  console.log('Server running on 0.0.0.0:4000');
});
