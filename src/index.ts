import express from "express";
import authRouter from "./routes/auth.route";
import checkinRouter from "./routes/checkin.route";
import chatRouter from "./routes/chat.route";
const app = express();

app.get("/", (req, res) => {
  res.json({
    message: "Hello World",
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.use("/auth", authRouter);
app.use("/checkin", checkinRouter);
app.use("/chatRouter", chatRouter);
